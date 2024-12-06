import { useState } from 'react';
import { useForm } from 'react-hook-form'
import { useSectores } from "../../../context/SectorContext"
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect } from 'react';
import { IoIosSave } from "react-icons/io";

function RegisterSectorPage() {

    const [sectorNumero, setSectorNumero] = useState();
    
    const { register, handleSubmit, setValue } = useForm();
  
    const { createSector, getSector, updateSector } = useSectores();
    
    const navigate = useNavigate();
    
    const params = useParams();
  
    useEffect(() => {
      async function loadSector() {
        if (params.id) {
          const sector = await getSector(params.id)
          setSectorNumero(sector.numero);
          setValue('nombre', sector.nombre)
          setValue('direccion', sector.direccion)
          setValue('barrio', sector.barrio)  
        }
      }
      loadSector();
    }, []);

    const onSubmit = handleSubmit((data) => {  
        if (params.id) {
          updateSector(params.id, data);
        } else {  
          createSector(data);
        }
        navigate('/administrador/sectores');
      });
    
      return (
        <div className='flex h-[calc(100vh-100px)] items-center justify-center space-x-20'>

            <div className='bg-blue-900 max-w-md w-full p-10 rounded-md items-center justify-center relative'>
            <h1 className='text-2xl font-bold my-2 text-white text-center'>Agregar Sector</h1><br />
                <form onSubmit={onSubmit}>
                    <label className='text-white'>Número de Sector:</label>
                    {params.id ? (
                        // Editando
                        <input 
                            type="text"
                            value={sectorNumero}
                            disabled  
                            className="w-full bg-gray-500 text-white px-4 py-2 rounded-md my-2"  
                        />
                    ) : (
                        // Creando
                        <input 
                            type="text"
                            {...register("numero")} 
                            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"  
                        />
                    )}
                    

                    <label className='text-white'>Nombre:</label>
                    <input 
                        type="text " 
                        {...register("nombre", { required: true })}
                        className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
                        placeholder="Nombre del Sector"
                    ></input>
                    

                    <label className='text-white'>Direccion:</label>
                    <input 
                        type="text" 
                        {...register("direccion", { required: true })}
                        className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
                        placeholder="Dirección"
                    ></input>
                    

                    <label className='text-white'>Barrio:</label>
                    <input 
                        type="text" 
                        {...register("barrio", { required: true })}
                        className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
                        placeholder="Barrio"
                    ></input>
                    
                    <button className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:text-custom-brown2 poppins mt-4" type="submit">
                        <div className='flex'>Guardar <IoIosSave className='ml-4 mt-1'/></div>
                    </button>
                </form>
        
            </div>

        </div>
        
    )
}

export default RegisterSectorPage