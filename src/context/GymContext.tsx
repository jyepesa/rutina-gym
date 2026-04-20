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
  syncRecord: (diaIdx: number, ejIdx: number, valor: string) => Promise<void>;
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
        .select("dia_index, ejercicio_index, record_text")
        .eq("user_id", user.id);

      if (error) {
        console.error("Error cargando récords:", error.message);
        return;
      }

      // Inyectamos cada récord en nuestro estado inicial
      data?.forEach((row) => {
        dispatch({
          type: "ACTUALIZAR_RECORD",
          diaIndex: row.dia_index,
          ejercicioIndex: row.ejercicio_index,
          valor: row.record_text,
          skipSync: true, // Evitamos un bucle infinito de guardado
        });
      });
    };

    fetchRecords();
  }, []);

  // 2. SINCRONIZACIÓN: Función para enviar el dato a la nube
  const syncRecord = async (diaIdx: number, ejIdx: number, valor: string) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    // "UPSERT" significa: Si existe, actualiza. Si no existe, inserta.
    const { error } = await supabase.from("gym_records").upsert(
      {
        user_id: user.id,
        dia_index: diaIdx,
        ejercicio_index: ejIdx,
        record_text: valor,
      },
      {
        onConflict: "user_id,dia_index,ejercicio_index", // Nuestra regla de unicidad
      },
    );

    if (error) console.error("Error sincronizando:", error.message);
  };

  return (
    <gymContext.Provider value={{ state, dispatch, syncRecord }}>
      {children}
    </gymContext.Provider>
  );
}

export default gymContext;
