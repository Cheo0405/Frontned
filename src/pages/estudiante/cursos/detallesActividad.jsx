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

function DetallesActividad() {
  const { id } = useParams(); // Obtiene el ID de la URL
  const [actividad, setActividad] = useState(null);
  const [estudiante, setEstudiante] = useState(null);
  const [documento, setDocumento] = useState(null);
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
    const storedAdministrador = localStorage.getItem("user");
    if (storedAdministrador) {
      try {
        const parsedUser = JSON.parse(storedAdministrador);
        setEstudiante(parsedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  useEffect(() => {
    const fetchDocumentos = async (id) => {
      console.log("El id que ingresaste es", id);
      try {
        if (!estudiante) return; // Asegúrate de que estudiante no sea null
        console.log("Estudiante", estudiante.id);
        const response = await axios.get(
          `https://back-ingsoft-nzbv.onrender.com/api/actividad/${id}/entrega/${estudiante.id}`
        );
        console.log("Response", response);
        setDocumento(response);
        console.log("Documentos obtenidos:", response.data);
      } catch (error) {
        console.error("Error fetching documents:", error);
      }
    };

    const fetchCurso = async () => {
      try {
        const response = await axios.get(
          `https://back-ingsoft-nzbv.onrender.com/api/actividad/${id}`
        );
        setActividad(response.data);
        console.log("Actividad obtenida:", response.data._id); // Verificar si el curso tiene un ID

        // Solo intenta acceder a estudiante si no es null
        if (estudiante) {
          console.log("Estudiante", estudiante.nombre);
        }

        if (response.data._id && estudiante) {
          fetchDocumentos(response.data._id);
        }
      } catch (error) {
        console.error("Error fetching course data:", error);
      }
    };

    fetchCurso();
  }, [id, estudiante]); // Agrega estudiante como dependencia

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
        `https://back-ingsoft-nzbv.onrender.com/api/actividad/${actividad._id}/entrega/${estudiante.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setShowSuccessModal(true); // Muestra el modal de éxito
      handleRemoveFile(); // Elimina el archivo seleccionado // Cierra el modal después de subir
      await fetchDocumentos(curso._id);
    } catch (error) {
      console.error("Error al subir el documento:", error);
      alert("Error al subir el documento");
    }
  };

  const handleViewDocument = (documento) => {
    const extension = documento;

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
  if (!actividad) {
    return <div>Cargando datos de la actividad...</div>; // Muestra un mensaje de carga mientras se obtienen los datos
  }

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
            {actividad.nombre}
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
            {actividad.descripcion}
          </p>
        </div>
        <div
          style={{
            backgroundColor: "white",
            padding: "30px",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            width: "100%",
            maxWidth: "600px",
            textAlign: "center",
            margin: "20px auto",
          }}
        >
          <h2 style={{ marginBottom: "20px" }}>
            {documento && documento.data && documento.data.length > 0
              ? "Documento Subido"
              : "Subir Documento"}
          </h2>

          {/* Si no hay documentos subidos */}
          {!documento || documento.data.length === 0 ? (
            <>
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
              {selectedFile && (
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
            </>
          ) : (
            // Mostrar el documento subido y espacio para calificación
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  padding: "10px",
                  borderRadius: "10px",
                  border: "2px solid #8C6428",
                }}
              >
                <IoMdDocument size={30} />
                <p>Documento actividad</p>
                <button
                  onClick={() => handleViewDocument("documento")}
                  style={buttonStyle}
                >
                  <FaDownload />
                </button>
              </div>
            </div>
          )}
        </div>
        <div>
          <label style={{ fontWeight: "bold", marginTop: "15px" }}>
            Calificación:
          </label>
          <p>
            {documento && documento.data && documento.data.length > 0
              ? documento.data[0].calificacion || "No calificado aún"
              : "No hay entregas aún"}
          </p>
        </div>
      </div>
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

export default DetallesActividad;
