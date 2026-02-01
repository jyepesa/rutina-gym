import { useContext } from "react";
import gymContext from "../context/GymContext";

export const useGym = () => {
  const context = useContext(gymContext);
  if (!context) {
    throw new Error("No puedes usar useGym fuera del GymProvider");
  }
  return context;
};
