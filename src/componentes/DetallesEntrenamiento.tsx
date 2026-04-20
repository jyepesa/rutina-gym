import { useGym } from "../hooks/useGym";
import { useEffect, useState } from "react";

export const DetallesEntrenamiento = ({
  diaIndex,
}: {
  diaIndex: number | null;
}) => {
  // Extraemos TODO del contexto, incluyendo nuestra nueva función syncRecord
  const { state, dispatch, syncRecord } = useGym();
  const [mostrandoCheck, setMostrandoCheck] = useState(false);

  useEffect(() => {
    if (diaIndex !== null) {
      setMostrandoCheck(true);
      const timer = setTimeout(() => setMostrandoCheck(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [state]);

  if (diaIndex === null) {
    return (
      <div className="text-center p-10 text-slate-500 italic">
        Selecciona un día para empezar a entrenar 🏋️‍♂️
      </div>
    );
  }

  const diaSeleccionado = state[diaIndex];

  // La nueva función unificada que actualiza la UI y la nube
  const alCambiarRecord = (valor: string, ejIdx: number) => {
    dispatch({
      type: "ACTUALIZAR_RECORD",
      diaIndex: diaIndex,
      ejercicioIndex: ejIdx,
      valor: valor,
    });
    // Guardado en la nube
    syncRecord(diaIndex, ejIdx, valor);
  };

  return (
    <div className="mt-6">
      <div className="mb-6">
        <h2 className="text-sm uppercase tracking-widest text-cyan-500 font-bold">
          Día {diaSeleccionado.dia}
        </h2>
        <h3 className="text-2xl font-black text-white">
          {diaSeleccionado.blanco}
        </h3>
      </div>

      <button
        onClick={() => dispatch({ type: "RESET_DIA", diaIndex: diaIndex })}
        className="mb-6 w-full py-3 px-4 rounded-xl border border-slate-700 bg-slate-900/50 text-slate-400 text-sm font-bold uppercase tracking-widest hover:bg-slate-800 active:scale-95 transition-all flex items-center justify-center gap-2"
      >
        <span className="text-lg">🔄</span> Reiniciar progreso del día
      </button>

      <div className="h-6 mb-2 flex justify-end">
        {mostrandoCheck && (
          <div className="flex items-center gap-2 text-cyan-500 animate-in fade-in zoom-in duration-300">
            <span className="text-[10px] font-black uppercase tracking-widest">
              Cambios guardados
            </span>
          </div>
        )}
      </div>

      <ul className="space-y-4">
        {diaSeleccionado.ejercicios.map((ejercicio, index) => (
          <li
            key={"ex" + index}
            // ESTA ES LA FUNCIÓN QUE ABRE EL ACORDEÓN (No la borres)
            onClick={() =>
              dispatch({
                type: "TOGGLE_SELECCIONAR",
                diaIndex,
                ejercicioIndex: index,
              })
            }
            className={`p-5 rounded-2xl border-2 transition-all duration-300 cursor-pointer ${
              ejercicio.seleccionado
                ? "bg-slate-800 border-cyan-500 shadow-lg shadow-cyan-900/20"
                : "bg-slate-900 border-slate-800 hover:border-slate-700"
            }`}
          >
            <div className="flex justify-between items-center">
              <h4
                className={`font-bold text-lg ${ejercicio.seleccionado ? "text-cyan-400" : "text-slate-200"}`}
              >
                {ejercicio.ejercicio}
              </h4>
              <span className="text-slate-500">
                {ejercicio.seleccionado ? "▲" : "▼"}
              </span>
            </div>

            {ejercicio.seleccionado && (
              <div className="mt-4 pt-4 border-t border-slate-700 animate-in fade-in slide-in-from-top-2">
                <div className="bg-slate-950/50 p-4 rounded-xl mb-3 border border-slate-800">
                  <p className="text-xs text-cyan-500 uppercase font-bold mb-2 tracking-wider">
                    Objetivo: {ejercicio.intensidad.tipo}
                  </p>
                  <p className="text-white font-medium mb-4 italic">
                    🎯 {ejercicio.intensidad.serie}
                  </p>

                  <div className="mt-2">
                    <label className="text-[10px] text-slate-500 uppercase font-black mb-1 block">
                      Tu Récord / Notas de Mejora
                    </label>
                    <input
                      type="text"
                      value={ejercicio.intensidad.record || ""}
                      onClick={(e) => e.stopPropagation()} // Evita que al hacer click en el input se cierre el acordeón
                      onChange={(e) => alCambiarRecord(e.target.value, index)}
                      placeholder="Ej: 15kg - Técnica sólida"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-cyan-400 font-bold focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <p className="text-xs text-cyan-500 uppercase font-bold mb-1">
                    Indicaciones
                  </p>
                  <p className="text-slate-400 text-sm leading-relaxed whitespace-pre-line">
                    {ejercicio.indicaciones}
                  </p>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
