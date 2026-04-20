import { createContext, useReducer, useEffect } from "react";
import {
  entrenamientoReducer,
  type seleccionAction,
} from "../hooks/entrenamientoReducer";
import rutinaCiclo2 from "../data/rutina";
import { supabase } from "../supabaseClient";
import type { Dia } from "../types/rutinaTypes";

type GymContextType = {
  state: Dia[];
  dispatch: React.Dispatch<seleccionAction>;
  syncRecord: (ejercicioId: string, valor: string) => Promise<void>;
};

const gymContext = createContext<GymContextType | undefined>(undefined);

export function GymProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(entrenamientoReducer, rutinaCiclo2);

  // 1. HIDRATACIÓN: Al cargar la app, traemos tus récords de Supabase
  useEffect(() => {
    const fetchRecords = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("gym_records")
        .select("ejercicio_id, record_text")
        .eq("user_id", user.id);

      // CORRECCIÓN: Ahora sí leemos la variable error y la imprimimos si falla
      if (error) {
        console.error("Error cargando récords de la nube:", error.message);
        return;
      }

      data?.forEach((row) => {
        dispatch({
          type: "ACTUALIZAR_RECORD_POR_ID",
          id: row.ejercicio_id,
          valor: row.record_text,
          skipSync: true,
        });
      });
    };

    fetchRecords();
  }, []);

  // 2. SINCRONIZACIÓN: Función para enviar el dato a la nube
  const syncRecord = async (ejercicioId: string, valor: string) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("gym_records").upsert(
      {
        user_id: user.id,
        ejercicio_id: ejercicioId,
        record_text: valor,
      },
      {
        onConflict: "user_id,ejercicio_id",
      },
    );

    // CORRECCIÓN: Leemos el error del guardado silencioso
    if (error) {
      console.error("Error guardando en la nube:", error.message);
    }
  };

  return (
    <gymContext.Provider value={{ state, dispatch, syncRecord }}>
      {children}
    </gymContext.Provider>
  );
}

export default gymContext;
