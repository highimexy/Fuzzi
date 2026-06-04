const BLOCK = 99999

export function formatUserId(id: number): string {
  if (id <= BLOCK) {
    return `#${String(id).padStart(5, '0')}`
  }
  const n = id - BLOCK
  const letterIndex = Math.floor((n - 1) / BLOCK)
  const num = ((n - 1) % BLOCK) + 1
  const letter = String.fromCharCode(65 + letterIndex)
  return `#${letter}${String(num).padStart(5, '0')}`
}
