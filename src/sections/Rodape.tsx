export default function Rodape() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-white/10">
      <div className="max-w-6xl mx-auto px-6 py-8 text-center text-sm opacity-80">
        <p>© {year} MATTecnologia — Desenvolvimento de software sob medida.</p>
        <a href="/privacidade/" className="mt-2 inline-block underline-offset-4 hover:underline focus:underline">
          Privacidade
        </a>
      </div>
    </footer>
  )
}
