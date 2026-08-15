export default function Rodape() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-white/10">
      <div className="max-w-6xl mx-auto px-6 py-8 text-center text-sm opacity-80">
        <span>© {year} MATTecnologia — Desenvolvimento de software sob medida.</span>
      </div>
    </footer>
  )
}
