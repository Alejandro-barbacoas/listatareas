import { ReactNode } from "react";
import { ThemeContext, ThemeData, Themes } from "./ThemeContext";

//Crear una interfaz que reciba un hijo
interface ThemeProviderProps{
    children:ReactNode
}

//Crear el ThemeProvider que recibe un hijo
export const ThemeProvider = ({children}:ThemeProviderProps) => {
    //Crear el objeto theme
    const theme:ThemeData = {
        theme:Themes.default
    }
    //Crear el contexto que encerrara al componente
    return (
        <ThemeContext.Provider value={theme}>
            {children}
        </ThemeContext.Provider>
    );
}