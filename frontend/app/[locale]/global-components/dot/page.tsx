export default function Dot({ size = 'clamp(5px, 0.55vw, 8px)' }) {
  return (
    <div className="shrink-0">
      <style>{`
        @keyframes nav-dot-blink {
          0%, 100% { opacity: 1;    box-shadow: 0 0 6px 2px #f5e642; }
          45%, 55% { opacity: 0.08; box-shadow: none; }
        }
      `}</style>
      <span
        style={{
          display: 'inline-block',
          width: size,
          height: size,
          borderRadius: '50%',
          backgroundColor: '#f5e642',
          flexShrink: 0,
          animation: 'nav-dot-blink 2.4s ease-in-out infinite',
        }}
        aria-hidden="true"
      />
    </div>
  )
}
