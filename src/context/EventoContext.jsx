import { createContext, useContext, useState } from "react";
import { 
    createEventoRequest, 
    getEventosRequest, 
    deleteEventoRequest, 
    getEventoRequest, 
    updateEventoRequest 
} from "../api/eventos";

const EventoContext = createContext();

export const useEventos = () => {
    const context = useContext(EventoContext);

    if (!context) throw new Error("useEventos must be used within an EventoProvider");

    return context;
};

export function EventoProvider({ children }) {
    
    const [eventos, setEventos] = useState([]);
    const [errors, setErrors] = useState([]);

    const getEventos = async () => {
        try {
            const res = await getEventosRequest();
            setEventos(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const createEvento = async (evento) => {
        try {
            const res = await createEventoRequest(evento);
            console.log(res.data);
            setErrors([]);
        } catch (error) {
            setErrors(error.response.data.message ? [error.response.data.message] : ["Error desconocido"]);
            console.error("este es el error", error);
        }
    };

    const deleteEvento = async (id) => {
        try {
            const res = await deleteEventoRequest(id);
            if (res.status === 204) setEventos(eventos.filter((evento) => evento._id !== id));
        } catch (error) {
            console.log(error);
        }
    };

    const getEvento = async (id) => {
        try {
            const res = await getEventoRequest(id);
            return res.data;
        } catch (error) {
            console.error(error);
        }
    };

    const updateEvento = async (id, evento) => {
        try {
            await updateEventoRequest(id, evento);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <EventoContext.Provider 
            value={{
                eventos,
                createEvento,
                getEventos,
                deleteEvento,
                getEvento,
                updateEvento,
                errors,
            }}
        >
            {children}
        </EventoContext.Provider>
    );
}
