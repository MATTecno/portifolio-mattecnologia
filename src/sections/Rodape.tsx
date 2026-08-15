export default function Rodape() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-white/10">
      <div className="max-w-6xl mx-auto px-6 py-8 text-sm opacity-80 flex flex-col items-center justify-between gap-3 text-center md:flex-row md:text-left">
        <span>© {year} MATTecnologia — Produtos digitais e sistemas sob medida.</span>
        <a href="/recrutadores/" className="hover:text-primary transition">Página para recrutadores</a>
      </div>
    </footer>
  )
}
