import { useGym } from "../hooks/useGym";

export const SelectorDia = ({
  alSeleccionar,
  indice,
}: {
  alSeleccionar: (idx: number | null) => void;
  indice: number | null;
}) => {
  const { state, dispatch } = useGym();

  return (
    <div className="mb-8">
      {/* 1. EL GRID: Solo para los números de los días */}
      <div className="grid grid-cols-4 gap-2">
        {state.map((item, index) => {
          const indiceSeleccionado = indice === index;
          return (
            <button
              key={index}
              onClick={() => alSeleccionar(index)}
              className={`font-bold py-3 rounded-xl border transition-all active:scale-90 ${
                indiceSeleccionado
                  ? "bg-cyan-600 border-cyan-400 text-white shadow-[0_0_15px_rgba(34,211,238,0.4)]"
                  : "bg-slate-800 border-slate-700 text-slate-400"
              }`}
            >
              {item.dia}
            </button>
          );
        })}
      </div>

      {/* 2. FUERA DEL GRID: El botón de acción general */}
      <button
        onClick={() => {
          dispatch({ type: "RESET_TODO" });
          alSeleccionar(null);
        }}
        className="w-full mt-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 hover:text-red-500/80 transition-colors flex items-center justify-center gap-2"
      >
        <span className="text-sm">✕</span> Quitar selección y Reset General
      </button>
    </div>
  );
};
