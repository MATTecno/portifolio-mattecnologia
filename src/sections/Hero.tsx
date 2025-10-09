import { FaGithub, FaLinkedin, FaWhatsapp } from 'react-icons/fa'

export default function Hero() {
    return (
        <header className="relative isolate overflow-hidden">
            {/* NAVBAR FIXA */}
            <div className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-black/30 border-b border-white/10">
                <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                    <a href="/" className="font-orbitron text-xl tracking-wide">
                        <span className="text-ice">MAT</span><span className="text-primary">Tecnologia</span>
                    </a>

                    <div className="hidden md:flex items-center gap-6 text-sm">
                        <a href="#sobre" className="opacity-80 hover:opacity-100">Sobre</a>
                        <a href="#servicos" className="opacity-80 hover:opacity-100">Serviços</a>
                        <a href="#portfolio" className="opacity-80 hover:opacity-100">Projetos</a>
                        <a href="#contato" className="opacity-80 hover:opacity-100">Contato</a>
                    </div>
                </nav>
            </div>

            {/* FUNDO DECORATIVO (grid + glow) */}
            <div className="absolute inset-0 -z-10">
                {/* grade sutil */}
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 opacity-[0.06]"
                    style={{
                        backgroundImage:
                            'linear-gradient(to right, rgba(255,255,255,.25) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.25) 1px, transparent 1px)',
                        backgroundSize: '32px 32px',
                        maskImage:
                            'radial-gradient(ellipse at center, black 40%, transparent 70%)',
                        WebkitMaskImage:
                            'radial-gradient(ellipse at center, black 40%, transparent 70%)',
                    }}
                />
                {/* glow */}
                <div className="absolute -top-24 -right-24 w-[520px] h-[520px] bg-primary/30 blur-[120px] rounded-full" />
                <div className="absolute -bottom-24 -left-24 w-[520px] h-[520px] bg-secondary/30 blur-[120px] rounded-full" />
            </div>

            {/* CONTEÚDO HERO */}
            <div className="max-w-6xl mx-auto px-6 py-20 md:py-28 grid md:grid-cols-2 gap-10 items-center">
                {/* Foto (placeholder) */}
                <div className="order-2 md:order-1">
                    {
                        <img
                            src="/marcelo.jpeg"
                            alt="Marcelo Diogo"
                            className="w-full aspect-[4/5] object-cover rounded-2xl ring-1 ring-white/15 shadow-glow"
                            loading="lazy"
                            width={800}
                            height={1000}
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                    }
                </div>

                {/* Headline + CTAs */}
                <div className="order-1 md:order-2">
                    <h1 className="font-orbitron text-4xl md:text-5xl font-extrabold leading-tight">
                        Transformando ideias em <span className="text-primary">realidade digital</span>
                    </h1>

                    <p className="mt-4 text-lg opacity-80 max-w-prose">
                        Desenvolvimento web e mobile, criação e integração de APIs e sistemas sob medida.
                    </p>

                    <div className="mt-8 flex flex-wrap gap-4">
                        <a
                            href="#portfolio"
                            className="px-6 py-3 bg-primary rounded-mdplus shadow-glow font-medium hover:brightness-110 transition"
                        >
                            Ver Portfólio
                        </a>
                        <a
                            href="#contato"
                            className="px-6 py-3 border border-secondary text-secondary rounded-mdplus hover:bg-secondary/10 transition"
                        >
                            Falar com Marcelo
                        </a>
                    </div>

                    {/* BADGE DE DISPONIBILIDADE */}
                    <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 ring-1 ring-white/10">
                        <span className="text-lg">📅</span>
                        <span className="text-sm opacity-90">
                            aberto para projetos em <strong>out/2025</strong>
                        </span>
                    </div>

                    {/* FITA DE STACKS (sem scroll, quebra em linhas) */}
                    <div className="mt-6">
                        <div className="flex flex-wrap items-center gap-3 py-2">
                            {[
                                'PHP', 'Laravel', 'TypeScript', 'PostgreSQL', 'Docker', 'APIs', 'Automação', 'Vite', 'React', 'Tailwind'
                            ].map((tech) => (
                                <span
                                    key={tech}
                                    className="px-3 py-1 rounded-mdplus border border-white/10 bg-white/5 text-sm"
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Socials */}
                    <div className="mt-6 flex items-center gap-4 text-xl">
                        <a
                            href="https://github.com/mattecno"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="GitHub"
                            className="opacity-80 hover:opacity-100 transition"
                            title="GitHub"
                        >
                            <FaGithub />
                        </a>
                        <a
                            href="https://linkedin.com/in/seu-usuario"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="LinkedIn"
                            className="opacity-80 hover:opacity-100 transition"
                            title="LinkedIn"
                        >
                            <FaLinkedin />
                        </a>
                        <a
                            href="https://wa.me/5531995797235?text=Ol%C3%A1%2C%20vim%20pelo%20site%20MATTecnologia"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="WhatsApp"
                            className="opacity-80 hover:opacity-100 transition"
                            title="WhatsApp"
                        >
                            <FaWhatsapp />
                        </a>
                    </div>
                </div>
            </div>
        </header>
    )
}
