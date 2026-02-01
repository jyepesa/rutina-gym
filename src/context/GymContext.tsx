import { createContext, useReducer } from "react";
import {
  entrenamientoReducer,
  type seleccionAction,
} from "../hooks/entrenamientoReducer";
import rutinaCiclo2 from "../data/rutina";
import type { Dia } from "../types/rutinaTypes";
import { useEffect } from "react";

type GymContextType = {
  state: Dia[];
  dispatch: React.Dispatch<seleccionAction>;
};

const LOCAL_STORAGE_KEY = "gym_pro_data_v1";

const gymContext = createContext<GymContextType | undefined>(undefined);

export function GymProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(
    entrenamientoReducer,
    rutinaCiclo2,
    (initial) => {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      return saved ? JSON.parse(saved) : initial;
    },
  );

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  return (
    <gymContext.Provider value={{ state, dispatch }}>
      {children}
    </gymContext.Provider>
  );
}
export default gymContext;
