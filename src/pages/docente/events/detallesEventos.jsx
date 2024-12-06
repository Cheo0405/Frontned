import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ImUserPlus, ImUserCheck } from "react-icons/im";
import { PlusCircleIcon } from "@heroicons/react/solid";
import axios from "axios";
import Modal from "react-modal";

Modal.setAppElement("#root");

function DetallesEventos() {
  const { id } = useParams();
  const [evento, setEvento] = useState(null);
  const [docentes, setDocentes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [estudiantes, setEstudiantes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // Función para formatear la hora
  const formatTime = (time) => {
    if (!time) return "Hora inválida";
    // Crear una fecha arbitraria para combinar con la hora
    const timeParts = time.split(":");
    if (timeParts.length === 2) {
      const [hours, minutes] = timeParts;
      const date = new Date();
      date.setHours(parseInt(hours, 10));
      date.setMinutes(parseInt(minutes, 10));
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true, // Mostrar la hora en formato de 12 horas
      });
    }
    return "Hora inválida";
  };

  useEffect(() => {
    const fetchEventoDetalles = async () => {
      try {
        // 1. Obtiene el evento por ID
        const eventoResponse = await axios.get(
          `https://back-ingsoft-nzbv.onrender.com/api/eventos/${id}`
        );
        const eventoData = eventoResponse.data;
        setEvento(eventoData);

        // 2. Busca el curso relacionado al evento
        const cursosResponse = await axios.get(
          `https://back-ingsoft-nzbv.onrender.com/api/cursos`
        );
        const cursoEncontrado = cursosResponse.data.find(
          (curso) =>
            curso.nombre ===
            eventoData.nombre_curso.replace("Evento Curso ", "").trim()
        );
        setCurso(cursoEncontrado);

        if (cursoEncontrado) {
          // 3. Obtiene los nombres y apellidos de los docentes relacionados
          const usuariosResponse = await axios.get(
            `https://back-ingsoft-nzbv.onrender.com/api/usuarios`
          );
          const docentesInfo = cursoEncontrado.docentes.map((docenteId) => {
            const docente = usuariosResponse.data.find(
              (usuario) => usuario._id === docenteId.toString() // Comparación ajustada
            );
            return docente
              ? `${docente.nombre} ${docente.apellido}` // Solo nombre y apellido
              : "Docente desconocido";
          });
          setDocentes(docentesInfo);
        }
      } catch (err) {
        setError(
          "No se pudo cargar la información. Por favor, inténtalo más tarde."
        );
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEventoDetalles();
  }, [id]);

  const fetchEstudiantes = async () => {
    try {
      const response = await axios.get(`https://back-ingsoft-nzbv.onrender.com/api/estudiantes`);
      setEstudiantes(response.data);
    } catch (error) {
      console.error("Error al obtener los estudiantes:", error);
    }
  };

  const handleRegistrarAsistencia = async (idEstudiante) => {
    try {
      await axios.post(
        `https://back-ingsoft-nzbv.onrender.com/api/eventos/registrarAsistente/${idEstudiante}`
      );
      alert("Asistencia registrada correctamente.");
    } catch (error) {
      console.error("Error al registrar asistencia:", error);
    }
  };

  const filteredEstudiantes = estudiantes.filter((estudiante) =>
    `${estudiante.nombre} ${estudiante.apellido} ${estudiante.documento}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const paginatedEstudiantes = filteredEstudiantes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (isLoading) {
    return <div>Cargando información del evento...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }
  return (
    <>
      <h1 className="text-3xl font-bold text-center mb-8 mt-9">
        Información sobre el Evento
      </h1>
      <div
        style={{
          padding: "60px",
          width: "800px",
          height: "400px",
          margin: "40px auto",
          borderRadius: "10px",
          border: "3px solid #8C6428",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          opacity: 0.8,
        }}
      >
        {/* Información del evento */}
        <div className="text-center flex">
          <h1 className="text-blue-700 font-bold m-4 ml-20 text-2xl">
            Nombre:{" "}
          </h1>
          <p className="m-4 text-center text-lg">{evento.nombre_curso}</p>
        </div>

        <div className="flex justify-center gap-8 my-4">
          <div className="mr-20">
            <h1 className="text-blue-700 font-bold text-2xl  mb-2">
              Docentes a cargo:
            </h1>
            {docentes.map((docente, index) => (
              <h1 className=" text-lg" key={index}>
                {docente}
              </h1>
            ))}
          </div>
          <div className="ml-20">
            <h1 className="text-blue-700 font-bold text-2xl mb-2">
              El evento se realizara en:
            </h1>
            <p className="text-lg">{evento.sector}</p>
          </div>
        </div>

        <div className="text-center flex justify-end">
          <h1 className="text-blue-700 font-bold m-4 text-2xl">
            Se realizara en el siguiente horario:
          </h1>
          <p className="m-4 text-lg">
            {new Date(evento.fecha).toLocaleDateString("es-ES", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </p>
          <p className="m-4 mr-16 text-lg">{formatTime(evento.hora)}</p>
        </div>
      </div>

      {/* Botones */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "30px",
          marginTop: "20px",
        }}
      >
        <button
          style={{
            backgroundColor: "#2a4a7b",
            color: "white",
            padding: "15px 30px",
            borderRadius: "10px",
            fontSize: "20px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            border: "none",
            cursor: "pointer",
            transition: "background-color 0.3s ease",
          }}
        >
          <ImUserCheck />
          Visualizar Asistentes
        </button>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        style={{
          content: {
            width: "80%",
            margin: "auto",
            borderRadius: "10px",
          },
        }}
      >
        <h2 className="text-2xl font-bold mb-4">Registrar Asistencia</h2>
        <input
          type="text"
          placeholder="Buscar por nombre o documento"
          className="border p-2 mb-4 w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <table className="table-auto w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="border p-2">Documento</th>
              <th className="border p-2">Nombre</th>
              <th className="border p-2">Apellido</th>
              <th className="border p-2">Acción</th>
            </tr>
          </thead>
          <tbody>
            {paginatedEstudiantes.map((estudiante) => (
              <tr key={estudiante._id}>
                <td className="border p-2">{estudiante.documento}</td>
                <td className="border p-2">{estudiante.nombre}</td>
                <td className="border p-2">{estudiante.apellido}</td>
                <td className="border p-2 text-center">
                  <PlusCircleIcon
                    className="h-6 w-6 text-green-500 cursor-pointer"
                    onClick={() => handleRegistrarAsistencia(estudiante._id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Paginación */}
        <div className="flex justify-between mt-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Anterior
          </button>
          <span>
            Página {currentPage} de{" "}
            {Math.ceil(filteredEstudiantes.length / itemsPerPage)}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) =>
                Math.min(
                  prev + 1,
                  Math.ceil(filteredEstudiantes.length / itemsPerPage)
                )
              )
            }
            disabled={
              currentPage ===
              Math.ceil(filteredEstudiantes.length / itemsPerPage)
            }
          >
            Siguiente
          </button>
        </div>
      </Modal>
    </>
  );
}

export default DetallesEventos;
