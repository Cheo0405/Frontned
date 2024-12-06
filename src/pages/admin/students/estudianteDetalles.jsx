import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDocente } from "../../../context/DocentesContext";
import axios from "axios";
import { FaEye } from "react-icons/fa";
import icono from "../../../../public/2000860-removebg-preview.png";

function DocenteDetalles() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [docente, setDocente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cursosDocente, setCursosDocente] = useState([]);

  const { getDocente } = useDocente();

  useEffect(() => {
    const fetchDocenteDetalles = async () => {
      try {

        const estudiantesResponse = await axios.get(
          `https://back-ingsoft-nzbv.onrender.com/api/estudiantes/${id}`
        );

        setDocente(estudiantesResponse.data);

        console.log("id", id);

        const cursosResponse = await axios.get(
          `https://back-ingsoft-nzbv.onrender.com/api/estudiantes/${estudiantesResponse.data.identificacion}/cursos`
        );
        console.log("cursos", cursosResponse.data);
        setCursosDocente(cursosResponse.data);

        setLoading(false);
      } catch (error) {
        console.error("Error al obtener los detalles del docente:", error);
        setLoading(false);
      }
    };

    fetchDocenteDetalles();
  }, [id, getDocente]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!docente) {
    return <div>No se encontró información del docente.</div>;
  }

  const formatFecha = (fecha) => {
    const opciones = { day: "2-digit", month: "long", year: "numeric" };
    return new Date(fecha).toLocaleDateString("es-ES", opciones);
  };

  const CursoCard = ({ curso }) => {
    const [detallesDocentes, setDetallesDocentes] = useState([]);
  
    useEffect(() => {
      const fetchDetallesDocentes = async () => {
        try {
          const promises = curso.docentes.map((idDocente) =>
            axios.get(`https://back-ingsoft-nzbv.onrender.com/api/docentes/${idDocente}`)
          );
          console.log("estos son los promises", promises);
          const resultados = await Promise.all(promises);
          setDetallesDocentes(resultados.map((res) => res.data));
        } catch (error) {
          console.error("Error al obtener los detalles de los docentes:", error);
        }
      };
  
      fetchDetallesDocentes();
    }, [curso.docentes]);
  
    return (
      <div className="curso-card border border-blue-500 rounded-lg p-4 flex flex-col justify-between hover:border-red-500 hover:shadow-lg transition-all">
        <div className="flex justify-end">
          <button
            className="text-green-500"
            onClick={() => navigate(`/administrador/cursos/${curso._id}`)}
          >
            <FaEye style={{ fontSize: "24px" }} />
          </button>
        </div>
        <h2 className="text-lg font-bold">{curso.nombre}</h2>
        <p className="text-sm">Fecha Creación: {formatFecha(curso.createdAt)}</p>
        <div className="mt-4">
          <h3 className="text-md font-semibold text-gray-600">Docentes:</h3>
          {detallesDocentes.length > 0 ? (
            <ul className="list-disc list-inside text-sm text-gray-800">
              {detallesDocentes.map((docente) => (
                <li key={docente._id}>
                  {docente.nombre} {docente.apellido}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-red-500">Cargando docentes...</p>
          )}
        </div>
        <img src={icono} alt="Icono" className="w-16 h-16 mt-4" style={{ marginLeft: "280px", marginTop: "-70px" }} />
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <div style={styles.card} >
        <h2 style={styles.title}>Información Personal</h2>
        <div style={styles.content}>
          <img
            src={docente.image.url}
            alt={docente.nombre}
            style={styles.image}
          />
          <div>
            <p style={{ paddingBottom: "5px" }}>
              <strong>Nombres:</strong> {docente.nombre}
            </p>
            <p style={{ paddingBottom: "5px" }}>
              <strong>Apellidos:</strong> {docente.apellido}
            </p>
            <p style={{ paddingBottom: "5px" }}>
              <strong>Cédula:</strong> {docente.identificacion}
            </p>
            <p style={{ paddingBottom: "5px" }}>
              <strong>Teléfono:</strong> {docente.telefono}
            </p>
            <p style={{ paddingBottom: "5px" }}>
              <strong>Email:</strong> {docente.correo}
            </p>
          </div>
          <div
            style={
              docente.estado === "ACTIVO" ? styles.active : styles.inactive
            }
          >
            {docente.estado === "ACTIVO"
              ? "Este usuario está activo en el sistema"
              : "Este usuario está inactivo en el sistema"}
          </div>
        </div>
      </div>

      <div style={styles.card}>
        <div className="card">
          <h2 className="text-xl font-bold text-blue-500">Inscrito en los cursos...</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {cursosDocente.length > 0 ? (
              cursosDocente.map((curso) => (
                <CursoCard key={curso._id} curso={curso} />
              ))
            ) : (
              <p>No hay cursos asignados a este docente.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    padding: "20px",
    marginTop: "-15px",
  },
  card: {
    backgroundColor: "#fff",
    border: "2px solid #007BFF",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    padding: "20px",
  },
  title: {
    fontSize: "1.5rem",
    color: "#007BFF",
    marginBottom: "10px",
  },
  content: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    position: "relative",
  },
  image: {
    width: "200px",
    height: "200px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "2px solid #007BFF",
  },
  active: {
    position: "absolute",
    top: "70px",
    right: "50px",
    color: "green",
    fontWeight: "bold",
    fontSize: "25px",
  },
  inactive: {
    position: "absolute",
    top: "70px",
    right: "50px",
    color: "red",
    fontWeight: "bold",
    fontSize: "25px",
  },
};

export default DocenteDetalles;
