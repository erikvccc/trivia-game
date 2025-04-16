import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [pantalla, setPantalla] = useState("inicio");
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  const [dificultadSeleccionada, setDificultadSeleccionada] = useState("");
  const [preguntas, setPreguntas] = useState([]);
  const [preguntaActual, setPreguntaActual] = useState(0);
  const [cargando, setCargando] = useState(false);
  const [puntaje, setPuntaje] = useState(0);
  const [respuestaSeleccionada, setRespuestaSeleccionada] = useState(null);
  const [opcionesMezcladas, setOpcionesMezcladas] = useState([]);
  const [pantallaFinal, setPantallaFinal] = useState(false);
  const [recargar, setRecargar] = useState(0);
  useEffect(() => {
    fetch("https://opentdb.com/api_category.php")
      .then((res) => res.json())
      .then((data) => setCategorias(data.trivia_categories));
  }, []);

  const comenzarJuego = () => {
    setPantalla("juego");
    setPreguntaActual(0);
    setPuntaje(0);
    setPantallaFinal(false);
    setRespuestaSeleccionada(null);
  };

  const cargarPreguntas = () => {
    setCargando(true);
    fetch(
      `https://opentdb.com/api.php?amount=5&category=${categoriaSeleccionada}&difficulty=${dificultadSeleccionada}&type=multiple`
    )
      .then((res) => res.json())
      .then((data) => {
        setPreguntas(data.results);
        setPreguntaActual(0);
        setRespuestaSeleccionada(null);
        if (data.results.length > 0) {
          setOpcionesMezcladas(mezclarOpciones(data.results[0]));
        }
        setCargando(false);
      });
  };

  useEffect(() => {
    if (pantalla === "juego") {
      cargarPreguntas();
    }
  }, [pantalla, recargar]);

  useEffect(() => {
    if (preguntas.length > 0) {
      setOpcionesMezcladas(mezclarOpciones(preguntas[preguntaActual]));
    }
  }, [preguntaActual]);

  const mezclarOpciones = (pregunta) => {
    const opciones = [...pregunta.incorrect_answers];
    opciones.splice(
      Math.floor(Math.random() * (opciones.length + 1)),
      0,
      pregunta.correct_answer
    );
    return opciones;
  };

  const manejarRespuesta = (respuesta) => {
    if (respuestaSeleccionada !== null) return;

    const pregunta = preguntas[preguntaActual];
    setRespuestaSeleccionada(respuesta);

    if (respuesta === pregunta.correct_answer) {
      setPuntaje((prev) => prev + 10);
    }

    setTimeout(() => {
      if (preguntaActual + 1 === preguntas.length) {
        setPantallaFinal(true);
      } else {
        setPreguntaActual((prev) => prev + 1);
        setRespuestaSeleccionada(null);
      }
    }, 1000);
  };

  const reiniciarTrivia = () => {
    setPuntaje(0);
    setPreguntaActual(0);
    setPreguntas([]);
    setRespuestaSeleccionada(null);
    setPantallaFinal(false);
    setRecargar((prev) => prev + 1);
    setPantalla("juego");
  };

  const salirAPantallaPrincipal = () => {
    setPantalla("inicio");
    setPreguntas([]);
    setCategoriaSeleccionada("");
    setDificultadSeleccionada("");
    setPantallaFinal(false);
  };

  return (
    <>
      {pantalla === "inicio" && (
        <div className="pantalla-inicio">
          <h1>Bienvenido a Trivia</h1>

          <h3>Selecciona una temática:</h3>
          <div className="grilla-opciones">
            {categorias.map((cat) => (
              <button
                key={cat.id}
                className={`opcion-grilla ${
                  categoriaSeleccionada === String(cat.id) ? "seleccionada" : ""
                }`}
                onClick={() => setCategoriaSeleccionada(String(cat.id))}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <h3>Selecciona una dificultad:</h3>
          <div className="grilla-opciones">
            {["easy", "medium", "hard"].map((nivel) => (
              <button
                key={nivel}
                className={`opcion-grilla ${
                  dificultadSeleccionada === nivel ? "seleccionada" : ""
                }`}
                onClick={() => setDificultadSeleccionada(nivel)}
              >
                {nivel === "easy"
                  ? "Fácil"
                  : nivel === "medium"
                  ? "Media"
                  : "Difícil"}
              </button>
            ))}
          </div>

          <button
            onClick={comenzarJuego}
            disabled={!categoriaSeleccionada || !dificultadSeleccionada}
          >
            ¡Jugar!
          </button>
        </div>
      )}

      {pantalla === "juego" && !pantallaFinal && (
        <div className="pantalla-juego">
          <h2>Trivia</h2>
          {cargando && <p>Cargando preguntas...</p>}

          {!cargando && preguntas.length > 0 && (
            <div>
              <p>Puntaje actual: {puntaje} puntos</p>
              <p>
                Pregunta {preguntaActual + 1} de {preguntas.length}
              </p>
              <h4
                dangerouslySetInnerHTML={{
                  __html: preguntas[preguntaActual].question,
                }}
              />
              {opcionesMezcladas.map((opcion, i) => {
                let className = "opcion";
                if (respuestaSeleccionada !== null) {
                  const correcta = preguntas[preguntaActual].correct_answer;
                  if (opcion === correcta) {
                    className += " correcta";
                  } else if (opcion === respuestaSeleccionada) {
                    className += " incorrecta";
                  }
                }

                return (
                  <button
                    key={i}
                    className={className}
                    onClick={() => manejarRespuesta(opcion)}
                    disabled={respuestaSeleccionada !== null}
                    dangerouslySetInnerHTML={{ __html: opcion }}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}

      {pantallaFinal && (
        <div className="pantalla-final">
          <h2>¡Trivia finalizada!</h2>
          <p>Tu puntaje final: {puntaje} puntos</p>
          <button onClick={reiniciarTrivia}>Reiniciar</button>
          <button onClick={salirAPantallaPrincipal}>Salir</button>
        </div>
      )}
    </>
  );
}

export default App;
