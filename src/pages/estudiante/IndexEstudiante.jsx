import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEye } from "react-icons/fa";
import icono from "../../../public/2000860-removebg-preview.png";
import { useNavigate } from "react-router-dom";

function IndexEstudiante() {
  const [administrador, setAdministrador] = useState(null);
  const [cursos, setCursos] = useState([]); // Estado para los cursos
  const [docentes, setDocentes] = useState([]); // Estado para los docentes
  const [docenteSeleccionado, setDocenteSeleccionado] = useState([]);
  const navigate = useNavigate();

  // Cargar administrador desde localStorage
  useEffect(() => {
    const storedAdministrador = localStorage.getItem("user");
    if (storedAdministrador) {
      setAdministrador(JSON.parse(storedAdministrador));
    }
  }, []);

  // Cargar los cursos y los docentes cuando 'administrador' cambie
  useEffect(() => {
    const fetchData = async () => {
      if (administrador) {
        // Obtener todos los cursos del backend
        const response = await axios.get(
          `https://back-ingsoft-nzbv.onrender.com/api/estudiantes/${administrador.identificacion}/cursos`
        ); // Asegúrate de usar la ruta correcta de tu backend

        console.log(response);

        // Obtener la lista de todos los docentes
        const responseD = await axios.get("https://back-ingsoft-nzbv.onrender.com/api/docentes");
        const docentesData = responseD.data.map((item) => ({
          _id: item._id,
          nombre: item.nombre,
          apellido: item.apellido,
        }));
        setDocenteSeleccionado(docentesData);

        // Formatear las fechas de los cursos y guardarlos en el estado
        const cursos = response.data.map((item) => {
          const date = new Date(item.createdAt);
          const formattedDate = date.toISOString().split("T")[0]; // Formato YYYY-MM-DD
          return {
            ...item,
            fecha: formattedDate, // Guardar la fecha formateada
          };
        });
        setCursos(cursos);
      }
    };
    if (administrador) {
      fetchData();
    }
  }, [administrador]);

  // Condicionalmente renderizar el contenido solo si 'administrador' no es null
  if (!administrador) {
    return <p>Cargando...</p>;
  }

  // Componente para la tarjeta de curso
  const CursoCard = ({ curso }) => {
    // Encuentra los nombres de los docentes para el curso actual
    const docentes = docenteSeleccionado.filter((docente) =>
      curso.docentes.includes(docente._id)
    );

    const handleViewCourse = () => {
      navigate(`/estudiante/curso/${curso._id}`); // Redirige a la página de detalles del curso con su ID
    };

    console.log("Docentes del curso actual:", docentes);

    return (
      <div className="border border-blue-500 rounded-lg p-4 flex flex-col justify-between transition-all duration-300 ease-in-out hover:border-red-500 hover:shadow-lg">
        {" "}
        <div className="flex justify-end space-x-2">
          <button className="text-green-500 mr-4" onClick={handleViewCourse}>
            <FaEye style={{ fontSize: "24px" }} />
          </button>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex-grow" style={{ marginTop: "-20px" }}>
            <h2 className="text-lg font-bold">{curso.nombre}</h2>
            <p className="text-sm">Fecha Creación: {curso.fecha}</p>
            <div className="mt-4">
              <h3 className="text-md font-semibold">Dirigido por:</h3>
              {docentes.length > 0 ? (
                <ul>
                  {docentes.map((docente) => (
                    <li key={docente._id}>
                      {docente.nombre} {docente.apellido}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No asignado</p>
              )}
            </div>
          </div>
          <div className="flex-shrink-0" style={{ marginRight: "40px" }}>
            <img src={icono} alt="Icono" className="w-16 h-16" />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      style={{ marginTop: "4.5rem" }}
      className="flex flex-col items-center justify-center max-h-screen gap-3"
    >
      <div style={{ marginTop: "-40px" }}>
        <p
          style={{ marginLeft: "-100px", fontSize: "70px", fontWeight: "bold" }}
        >
          ¡Hola, <br />
          {administrador.nombre}!
        </p>
      </div>
      <div style={{ marginTop: "60px" }}>
        <h2 style={{ marginBottom: "40px" }}>Cursos en los que participas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {cursos.length > 0 ? (
            cursos.map((curso) => <CursoCard key={curso._id} curso={curso} />)
          ) : (
            <div className="col-span-3 text-center">
              No hay cursos registrados
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default IndexEstudiante;
