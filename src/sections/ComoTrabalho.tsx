const STEPS = [
  {
    number: '01',
    title: 'Descoberta',
    text: 'Entendo o problema, quem usa a solução e o que realmente precisa melhorar na rotina.',
  },
  {
    number: '02',
    title: 'Escopo',
    text: 'Transformo a ideia em prioridades, fluxos e uma primeira entrega clara para todos.',
  },
  {
    number: '03',
    title: 'Desenvolvimento',
    text: 'Construo em ciclos curtos, validando as partes importantes antes de avançar.',
  },
  {
    number: '04',
    title: 'Entrega e evolução',
    text: 'Coloco o produto em uso, documento o necessário e preparo os próximos passos.',
  },
]

export default function ComoTrabalho() {
  return (
    <section id="processo" className="scroll-mt-24 border-y border-white/10 bg-white/[0.025]">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="max-w-3xl mb-10">
          <p className="text-primary text-sm font-semibold uppercase tracking-[0.2em] mb-3">Como trabalho</p>
          <h2 className="text-3xl md:text-4xl font-orbitron font-bold">Da necessidade à primeira versão em uso</h2>
          <p className="opacity-75 mt-4">Um processo direto para reduzir dúvidas, alinhar expectativas e entregar valor cedo.</p>
        </div>

        <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((step, index) => (
            <li key={step.number} className="relative p-5 rounded-xl border border-white/10 bg-background/70">
              <span className="font-orbitron text-primary text-sm">{step.number}</span>
              <h3 className="font-semibold text-lg mt-3">{step.title}</h3>
              <p className="text-sm opacity-70 leading-relaxed mt-2">{step.text}</p>
              {index < STEPS.length - 1 && (
                <span className="hidden lg:block absolute top-7 -right-4 text-primary/40" aria-hidden="true">→</span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
