import { useSectores } from "../context/SectorContext"
import {Link} from 'react-router-dom'

function SectorCard({ sector }) {
    
    const {deleteSector} = useSectores();

    return (
        <div className="bg-zinc-800 max-w-md  w-full p-10 rounded-md">
            <header className="flex justify-between">
                <h1 className="text-2xl font-bold">{sector.nombre}</h1>
                <div className="flex gap-x-2 items-center">
                    <button 
                        onClick={() => {
                            deleteSector(sector._id);
                    }}
                    >
                       delete
                    </button>
                    <Link to={`/sectores/${sector._id}`}>edit</Link>
                </div>
            </header>
            <p className="text-slate-300">{sector.barrio}</p>
        </div>
    )
}

export default SectorCard