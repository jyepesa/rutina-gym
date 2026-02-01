export interface Ejercicio {
  ejercicio: string;
  series: string | number;
  intensidad: { tipo: string; serie: string; record: string };
  indicaciones: string;
  seleccionado: boolean;
}

export interface Dia {
  dia: string | number;
  blanco: string;
  ejercicios: Ejercicio[];
}
