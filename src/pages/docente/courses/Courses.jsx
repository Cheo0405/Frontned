import React, { useState } from "react";
import { FaEye, FaTrash, FaPlus } from "react-icons/fa";
import { useCursos } from "../../../context/CursoContext.jsx";
import { useNavigate } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import { FaCheck } from "react-icons/fa";
import Modal from "react-modal";
import axios from "axios";
import { useEffect } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { MdSaveAlt } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { FaSignature } from "react-icons/fa6";
import icono from "../../../../public/2000860-removebg-preview.png";
import { VscCalendar, VscEdit } from "react-icons/vsc";

const Courses = () => {
  const [showAviso, setShowAviso] = useState(false);
  const [showDiv, setShowDiv] = useState(false);
  const [cursosE, setCursos] = useState([]);
  const { getCursos, deleteCurso, createCurso } = useCursos();
  const [showCrearAviso, setShowCrearAviso] = useState(false);
  const [showEditarAviso, setShowEditarAviso] = useState(false);
  const [cursoToDelete, setCursoToDelete] = useState(null);
  const [docenteValue, setDocenteValue] = useState("");
  const [cursoEditado, setCursoEditado] = useState(null);
  const [serverError, setServerError] = useState("");

  const [docenteSeleccionado, setDocenteSeleccionado] = useState([]);
  const [docente, setDocente] = useState(null);

  const navigate = useNavigate();
  // Función para manejar la navegación al hacer clic en el botón
  

  // Cargar el usuario desde localStorage
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("user")) || {};
    setDocente(data);
  }, []);

  // Fetch de cursos y docentes, pero solo si `docente` está disponible
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!docente || !docente.identificacion) {
          console.log("Docente no disponible todavía.");
          return; // No hacer la solicitud si el docente no está disponible
        }

        // Obtener los cursos del docente
        const response = await axios.get(`https://back-ingsoft-nzbv.onrender.com/api/docentes/${docente.identificacion}/cursos`);

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
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // Solo llamar a `fetchData` si tenemos un docente
    if (docente) {
      fetchData();
    }
  }, [docente]);

  // Componente para la tarjeta de curso
  const CursoCard = ({ curso }) => {
    // Encuentra los nombres de los docentes para el curso actual
    const docentes = docenteSeleccionado.filter((docente) =>
      curso.docentes.includes(docente._id)
    );

    const handleViewCourse = () => {
      navigate(`/docente/cursos/${curso._id}`); // Redirige a la página de detalles del curso con su ID
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
    <div className="container mx-auto p-16 m-5" style={{ marginTop: "-30px" }}>
      <h1 className="text-[38px] text-center font-bold">Cursos Registrados</h1>
      <br />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cursosE.length > 0 ? (
          cursosE.map((curso) => <CursoCard key={curso._id} curso={curso} />)
        ) : (
          <div className="col-span-3 text-center">
            No hay cursos registrados
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;