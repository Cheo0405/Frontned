import { createContext, useContext, useState } from "react";
import { 
    createCursoRequest, 
    getCursosRequest, 
    deleteCursoRequest, 
    getCursoRequest, 
    updateCursoRequest 
} from "../api/cursos";

const CursoContext = createContext();

export const useCursos = () => {
    const context = useContext(CursoContext);

    if (!context) throw new Error("useCursos must be used within a CursoProvider");

    return context;
};

export function CursoProvider({ children }) {
    
    const [cursos, setCursos] = useState([]);
    const [errors, setErrors] = useState([]);

    const getCursos = async () => {
        try {
            const res = await getCursosRequest();
            setCursos(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const createCurso = async (curso) => {
        try {
            const res = await createCursoRequest(curso);
            console.log(res.data);
            setErrors([]);
        } catch (error) {
            setErrors(error.response.data);
            console.error(error);
            throw error.response.data.message || "Error en el registro.";
        }
    };

    const deleteCurso = async (id) => {
        try {
            const res = await deleteCursoRequest(id);
            if (res.status === 204) setCursos(cursos.filter((curso) => curso._id !== id));
        } catch (error) {
            console.log(error);
        }
    };

    const getCurso = async (id) => {
        try {
            const res = await getCursoRequest(id);
            return res.data;
        } catch (error) {
            console.error(error);
        }
    };

    const updateCurso = async (id, curso) => {
        try {
            await updateCursoRequest(id, curso);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <CursoContext.Provider 
            value={{
                cursos,
                createCurso,
                getCursos,
                deleteCurso,
                getCurso,
                updateCurso,
                errors,
            }}
        >
            {children}
        </CursoContext.Provider>
    );
}
