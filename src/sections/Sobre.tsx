export default function Sobre() {
    const stacks = [
        'PHP', 'Laravel', 'TypeScript', 'C# / .NET', 'React',
        'Supabase', 'PostgreSQL', 'Docker', 'APIs', 'Automação'
    ]

    return (
        <section id="sobre" className="scroll-mt-24 max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-10 items-start">
            {/* Avatar (trocar por <img> quando tiver a foto menor) */}
            <div className="w-40 h-40 md:w-48 md:h-48 rounded-full ring-1 ring-white/10 bg-white/5 grid place-items-center">
                <img
                    src="/marcelo.jpeg"
                    alt="Marcelo Diogo"
                    className="w-40 h-40 md:w-48 md:h-48 object-cover rounded-full ring-1 ring-white/15"
                />
            </div>

            <div>
                <h2 className="text-3xl font-orbitron font-bold mb-4">Sobre mim</h2>
                <p className="opacity-80 leading-relaxed">
                    Sou <strong>Marcelo Diogo</strong>, desenvolvedor fullstack focado em transformar necessidades de
                    negócio em <span className="text-primary">produtos digitais que funcionam na prática</span>. Atuo do
                    entendimento da rotina ao desenvolvimento e à entrega, construindo SaaS, sistemas web, aplicações
                    desktop e integrações sob medida.
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
                        Falar comigo
                    </a>
                </div>
            </div>
        </section>
    )
}
