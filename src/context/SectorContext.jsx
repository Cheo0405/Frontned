import { createContext, useContext, useState } from "react"
import { createSectorRequest, getSectoresRequest, deleteSectorRequest, getSectorRequest, updateSectorRequest } from "../api/sectores";

const SectorContext = createContext();

export const useSectores = () => {
    const context = useContext(SectorContext);

    if (!context) throw new Error("useSector must be used within a SectorProvide");

    return context;
};

export function SectorProvider({ children }) {
    
    const [ sectores, setSectores ] = useState([]);
    const [errors, setErrors] = useState([]);
   
    const getSectores = async () => {
        try {
            const res = await getSectoresRequest()
            setSectores(res.data);
        } catch (error) {
            console.error(error);
        }
       
    }

    const createSector = async (sector) => {
        try {
            const res = await createSectorRequest(sector);
            console.log(res.data);
            setErrors([]);
          } catch (error) {
            setErrors(error.response.data);
            console.error(error);
            throw error.response.data.message || "Error en el registro.";
          }
    }

    const deleteSector = async (id) => {
        try {
            const res = await deleteSectorRequest(id)
            if (res.status === 204) setSectores(sectores.filter((sector) => sector._id !== id));
        } catch (error) {
            console.log(error)
        }
    };

    const getSector = async (id) => {
        try {
            const res = await getSectorRequest(id);
            return res.data;
        } catch (error) {
          console.error(error)   
        }
        
    }

    const  updateSector = async (id, sector) => {
        try {
            await updateSectorRequest(id, sector);
        } catch (error) {
            console.error(error)
        }
    };

    return (
        <SectorContext.Provider 
            value={{
                sectores,
                createSector,
                getSectores,
                deleteSector,
                getSector,
                updateSector,
                errors,
            }}
        >
            { children }
        </SectorContext.Provider>
    );
}