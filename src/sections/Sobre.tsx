export default function Sobre() {
    const stacks = [
        'PHP', 'Laravel', 'TypeScript', 'C# / .NET', 'React',
        'Supabase', 'PostgreSQL', 'Docker', 'APIs', 'Automação'
    ]

    return (
        <section id="sobre" className="scroll-mt-24 max-w-6xl mx-auto grid items-start gap-10 px-6 py-20 lg:grid-cols-[minmax(0,1fr)_auto]">
            <div>
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary">Estrutura e atendimento</p>
                <h2 className="text-3xl font-orbitron font-bold mb-4">Tecnologia próxima do negócio</h2>
                <p className="opacity-80 leading-relaxed">
                    A <strong>MATTecnologia</strong> é uma operação de desenvolvimento de software com atendimento direto,
                    escopo transparente e execução técnica próxima. Cada projeto parte da rotina da empresa para chegar a
                    um <span className="text-primary">produto digital sustentável e pronto para evoluir</span>.
                </p>

                {/* Chips de stack */}
                <div className="mt-6 flex flex-wrap gap-3 text-sm">
                    {stacks.map((tag) => (
                        <span key={tag} className="px-3 py-1 rounded-mdplus border border-white/10 bg-white/5">
                            {tag}
                        </span>
                    ))}
                </div>

                <div className="mt-8 flex flex-wrap gap-4">
                    <a
                        href="#contato"
                        className="px-5 py-3 bg-primary rounded-mdplus shadow-glow font-medium hover:brightness-110 transition"
                    >
                        Falar sobre um projeto
                    </a>
                </div>
            </div>

            <aside className="flex w-full max-w-sm items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.035] p-4 lg:w-[330px]">
                <img
                    src="/marcelo-profissional-160.webp"
                    srcSet="/marcelo-profissional-160.webp 160w, /marcelo-profissional-320.webp 320w"
                    sizes="112px"
                    alt="Marcelo Diogo, responsável técnico pela MATTecnologia"
                    className="size-24 shrink-0 rounded-xl object-cover ring-1 ring-white/15 md:size-28"
                    loading="lazy"
                    decoding="async"
                    width={320}
                    height={320}
                />
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Responsável técnico</p>
                    <h3 className="mt-2 font-semibold">Marcelo Diogo</h3>
                    <p className="mt-1 text-sm leading-relaxed opacity-65">Desenvolvimento Full Stack e arquitetura de soluções.</p>
                </div>
            </aside>
        </section>
    )
}
