import { useState} from "react"
import "./App.css"

function App() {
  const [pantalla, setPantalla]= useState("inicio")
  const comenzarJuego = () => {
    setPantalla("juego")
  }
  return(
    <>
    {pantalla === "inicio" && (
      <div className="pantalla-inicio">
        <h1> Bienenido a Trivia</h1>
        <button onClick={comenzarJuego}>Comenzar juego</button>
      </div>
  )}
  {pantalla === "juego" && (
    <div>
      <h2>Comienza la Trivia... (aca irian las preguntas)</h2>
    </div>
  )}
  </>
  )
  }
  export default App 