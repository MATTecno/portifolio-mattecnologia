const ITEMS = [
  {
    number: '01',
    title: 'SaaS e sistemas web',
    text: 'Produtos com painel, autenticação, planos e integrações, preparados para crescer com o negócio.',
  },
  {
    number: '02',
    title: 'Soluções desktop',
    text: 'Aplicações confiáveis para operações locais, inclusive cenários offline e entregas para Windows.',
  },
  {
    number: '03',
    title: 'APIs e automações',
    text: 'Integração entre serviços, processamento de dados e rotinas que eliminam trabalho repetitivo.',
  },
  {
    number: '04',
    title: 'MVP e evolução',
    text: 'Da validação inicial às próximas versões, com escopo claro e uma base sustentável para evoluir.',
  },
]

export default function Servicos() {
  return (
    <section id="servicos" className="scroll-mt-24 max-w-6xl mx-auto px-6 py-20">
      <div className="max-w-3xl mb-9">
        <p className="text-primary text-sm font-semibold uppercase tracking-[0.2em] mb-3">Serviços</p>
        <h2 className="text-3xl md:text-4xl font-orbitron font-bold">Tecnologia aplicada ao que precisa funcionar</h2>
        <p className="opacity-75 mt-4">A arquitetura é definida a partir do produto e da operação, não o contrário.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {ITEMS.map((item) => (
          <article
            key={item.title}
            className="p-5 bg-white/[0.035] rounded-xl border border-white/10 hover:border-primary/35 hover:shadow-glow transition"
          >
            <span className="font-orbitron text-primary/70 text-sm">{item.number}</span>
            <h3 className="font-semibold mb-2">{item.title}</h3>
            <p className="text-sm opacity-70 leading-relaxed">{item.text}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
