export default function Sobre() {
    const stacks = [
        'PHP', 'Laravel', 'Node.js', 'TypeScript', 'Flutter',
        'PostgreSQL', 'Docker', 'APIs', 'Integrações', 'Automação'
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
                    Sou <strong>Marcelo Diogo</strong>, desenvolvedor fullstack que transforma ideias em
                    <span className="text-primary"> soluções digitais</span>. Atuo com web e mobile,
                    crio e integro APIs e construo <em>sistemas sob medida</em> com foco em
                    performance, segurança e escalabilidade.
                </p>

                {/* Chips de stack */}
                <div className="mt-6 flex flex-wrap gap-3 text-sm">
                    {stacks.map((tag) => (
                        <span key={tag} className="px-3 py-1 rounded-mdplus border border-white/10 bg-white/5">
                            {tag}
                        </span>
                    ))}
                </div>

                {/* CTA extra: baixar CV */}
                <div className="mt-8 flex flex-wrap gap-4">
                    <a
                        href="/cv-marcelo-diogo.pdf"
                        download
                        className="px-5 py-3 border border-white/15 rounded-mdplus hover:bg-white/5 transition"
                    >
                        Baixar CV (PDF)
                    </a>
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
