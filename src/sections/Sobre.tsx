export default function Sobre() {
  return (
    <aside id="sobre" className="about-marcelo">
      <img
        src="/marcelo-profissional-160.webp"
        srcSet="/marcelo-profissional-160.webp 160w, /marcelo-profissional-320.webp 320w"
        sizes="96px"
        width={160}
        height={160}
        alt="Marcelo Diogo, responsável pela MATTecnologia"
        loading="lazy"
      />
      <div>
        <p className="site-eyebrow">Com quem você vai conversar</p>
        <h3>Marcelo Diogo</h3>
        <p>
          Sou responsável pela MATTecnologia. O atendimento é direto comigo: da conversa sobre a necessidade
          até o desenvolvimento e os ajustes do sistema.
        </p>
        <a className="site-text-link" href="/recrutadores/">
          Conheça minha experiência ↗
        </a>
      </div>
    </aside>
  )
}
