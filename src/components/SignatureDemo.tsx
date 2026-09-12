import { useState } from 'react'
import { trackProject } from '../lib/analytics'

export const SIGNATURE_DEMO_PATH = '/demos/assinatura/'

export default function SignatureDemo({ location }: { location: string }) {
  const [active, setActive] = useState(false)

  return (
    <section id="demonstracao" aria-labelledby="signature-demo-title" className="scroll-mt-24 overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-900">
      <div className="p-6 md:p-8">
        <p className="text-sm font-bold uppercase tracking-widest text-blue-700">Demonstração interativa</p>
        <h2 id="signature-demo-title" className="mt-3 text-2xl font-bold tracking-tight md:text-3xl">Experimente o ZdSignatureInput</h2>
        <p className="mt-4 max-w-3xl leading-relaxed text-slate-600">
          Desenhe com o mouse ou com o dedo, envie uma imagem e veja o resultado em PNG.
          Você está usando o componente publicado, com as mesmas funções disponíveis para integração.
        </p>
        <p className="mt-3 text-sm text-slate-600">Use um rabisco de exemplo. O desenho e a imagem ficam apenas nesta página e são descartados ao fechá-la.</p>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <button
            type="button"
            aria-expanded={active}
            aria-controls="signature-demo-workspace"
            onClick={() => {
              if (!active) trackProject('zd-signature-input', 'demo', location)
              setActive((current) => !current)
            }}
            className="rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white transition hover:bg-blue-800"
          >
            {active ? 'Fechar demonstração' : 'Iniciar demonstração'}
          </button>
          <a
            href={SIGNATURE_DEMO_PATH}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackProject('zd-signature-input', 'demo', `${location}_standalone`)}
            className="text-sm font-semibold text-blue-700 underline underline-offset-4"
          >
            Abrir em outra aba
          </a>
        </div>
      </div>
      <div id="signature-demo-workspace" className="ph-no-capture ph-mask">
        {active && (
          <iframe
            title="Demonstração do componente ZdSignatureInput"
            src={`${SIGNATURE_DEMO_PATH}?embedded=1`}
            className="h-[980px] w-full border-0 border-t border-slate-200 sm:h-[720px] lg:h-[660px]"
            sandbox="allow-scripts allow-same-origin"
          />
        )}
      </div>
    </section>
  )
}
