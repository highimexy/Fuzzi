import confetti from 'canvas-confetti'

export function fireConfetti() {
  confetti({
    particleCount: 120,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899'],
  })
}
