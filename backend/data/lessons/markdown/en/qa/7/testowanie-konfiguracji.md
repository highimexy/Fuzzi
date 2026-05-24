# Testowanie Konfiguracji i Infrastruktury

Aplikacja może działać idealnie — ale z błędną konfiguracją produkcyjną wszystko się posypie. Testowanie konfiguracji to obszar gdzie QA może zapobiec incydentom które deweloperzy pomijają.

## Dlaczego Konfiguracja Się Psuje

- Env variable ma inną wartość na staging vs prod
- Sekret wygasł i nie był rotowany
- Nowy deployment nie miał zaktualizowanej config mapy
- Feature flag jest enabled na staging, disabled na prod
- Certyfikat SSL wygasa za 3 dni (nikt nie sprawdził)

Każdy z tych scenariuszy to incydent produkcyjny który można było wychwycić w testowaniu.

## Testowanie Environment Variables

### Co Sprawdzać

```bash
# Sprawdzenie czy wymagane env vars są zdefiniowane
required_vars=(
  "DATABASE_URL"
  "REDIS_URL" 
  "JWT_SECRET"
  "STRIPE_API_KEY"
  "SMTP_HOST"
)

for var in "${required_vars[@]}"; do
  if [[ -z "${!var}" ]]; then
    echo "MISSING: $var"
    exit 1
  fi
done
```

### Typy Problemów z Env Vars

```
1. Wartość istnieje ale jest pusta: DATABASE_URL=""
2. Wartość ma trailing whitespace: DATABASE_URL="postgres://... " 
3. Wartość to placeholder: DATABASE_URL="REPLACE_ME"
4. Wartość jest dla innego env: API_KEY="sk-test-..." na prod
5. Wartość wygasła: API key lub token który stracił ważność
```

### Testy Startowe Aplikacji

Dobra aplikacja weryfikuje konfigurację przy starcie:

```go
func validateConfig(cfg *Config) error {
    if cfg.DatabaseURL == "" {
        return errors.New("DATABASE_URL is required")
    }
    if cfg.JWTSecret == "" {
        return errors.New("JWT_SECRET is required")
    }
    if len(cfg.JWTSecret) < 32 {
        return errors.New("JWT_SECRET must be at least 32 characters")
    }
    return nil
}
```

**Co testować:**
- Czy aplikacja odmawia startu przy brakującej krytycznej konfiguracji?
- Czy komunikat błędu jasno wskazuje co jest brakujące?
- Czy aplikacja nie ujawnia wartości sekretów w logach?

## Testowanie Certyfikatów SSL/TLS

**Manualne sprawdzenie:**
```bash
# Sprawdź datę wygaśnięcia
openssl s_client -connect your-domain.com:443 2>/dev/null | openssl x509 -noout -dates

# Sprawdź chain certyfikatów
openssl s_client -connect your-domain.com:443 -showcerts 2>/dev/null

# Sprawdź konfigurację TLS (czy TLS 1.0/1.1 jest wyłączone)
nmap --script ssl-enum-ciphers -p 443 your-domain.com
```

**Automatyczne monitorowanie:**
```bash
# Script do alertu gdy certyfikat wygasa za < 30 dni
days_until_expiry=$(( ($(date -d "$(openssl s_client -connect $HOST:443 2>/dev/null | openssl x509 -noout -enddate | cut -d= -f2)" +%s) - $(date +%s)) / 86400 ))

if [ $days_until_expiry -lt 30 ]; then
  echo "WARNING: Certificate expires in $days_until_expiry days"
fi
```

## Testowanie Feature Flags

Feature flags muszą być testowane per środowisko.

**Matryca testów:**
```
Flag: new_checkout_v2

| Środowisko | Flag value | Expected behavior         |
|-----------|-----------|--------------------------|
| dev       | enabled   | Nowy checkout wyświetlany |
| staging   | enabled   | Nowy checkout wyświetlany |
| prod      | disabled  | Stary checkout            |
```

**Co testować:**
```
1. Czy flag jest disabled na prod gdy powinna być?
2. Czy zmiana flag nie wymaga redeploymentu? (hot reload)
3. Co się dzieje gdy service flagowy jest niedostępny? 
   - Czy aplikacja fallbackuje na safe default?
   - Czy nie crasha?
4. Czy flag wpływa tylko na to co powinien?
   - Zmiana checkout nie powinna wpływać na payment
```

## Testowanie Secrets Rotation

Sekrety (API keys, DB passwords) powinny być rotowane regularnie. Testuj proces:

```
Scenariusz rotacji:
1. Stary sekret: sk-old-key-123
2. Nowy sekret: sk-new-key-456

Test procesu:
- Czy aplikacja może działać ze starym sekretem podczas wdrożenia nowego?
- Czy jest zero-downtime rotation?
- Co się dzieje gdy aplikacja używa wygasłego sekretu?
- Czy logi nie ujawniają wartości sekretu po błędzie auth?
```

## Infrastructure as Code (IaC) Testing

Terraform, Kubernetes, Helm — konfiguracja infrastruktury to kod który też można testować.

**Terraform — plan review:**
```bash
terraform plan -out=tfplan
# QA review: czy plan usuwa resources? Modyfikuje security groups?
# "Destroy" jest zawsze red flag
```

**Kubernetes — policy testing:**
```bash
# Sprawdź czy pods nie mają nadmiernych uprawnień
kubectl get pods -A -o json | jq '.items[] | select(.spec.securityContext.privileged == true)'

# Sprawdź resource limits (brak limits = pod może zjeść cały node)
kubectl describe pod my-pod | grep -A4 Limits
```

**Helm — lint i test:**
```bash
helm lint ./my-chart
helm template ./my-chart | kubectl apply --dry-run=client -f -
```

## Checklista Testowania Konfiguracji

```
□ Wszystkie wymagane env vars są zdefiniowane i niepuste
□ Env vars nie zawierają placeholder values ("REPLACE_ME")
□ Aplikacja odmawia startu przy brakującej krytycznej konfiguracji
□ Sekrety nie są w logach (grep "sk-" w logach)
□ Certyfikat SSL ważny > 30 dni
□ TLS 1.0/1.1 wyłączone
□ Feature flags mają poprawne wartości per środowisko
□ Fallback gdy service feature flags niedostępny
□ Secrets rotation przetestowana
□ Terraform plan przejrzany (brak "destroy" dla prod resources)
□ Kubernetes resource limits zdefiniowane
□ Kubernetes pods nie mają privileged: true
```
