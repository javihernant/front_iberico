import './style.css'
import { setupResultados } from './spirit.ts'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1>Resultados SOTG</h1>
    <div id="resultados"></div>
  </div>
`

setupResultados(document.querySelector<HTMLDivElement>('#resultados')!)
