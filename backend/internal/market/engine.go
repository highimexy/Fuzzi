package market

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"strconv"
	"sync"
	"time"

	"github.com/gorilla/websocket"
)

// --- Struktury dla API ---

type BinancePayload struct {
	Data BinanceTicker `json:"data"`
}

type BinanceTicker struct {
	Symbol      string      `json:"s"`
	Price       interface{} `json:"c"`
	ChangePrct  interface{} `json:"P"`
	CloseTime   interface{} `json:"C"`
	EventTime   interface{} `json:"E"`
	PriceChange interface{} `json:"p"`
}

type FinnhubQuote struct {
	CurrentPrice float64 `json:"c"`
	ChangePrct   float64 `json:"dp"`
}

type APIAsset struct {
	QuerySymbol string
	UIDisplay   string
	CategoryIdx int
}

// --- Silnik ---

type Engine struct {
	mu   sync.RWMutex
	data []MarketRow
	hub  *Hub
}

func NewEngine(hub *Hub) *Engine {
	return &Engine{
		hub: hub,
		data: []MarketRow{
			{
				Category: "CRYPTO",
				Items: []Asset{
					{Sym: "BTC", Price: "...", Chg: "...", Up: true},
					{Sym: "ETH", Price: "...", Chg: "...", Up: true},
					{Sym: "SOL", Price: "...", Chg: "...", Up: true},
					{Sym: "BNB", Price: "...", Chg: "...", Up: true},
					{Sym: "XRP", Price: "...", Chg: "...", Up: true},
					{Sym: "DOGE", Price: "...", Chg: "...", Up: true},
					{Sym: "ADA", Price: "...", Chg: "...", Up: true},
					{Sym: "AVAX", Price: "...", Chg: "...", Up: true},
					{Sym: "DOT", Price: "...", Chg: "...", Up: true},
					{Sym: "LINK", Price: "...", Chg: "...", Up: true},
				},
			},
			{
				Category: "US TECH",
				Items: []Asset{
					{Sym: "NVDA", Price: "...", Chg: "...", Up: true},
					{Sym: "AAPL", Price: "...", Chg: "...", Up: true},
					{Sym: "MSFT", Price: "...", Chg: "...", Up: true},
					{Sym: "AMD", Price: "...", Chg: "...", Up: true},
					{Sym: "AMZN", Price: "...", Chg: "...", Up: true},
					{Sym: "INTC", Price: "...", Chg: "...", Up: true},
					{Sym: "ADBE", Price: "...", Chg: "...", Up: true},
					{Sym: "ORCL", Price: "...", Chg: "...", Up: true},
					{Sym: "QCOM", Price: "...", Chg: "...", Up: true},
					{Sym: "IBM", Price: "...", Chg: "...", Up: true},
				},
			},
			{
				Category: "DEVTOOLS & QA",
				Items: []Asset{
					{Sym: "TEAM", Price: "...", Chg: "...", Up: true},
					{Sym: "DDOG", Price: "...", Chg: "...", Up: true},
					{Sym: "SNOW", Price: "...", Chg: "...", Up: true},
					{Sym: "NOW", Price: "...", Chg: "...", Up: true},
					{Sym: "CRWD", Price: "...", Chg: "...", Up: true},
					{Sym: "MDB", Price: "...", Chg: "...", Up: true},
					{Sym: "NET", Price: "...", Chg: "...", Up: true},
					{Sym: "OKTA", Price: "...", Chg: "...", Up: true},
					{Sym: "ZS", Price: "...", Chg: "...", Up: true},
					{Sym: "HUBS", Price: "...", Chg: "...", Up: true},
				},
			},
			{
				Category: "TRENDING",
				Items: []Asset{
					{Sym: "GOOGL", Price: "...", Chg: "...", Up: true},
					{Sym: "META", Price: "...", Chg: "...", Up: true},
					{Sym: "MSTR", Price: "...", Chg: "...", Up: true},
					{Sym: "COIN", Price: "...", Chg: "...", Up: true},
					{Sym: "PLTR", Price: "...", Chg: "...", Up: true},
					{Sym: "TSLA", Price: "...", Chg: "...", Up: true},
					{Sym: "NFLX", Price: "...", Chg: "...", Up: true},
					{Sym: "SHOP", Price: "...", Chg: "...", Up: true},
					{Sym: "SQ", Price: "...", Chg: "...", Up: true},
					{Sym: "SPY", Price: "...", Chg: "...", Up: true},
				},
			},
		},
	}
}

func (e *Engine) GetData() []MarketRow {
	e.mu.RLock()
	defer e.mu.RUnlock()
	return e.data
}

func (e *Engine) Start(finnhubAPIKey string) {
	log.Println("[MARKET ENGINE] Booting up data streams...")

	// 1. WebSocket Binance (Krypto - Nielimitowany)
	go e.connectBinance()

	// 2. Finnhub (Akcje US - Tech & Trending)
	if finnhubAPIKey != "" {
		log.Println("[MARKET ENGINE] Finnhub key found. Starting US Stocks.")
		go e.pollFinnhubAssets(finnhubAPIKey)
	} else {
		log.Println("[MARKET WARNING] Finnhub key missing. US Stocks inactive.")
	}
}

// --- Moduł 1: Akcje (Finnhub) ---
func (e *Engine) pollFinnhubAssets(apiKey string) {
	// 30 spółek × 1.2s = 36s/cykl = 50 req/min (limit: 60 req/min)
	assetsToTrack := []APIAsset{
		// Kategoria: US TECH (Index 1)
		{"NVDA", "NVDA", 1},
		{"AAPL", "AAPL", 1},
		{"MSFT", "MSFT", 1},
		{"AMD", "AMD", 1},
		{"AMZN", "AMZN", 1},
		{"INTC", "INTC", 1},
		{"ADBE", "ADBE", 1},
		{"ORCL", "ORCL", 1},
		{"QCOM", "QCOM", 1},
		{"IBM", "IBM", 1},
		// Kategoria: DEVTOOLS & QA (Index 2)
		{"TEAM", "TEAM", 2},
		{"DDOG", "DDOG", 2},
		{"SNOW", "SNOW", 2},
		{"NOW", "NOW", 2},
		{"CRWD", "CRWD", 2},
		{"MDB", "MDB", 2},
		{"NET", "NET", 2},
		{"OKTA", "OKTA", 2},
		{"ZS", "ZS", 2},
		{"HUBS", "HUBS", 2},
		// Kategoria: TRENDING (Index 3)
		{"GOOGL", "GOOGL", 3},
		{"META", "META", 3},
		{"MSTR", "MSTR", 3},
		{"COIN", "COIN", 3},
		{"PLTR", "PLTR", 3},
		{"TSLA", "TSLA", 3},
		{"NFLX", "NFLX", 3},
		{"SHOP", "SHOP", 3},
		{"SQ", "SQ", 3},
		{"SPY", "SPY", 3},
	}

	client := &http.Client{Timeout: 8 * time.Second}

	ticker := time.NewTicker(1200 * time.Millisecond)
	defer ticker.Stop()

	for {
		now := time.Now().UTC()
		if now.Weekday() == time.Saturday || now.Weekday() == time.Sunday {
			log.Println("[MARKET ENGINE] Weekend detected. Pausing Finnhub (US.STK).")

			e.mu.Lock()
			for idx := 1; idx <= 3; idx++ {
				e.data[idx].Status = "CLOSED"
				for i := range e.data[idx].Items {
					e.data[idx].Items[i].Price = "..."
					e.data[idx].Items[i].Chg = "..."
				}
			}
			currentData := e.data
			e.mu.Unlock()

			e.hub.Broadcast(currentData)
			time.Sleep(1 * time.Hour)
			continue
		}

		e.mu.Lock()
		for idx := 1; idx <= 3; idx++ {
			e.data[idx].Status = ""
		}
		e.mu.Unlock()

		for _, asset := range assetsToTrack {
			<-ticker.C

			url := fmt.Sprintf("https://finnhub.io/api/v1/quote?symbol=%s&token=%s", asset.QuerySymbol, apiKey)
			resp, err := client.Get(url)
			if err != nil {
				continue
			}

			body, err := io.ReadAll(resp.Body)
			resp.Body.Close()
			if err != nil {
				continue
			}

			var quote FinnhubQuote
			if err := json.Unmarshal(body, &quote); err != nil {
				continue
			}
			if quote.CurrentPrice == 0 {
				continue
			}

			formattedPrice := fmt.Sprintf("%.2f", quote.CurrentPrice)
			isUp := quote.ChangePrct >= 0
			sign := ""
			if isUp {
				sign = "+"
			}
			formattedChange := fmt.Sprintf("%s%.2f%%", sign, quote.ChangePrct)

			e.mu.Lock()
			for j := range e.data[asset.CategoryIdx].Items {
				if e.data[asset.CategoryIdx].Items[j].Sym == asset.UIDisplay {
					e.data[asset.CategoryIdx].Items[j].Price = formattedPrice
					e.data[asset.CategoryIdx].Items[j].Chg = formattedChange
					e.data[asset.CategoryIdx].Items[j].Up = isUp
					break
				}
			}
			currentData := e.data
			e.mu.Unlock()

			e.hub.Broadcast(currentData)
		}
	}
}

// --- Moduł 2: Krypto (Binance WS) ---

func parseSafeFloat(val interface{}) float64 {
	switch v := val.(type) {
	case float64:
		return v
	case string:
		f, _ := strconv.ParseFloat(v, 64)
		return f
	default:
		return 0
	}
}

var binanceSymMap = map[string]string{
	"BTCUSDT":  "BTC",
	"ETHUSDT":  "ETH",
	"SOLUSDT":  "SOL",
	"BNBUSDT":  "BNB",
	"XRPUSDT":  "XRP",
	"DOGEUSDT": "DOGE",
	"ADAUSDT":  "ADA",
	"AVAXUSDT": "AVAX",
	"DOTUSDT":  "DOT",
	"LINKUSDT": "LINK",
}

func (e *Engine) connectBinance() {
	url := "wss://stream.binance.com:9443/stream?streams=" +
		"btcusdt@ticker/ethusdt@ticker/solusdt@ticker/bnbusdt@ticker/" +
		"xrpusdt@ticker/dogeusdt@ticker/adausdt@ticker/avaxusdt@ticker/" +
		"dotusdt@ticker/linkusdt@ticker"

	for {
		log.Println("[BINANCE] Connecting to live crypto stream...")
		c, _, err := websocket.DefaultDialer.Dial(url, nil)
		if err != nil {
			log.Printf("[BINANCE ERROR] Failed to connect: %v. Retrying in 5s...", err)
			time.Sleep(5 * time.Second)
			continue
		}

		log.Println("[BINANCE] Connected successfully. Receiving live data.")

		for {
			var payload BinancePayload

			err := c.ReadJSON(&payload)
			if err != nil {
				log.Printf("[BINANCE ERROR] Connection dropped: %v", err)
				break
			}

			ticker := payload.Data
			if ticker.Symbol == "" {
				continue
			}

			sym, ok := binanceSymMap[ticker.Symbol]
			if !ok {
				continue
			}

			priceFloat := parseSafeFloat(ticker.Price)
			changeFloat := parseSafeFloat(ticker.ChangePrct)

			var formattedPrice string
			if priceFloat < 10 {
				formattedPrice = fmt.Sprintf("%.4f", priceFloat)
			} else {
				formattedPrice = fmt.Sprintf("%.2f", priceFloat)
			}

			isUp := changeFloat >= 0
			sign := ""
			if isUp {
				sign = "+"
			}
			formattedChange := fmt.Sprintf("%s%.2f%%", sign, changeFloat)

			e.mu.Lock()
			for i := range e.data[0].Items {
				if e.data[0].Items[i].Sym == sym {
					e.data[0].Items[i].Price = formattedPrice
					e.data[0].Items[i].Chg = formattedChange
					e.data[0].Items[i].Up = isUp
					break
				}
			}
			currentData := e.data
			e.mu.Unlock()

			e.hub.Broadcast(currentData)
		}
		c.Close()
	}
}
