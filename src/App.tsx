import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import { GymProvider } from "./context/GymContext";
import { SelectorDia } from "./componentes/SelectorDia";
import { DetallesEntrenamiento } from "./componentes/DetallesEntrenamiento";
import { useGym } from "./hooks/useGym";

// 1. EL COMPONENTE DEL GIMNASIO (El interior del edificio)
const GymApp = () => {
  // 1. El día que estás viendo AHORA MISMO
  const [indiceActivo, setIndiceActivo] = useState<number | null>(null);

  // 2. El último día que entrenaste (Recuperado de la memoria del teléfono/PC)
  const [ultimoIndice, setUltimoIndice] = useState<number | null>(() => {
    const guardado = localStorage.getItem("gym_pro_ultimo_dia");
    return guardado !== null ? Number(guardado) : null;
  });

  const { state } = useGym();

  // 3. El Radar de Cambios: Si cambias de día activo, lo guardamos como tu último día
  useEffect(() => {
    if (ultimoIndice !== null) {
      localStorage.setItem("gym_pro_ultimo_dia", ultimoIndice.toString());
    }
  }, [ultimoIndice]);

  // 4. El Intermediario: Maneja el clic de los botones
  const manejarSeleccionDia = (idx: number | null) => {
    setIndiceActivo(idx);
    if (idx !== null) {
      setUltimoIndice(idx); // Solo actualiza el récord si abriste un día válido
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4">
      <header className="py-6 text-center">
        <h1 className="text-4xl font-black tracking-tighter text-cyan-400 italic uppercase">
          Gimnasio Pro
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Rutina de {state.length} sesiones sincronizada ☁️
        </p>

        {/* Renderizado Condicional de tu vieja función */}
        {!indiceActivo && indiceActivo !== 0 && ultimoIndice !== null && (
          <div className="mt-4 inline-block bg-slate-900 border border-slate-700 px-4 py-2 rounded-lg">
            <p className="text-cyan-500 text-xs font-bold uppercase tracking-widest">
              Último entrenamiento: Día{" "}
              {state[ultimoIndice]?.dia || ultimoIndice + 1}
            </p>
          </div>
        )}
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

// 2. EL COMPONENTE PRINCIPAL (La puerta de seguridad)
export default function App() {
  const [session, setSession] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => setSession(session));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_e, session) => setSession(session));
    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await supabase.auth.signInWithPassword({ email, password });
  };

  // Si no hay llave, mostramos el login básico
  if (!session) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 text-white">
        <form
          onSubmit={handleLogin}
          className="bg-slate-900 p-8 rounded-xl border border-slate-800 w-full max-w-md space-y-4"
        >
          <h2 className="text-2xl font-bold text-cyan-400 text-center">
            Identificación
          </h2>
          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 bg-slate-800 rounded outline-none"
          />
          <input
            type="password"
            placeholder="Contraseña"
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 bg-slate-800 rounded outline-none"
          />
          <button
            type="submit"
            className="w-full bg-cyan-600 font-bold p-3 rounded"
          >
            Entrar
          </button>
        </form>
      </div>
    );
  }

  // Si hay llave, envolvemos el gimnasio en su Provider
  return (
    <>
      <div className="bg-slate-950 text-right p-2">
        <button
          onClick={() => supabase.auth.signOut()}
          className="text-red-500 text-xs font-bold uppercase"
        >
          Cerrar Sesión
        </button>
      </div>
      <GymProvider>
        <GymApp />
      </GymProvider>
    </>
  );
}
