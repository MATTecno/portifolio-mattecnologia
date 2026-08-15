import Hero from '../sections/Hero'
import Sobre from '../sections/Sobre'
import Servicos from '../sections/Servicos'
import Projetos from '../sections/Projetos'
import Contato from '../sections/Contato'
import Rodape from '../sections/Rodape'
import Estimativa from '../sections/Estimativa'
import ComoTrabalho from '../sections/ComoTrabalho'

export default function App() {
  return (
    <div className="bg-background text-ice">
      <Hero />
      <Sobre />
      <Servicos />
      <Projetos />
      <ComoTrabalho />
      <Estimativa />
      <Contato />
      <Rodape />
    </div>
  )
}
