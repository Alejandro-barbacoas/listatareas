import { createContext } from "react";

//Crear una cantidad de Temas para la app
export enum Themes {
    chrismas = "chrismas",
    hallowen = "hallowen",
    dark = "dark",
    valentine = "valentine",
    default = "default",
}

//Creamos la interfaz o tambien type
export interface ThemeData{
    theme:Themes;
}

//Creamos el contexto de tipo ThemeData
export const ThemeContext= createContext<ThemeData>(
    {
        theme:Themes.default //le ponemos valor por defecto
                             //  al contexto
    }
);