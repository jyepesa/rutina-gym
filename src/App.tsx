import { GymProvider } from "./context/GymContext";
import { useState } from "react";
import { SelectorDia } from "./componentes/SelectorDia";
import { DetallesEntrenamiento } from "./componentes/DetallesEntrenamiento";
import { useGym } from "./hooks/useGym";

const AppWrapping = () => {
  return (
    <GymProvider>
      <App />
    </GymProvider>
  );
};

const App = () => {
  const [indiceActivo, setIndiceActivo] = useState<number | null>(null);

  const { state } = useGym();

  function manejarSeleccionDia(idx: number | null) {
    setIndiceActivo(idx);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4">
      <header className="py-6 text-center">
        <h1 className="text-4xl font-black tracking-tighter text-cyan-400 italic uppercase">
          Gimnasio Pro
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Rutina de {state.length} sesiones a lo largo de 2 semanas
        </p>
      </header>

      <main className="max-w-md mx-auto">
        <SelectorDia
          alSeleccionar={manejarSeleccionDia}
          indice={indiceActivo}
        />
        <DetallesEntrenamiento diaIndex={indiceActivo} />
      </main>
    </div>
  );
};

export default AppWrapping;
