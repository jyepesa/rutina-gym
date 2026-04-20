import { type Ejercicio, type Dia } from "../types/rutinaTypes";

export type seleccionAction =
  | { type: "TOGGLE_SELECCIONAR"; diaIndex: number; ejercicioIndex: number }
  | { type: "RESET_DIA"; diaIndex: number }
  | { type: "RESET_TODO" }
  | { type: "AGREGAR_EJERCICIO"; diaIndex: number; ejercicio: Ejercicio }
  | {
      type: "ACTUALIZAR_RECORD_POR_ID";
      id: string;
      valor: string;
      skipSync?: boolean;
    }
  | {
      type: "ACTUALIZAR_RECORD";
      diaIndex: number;
      ejercicioIndex: number;
      valor: string;
      skipSync?: boolean;
    };

export function entrenamientoReducer(
  state: Dia[],
  action: seleccionAction,
): Dia[] {
  switch (action.type) {
    case "TOGGLE_SELECCIONAR":
      const { diaIndex, ejercicioIndex } = action;
      const newState = [...state];
      const dia = { ...newState[diaIndex] };
      const ejercicios = [...dia.ejercicios];
      ejercicios[ejercicioIndex] = {
        ...ejercicios[ejercicioIndex],
        seleccionado: !ejercicios[ejercicioIndex].seleccionado,
      };
      dia.ejercicios = ejercicios;
      newState[diaIndex] = dia;
      return newState;

    case "RESET_DIA":
      const resetDiaIndex = action.diaIndex;
      const resetState = [...state];
      resetState[resetDiaIndex] = {
        ...resetState[resetDiaIndex],
        ejercicios: resetState[resetDiaIndex].ejercicios.map((ej) => ({
          ...ej,
          seleccionado: false,
        })),
      };
      return resetState;

    case "RESET_TODO":
      return state.map((dia) => ({
        ...dia,
        ejercicios: dia.ejercicios.map((ej) => ({
          ...ej,
          seleccionado: false,
        })),
      }));

    case "AGREGAR_EJERCICIO":
      const { diaIndex: nuevoDiaIndex, ejercicio } = action;
      const nuevoEstado = [...state];
      nuevoEstado[nuevoDiaIndex] = {
        ...nuevoEstado[nuevoDiaIndex],
        ejercicios: [...nuevoEstado[nuevoDiaIndex].ejercicios, ejercicio],
      };
      return nuevoEstado;

    case "ACTUALIZAR_RECORD": {
      const { diaIndex, ejercicioIndex, valor } = action;

      // Clonamos el estado
      const nuevoState = [...state];
      const dia = { ...nuevoState[diaIndex] };
      const ejercicios = [...dia.ejercicios];

      // Actualizamos el campo específico
      ejercicios[ejercicioIndex] = {
        ...ejercicios[ejercicioIndex],
        intensidad: {
          ...ejercicios[ejercicioIndex].intensidad,
          record: valor,
        },
      };

      dia.ejercicios = ejercicios;
      nuevoState[diaIndex] = dia;
      return nuevoState;
    }
    case "ACTUALIZAR_RECORD_POR_ID": {
      const stateConIds = [...state];
      // Buscamos en todos los días...
      for (let d = 0; d < stateConIds.length; d++) {
        // ...hasta encontrar el ejercicio con el ID exacto
        const ejIndex = stateConIds[d].ejercicios.findIndex(
          (e: any) => e.id === action.id,
        );
        if (ejIndex !== -1) {
          // ¡Lo encontramos! Actualizamos su récord
          const ejerciciosClon = [...stateConIds[d].ejercicios];
          ejerciciosClon[ejIndex] = {
            ...ejerciciosClon[ejIndex],
            intensidad: {
              ...ejerciciosClon[ejIndex].intensidad,
              record: action.valor,
            },
          };
          stateConIds[d] = { ...stateConIds[d], ejercicios: ejerciciosClon };
          break; // Detenemos la búsqueda por pura eficiencia lógica
        }
      }
      return stateConIds;
    }

    default:
      return state;
  }
}
