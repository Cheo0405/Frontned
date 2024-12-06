import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  FaUsers,
  FaFileAlt,
  FaUpload,
  FaUser,
  FaTimes,
  FaCloudUploadAlt,
  FaEye,
  FaTrash,
  FaDownload,
  FaPlusCircle, // Icono para "Crear Actividad"
} from "react-icons/fa"; // Importa los iconos de react-icons
import logoOrganizacion from "../../../assets/logoOrganizacion.png";
import { IoMdDocument } from "react-icons/io";
import { useNavigate } from "react-router-dom"; // Importar useNavigate

function DetallesCurso() {
  const { id } = useParams(); // Obtiene el ID de la URL
  const [curso, setCurso] = useState(null);
  const [docenteSeleccionado, setDocenteSeleccionado] = useState([]);
  const [showModal, setShowModal] = useState(false); // Estado para manejar la visibilidad del modal
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null); // Estado para manejar el archivo seleccionado
  const [filePreview, setFilePreview] = useState(null); // Estado para la vista previa
  const [documentos, setDocumentos] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [actividades, setActividades] = useState([]); // Estado para las actividades
  const [showModalInscritos, setShowModalInscritos] = useState(false);
  const [showModalActividad, setShowModalActividad] = useState(false);
  const [nombreActividad, setNombreActividad] = useState(""); // Nombre de la actividad
  const [descripcionActividad, setDescripcionActividad] = useState(""); // Descripción de la actividad
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCurso = async () => {
      try {
        const response = await axios.get(
          `https://back-ingsoft-nzbv.onrender.com/api/cursos/${id}`
        );
        setCurso(response.data);
        console.log("Curso obtenido:", response.data);

        // Obtener la lista de todos los docentes
        const responseD = await axios.get("https://back-ingsoft-nzbv.onrender.com/api/docentes");
        const docentesData = responseD.data.map((item) => ({
          _id: item._id,
          nombre: item.nombre,
          apellido: item.apellido,
          imagen: item.image.url,
        }));
        setDocenteSeleccionado(docentesData);

        const responseE = await axios.get(
          "https://back-ingsoft-nzbv.onrender.com/api/estudiantes"
        );
        const estudiantesData = responseE.data.map((item) => ({
          _id: item._id,
          identificacion: item.identificacion,
          nombre: item.nombre,
          apellido: item.apellido,
          telefono: item.telefono,
          correo: item.correo,
        }));
        setEstudiantes(estudiantesData);

        // Consultar las actividades asociadas al curso
        const responseA = await axios.get(
          `https://back-ingsoft-nzbv.onrender.com/api/actividad/actividades?cursoId=${id}`
        );
        setActividades(responseA.data.actividades);
        console.log("Actividades obtenidas:", responseA.data.actividades);

        // Mover esta función aquí y comprobar si el curso tiene un ID
        if (response.data._id) {
          fetchDocumentos(response.data._id);
        }
      } catch (error) {
        console.error("Error fetching course data:", error);
      }
    };

    const fetchDocumentos = async (id) => {
      try {
        const response = await axios.get(
          `https://back-ingsoft-nzbv.onrender.com/api/cursos/${id}/documentos`
        );
        setDocumentos(response.data);
        console.log("Documentos obtenidos:", response.data);
      } catch (error) {
        console.error("Error fetching documents:", error);
      }
    };

    fetchCurso();
  }, [id]);

  const crearActividad = async () => {
    try {
      const response = await axios.post(
        `https://back-ingsoft-nzbv.onrender.com/api/actividad/registrarActividad`,
        {
          nombre: nombreActividad,
          descripcion: descripcionActividad,
          cursoId: id,
        }
      );
      console.log("Actividad creada con éxito", response.data);
      setShowModal(false); // Cierra el modal al crear la actividad
      // Aquí puedes agregar una lógica para actualizar la lista de actividades si es necesario
    } catch (error) {
      console.error("Error al crear actividad", error);
      alert("Hubo un error al crear la actividad");
    }
  };

  const handleCloseModal = () => {
    setShowModalActividad(false); // Cierra el modal sin hacer nada
  };

  // Filtrar estudiantes inscritos
  const estudiantesDelCurso = estudiantes.filter((estudiante) =>
    curso?.inscritos.includes(estudiante._id)
  );

  const handleCloseModalInscritos = () => {
    setShowModalInscritos(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFilePreview(file.name); // Guardamos el nombre del archivo para la vista previa
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Por favor seleccione un archivo");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await axios.post(
        `https://back-ingsoft-nzbv.onrender.com/api/cursos/${id}/documentos`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setShowSuccessModal(true); // Muestra el modal de éxito
      setShowModal(false); // Cierra el modal de subir documento
      handleRemoveFile(); // Elimina el archivo seleccionado // Cierra el modal después de subir
      // Puedes agregar lógica para actualizar la lista de documentos si es necesario
      // Llama a fetchDocumentos para actualizar la lista
      await fetchDocumentos(curso._id);
    } catch (error) {
      console.error("Error al subir el documento:", error);
      alert("Error al subir el documento");
    }
  };

  const handleViewDocument = (documento) => {
    const extension = documento.nombre.split(".").pop().toLowerCase();

    // Verifica si el archivo es PDF
    if (extension === "pdf") {
      window.open(documento.url, "_blank"); // Abre en una nueva pestaña
    }
    // Otras extensiones como Word (puedes ajustar según tu necesidad)
    else if (extension === "doc" || extension === "docx") {
      window.open(documento.url, "_blank"); // Abre en una nueva pestaña (soportado por algunos navegadores)
    }
    // Puedes agregar más condiciones para otros tipos de archivo si es necesario
    else {
      alert("Formato no soportado para previsualización.");
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
  };

  // Verificación condicional para evitar errores de null
  if (!curso) {
    return <div>Cargando datos del curso...</div>; // Muestra un mensaje de carga mientras se obtienen los datos
  }

  // Filtrar los docentes asignados al curso
  const docentesDelCurso = docenteSeleccionado.filter((docente) =>
    curso.docentes.includes(docente._id)
  );

  const handleDeleteDocument = async (documentId) => {
    try {
      await axios.delete(
        `https://back-ingsoft-nzbv.onrender.com/api/cursos/${id}/documentos/${documentId}`
      );
      setDocumentos(documentos.filter((doc) => doc._id !== documentId));
      alert("Documento eliminado exitosamente");
    } catch (error) {
      console.error("Error al eliminar el documento:", error);
      alert("Error al eliminar el documento");
    }
  };

  const buttonStyle = {
    backgroundColor: "#2a4a7b",
    color: "white",
    padding: "10px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  };

  return (
    <>
      <div
        style={{
          background: "#3b83bd",
          padding: "20px",
          width: "1200px",
          margin: "40px auto",
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          marginTop: "-15px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "10px",
          }}
        >
          <h1
            style={{
              color: "white",
              fontSize: "50px",
              fontWeight: "bold",
              marginLeft: "80px",
            }}
          >
            {curso.nombre}
          </h1>
          <img
            src={logoOrganizacion}
            alt="Logo de la organización"
            style={{
              width: "150px",
              background: "white",
              borderRadius: "25px",
              marginRight: "30px",
            }}
          />
        </div>

        {/* Contenedor para la descripción */}
        <div
          style={{
            marginTop: "30px",
            marginBottom: "50px",
            padding: "20px",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            borderRadius: "10px",
            textAlign: "center",
          }}
        >
          <p
            style={{
              color: "white",
              fontSize: "20px",
              fontWeight: "bold",
            }}
          >
            {curso.descripcion}
          </p>
        </div>

        {/* Sección de docentes */}
        <div style={{ color: "white", marginBottom: "20px" }}>
          <h3 style={{ marginBottom: "20px", marginLeft: "30px" }}>
            Docentes Asignados:
          </h3>
          {docentesDelCurso.length > 0 ? (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "20px",
                marginLeft: "30px",
              }}
            >
              {docentesDelCurso.map((docente) => (
                <div
                  key={docente._id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    padding: "10px",
                    borderRadius: "10px",
                  }}
                >
                  <img
                    src={docente.imagen} // Mostrar la imagen del docente
                    alt={`${docente.nombre} ${docente.apellido}`}
                    style={{
                      width: "100px",
                      height: "100px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                  <p
                    style={{
                      fontWeight: "bold",
                      fontSize: "18px",
                      marginLeft: "20px",
                      color: "white",
                    }}
                  >
                    {docente.nombre} {docente.apellido}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p>No hay docentes asignados a este curso.</p>
          )}
        </div>
        <div style={{ marginTop: "40px", color: "white" }}>
          <h3 style={{ marginBottom: "20px", marginLeft: "30px" }}>
            Documentos del Curso:
          </h3>
          {documentos.length > 0 ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                marginLeft: "30px",
              }}
            >
              {documentos.map((documento) => (
                <div
                  key={documento._id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    padding: "10px",
                    borderRadius: "10px",
                  }}
                >
                  <IoMdDocument size={30} />
                  <p style={{ color: "white" }}>{documento.nombre}</p>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      onClick={() => handleViewDocument(documento)}
                      style={buttonStyle}
                    >
                      <FaDownload />
                    </button>
                    <button
                      onClick={() => handleDeleteDocument(documento._id)}
                      style={buttonStyle}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No hay documentos disponibles para este curso.</p>
          )}
        </div>
        <div style={{ marginTop: "40px", color: "white" }}>
          <h3 style={{ marginBottom: "20px", marginLeft: "30px" }}>
            Actividades del Curso:
          </h3>
          {actividades.length > 0 ? (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap", // Para que se acomoden en varias filas si es necesario
                gap: "20px",
                marginLeft: "30px",
                cursor: "pointer",
              }}
            >
              {actividades.map((actividad) => (
                <div
                  key={actividad._id}
                  onClick={() => navigate(`/estudiante/actividad/${actividad._id}`)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    padding: "10px",
                    borderRadius: "10px",
                    width: "220px", // Ajusta el ancho según sea necesario
                  }}
                >
                  {/* Icono de actividad (puedes usar otros iconos según la actividad) */}
                  <FaFileAlt size={30} color="#ffffff" />
                  <p
                    style={{
                      fontWeight: "bold",
                      fontSize: "16px",
                      marginLeft: "10px",
                      color: "white",
                    }}
                  >
                    {actividad.nombre}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p>No hay actividades registradas para este curso.</p>
          )}
        </div>
      </div>
      {/* Sección de botones debajo del contenedor */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "30px",
          marginTop: "20px",
        }}
      >
        {/* Botón 3: Subir Material */}
        <button
          style={{
            backgroundColor: "#2a4a7b",
            color: "white",
            padding: "15px 30px",
            borderRadius: "10px",
            fontSize: "16px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            border: "none",
            cursor: "pointer",
            transition: "background-color 0.3s ease",
          }}
          onClick={() => setShowModal(true)}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#1f3a61")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#2a4a7b")
          }
        >
          <FaUpload />
          Subir Material
        </button>
        {/* Modal de inscritos */}
        {showModalInscritos && (
          <div
            style={{
              position: "fixed",
              top: "0",
              left: "0",
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              style={{
                background: "white",
                padding: "20px",
                borderRadius: "10px",
                width: "80%",
                maxHeight: "90%",
                overflowY: "auto",
              }}
            >
              <h2
                style={{
                  textAlign: "center",
                  fontSize: "20px",
                  marginBottom: "10px",
                }}
              >
                Estudiantes Inscritos
              </h2>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                      Identificación
                    </th>
                    <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                      Nombres
                    </th>
                    <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                      Apellidos
                    </th>
                    <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                      Teléfono
                    </th>
                    <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                      Correo
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {estudiantesDelCurso.map((estudiante) => (
                    <tr key={estudiante._id}>
                      <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                        {estudiante.identificacion}
                      </td>
                      <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                        {estudiante.nombre}
                      </td>
                      <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                        {estudiante.apellido}
                      </td>
                      <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                        {estudiante.telefono}
                      </td>
                      <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                        {estudiante.correo}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button
                style={{
                  marginTop: "20px",
                  backgroundColor: "#d9534f",
                  color: "white",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
                onClick={handleCloseModalInscritos}
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>
      {/* Modal */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "30px",
              borderRadius: "10px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              width: "400px",
              textAlign: "center",
            }}
          >
            <h2 style={{ marginBottom: "20px" }}>Subir Documento</h2>

            {!selectedFile ? (
              <div
                style={{
                  border: "2px dashed #ccc",
                  padding: "20px",
                  marginBottom: "20px",
                  cursor: "pointer",
                }}
              >
                <label htmlFor="fileInput">
                  <FaCloudUploadAlt
                    size={50}
                    style={{ marginLeft: "120px" }}
                    color="#ccc"
                  />
                  <p>Seleccionar archivo</p>
                </label>
                <input
                  id="fileInput"
                  type="file"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
              </div>
            ) : (
              <div style={{ marginBottom: "20px" }}>
                <button
                  onClick={handleRemoveFile}
                  style={{
                    backgroundColor: "red",
                    color: "white",
                    padding: "0px",
                    borderRadius: "5px",
                    border: "none",
                    cursor: "pointer",
                    width: "15px",
                    height: "15px",
                    marginLeft: "300px",
                  }}
                >
                  <FaTimes />
                </button>
                <p>Archivo seleccionado: {filePreview}</p>
              </div>
            )}
            <p>*Recuerda subir documentos con nombres de archivo válidos</p>
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                marginTop: "20px",
              }}
            >
              <button
                onClick={handleUpload}
                style={{
                  backgroundColor: "#2a4a7b",
                  color: "white",
                  padding: "10px 20px",
                  borderRadius: "5px",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                }}
              >
                <FaUpload />
                Subir
              </button>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  backgroundColor: "gray",
                  color: "white",
                  padding: "10px 20px",
                  borderRadius: "5px",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                }}
              >
                <FaTimes />
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal de éxito */}
      {showSuccessModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              width: "300px",
              textAlign: "center",
            }}
          >
            <h2>Documento Subido Exitosamente</h2>
            <button
              onClick={handleCloseSuccessModal} // Cierra el modal de éxito
              style={{
                marginTop: "20px",
                backgroundColor: "#2a4a7b",
                color: "white",
                padding: "10px",
                borderRadius: "5px",
                border: "none",
                cursor: "pointer",
              }}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default DetallesCurso;
