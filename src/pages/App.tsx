import Hero from '../sections/Hero'
import Sobre from '../sections/Sobre'
import Servicos from '../sections/Servicos'
import Projetos from '../sections/Projetos'
import Contato from '../sections/Contato'
import Rodape from '../sections/Rodape'

export default function App() {
  return (
    <div className="bg-background text-ice">
      <Hero />
      <Sobre />
      <Servicos />
      <Projetos />
      <Contato />
      <Rodape />
    </div>
  )
}
