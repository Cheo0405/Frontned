import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

function Navbar() {

    const { isAuthenticated, logout, user } = useAuth();
    
    return (
        <nav className="bg-zinc-700 my-3 flex justify-between py-5 px-10 rounded-md">
            <h1 className="text-2xl font-bold">Task Manager</h1>
            <ul className="flex gap-x-2">
                {isAuthenticated ? (
                   <>
                     <li>
                        Welcome {user.nombre}
                     </li>
                     <li>
                        <Link to='/add-sector'>Register Sector</Link>
                     </li>
                     <li>
                        <Link 
                            to='/'
                            onClick={() => {
                                logout();
                            }}
                        >
                           Logout
                        </Link>
                     </li>
                    </>
                ) : (
                    <>
                     <li>
                        <Link to='/login'>Login</Link>
                     </li>
                     <li>
                        <Link to='/registerDocente'>Register Docente</Link>
                     </li>
                    </>
                )}
            </ul>
        </nav>
    )
}

export default Navbar