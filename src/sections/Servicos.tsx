const ITEMS = [
  { title: 'Desenvolvimento Web', text: 'Sites e sistemas personalizados com performance e segurança.' },
  { title: 'Aplicativos Mobile', text: 'Apps modernos e rápidos com Flutter, Android e iOS.' },
  { title: 'Integração com APIs', text: 'Conexão entre plataformas e automações inteligentes.' },
  { title: 'Sistemas Sob Medida', text: 'Soluções completas para empresas, do backend ao deploy.' },
]

export default function Servicos() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-20">
      <h2 className="text-3xl font-orbitron font-bold mb-8">Serviços</h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {ITEMS.map((item) => (
          <div
            key={item.title}
            className="p-5 bg-white/5 rounded-xl border border-white/10 hover:shadow-glow transition-shadow"
          >
            <h3 className="font-semibold mb-2">{item.title}</h3>
            <p className="text-sm opacity-80">{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
