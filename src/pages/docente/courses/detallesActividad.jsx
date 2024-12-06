import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FaDownload, FaCheck } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa";
import logoOrganizacion from "../../../assets/logoOrganizacion.png";

function DetallesActividad() {
  const { id } = useParams(); // Obtiene el ID de la URL
  const [actividad, setActividad] = useState(null);
  const [entregas, setEntregas] = useState([]);
  const [calificando, setCalificando] = useState(null); // Controla cuál entrega se está calificando
  const [nuevaCalificacion, setNuevaCalificacion] = useState("");

  useEffect(() => {
    const fetchActividad = async () => {
      try {
        const response = await axios.get(
          `https://back-ingsoft-nzbv.onrender.com/api/actividad/${id}`
        );
        setActividad(response.data);

        // Obtener las entregas relacionadas
        const entregasResponse = await axios.get(
          `https://back-ingsoft-nzbv.onrender.com/api/actividad/${id}/entregas`
        );
        const entregasConEstudiantes = await Promise.all(
          entregasResponse.data.entregas.map(async (entrega) => {
            const estudianteResponse = await axios.get(
              `https://back-ingsoft-nzbv.onrender.com/api/estudiantes/${entrega.estudianteId}`
            );
            return {
              ...entrega,
              estudiante: estudianteResponse.data, // Incluye los datos del estudiante
            };
          })
        );

        setEntregas(entregasConEstudiantes);
      } catch (error) {
        console.error("Error fetching activity or deliveries:", error);
      }
    };

    fetchActividad();
  }, [id]);

  const handleDescargarDocumento = (url) => {
    window.open(url, "_blank");
  };

  const handleCalificar = (entregaId) => {
    setCalificando(entregaId); // Activa la edición para la entrega seleccionada
  };

  const handleGuardarCalificacion = async (estudianteId) => {
    try {
      await axios.patch(
        `https://back-ingsoft-nzbv.onrender.com/api/actividad/${id}/entrega/${estudianteId}/calificar`,
        { calificacion: nuevaCalificacion }
      );
      location.reload();
      setCalificando(null); // Finaliza la edición
      setNuevaCalificacion("");
    } catch (error) {
      console.error("Error al guardar la calificación:", error);
    }
  };

  if (!actividad) {
    return <div>Cargando datos de la actividad...</div>;
  }

  return (
    <div
      style={{
        background: "#3b83bd",
        padding: "20px",
        width: "1200px",
        margin: "40px auto",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
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
          marginTop: "20px",
          background: "white",
          padding: "20px",
          borderRadius: "10px",
        }}
      >
        <h2 style={{ marginBottom: "20px", textAlign: "center" }}>Entregas</h2>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={styles.th}>Identificación</th>
              <th style={styles.th}>Nombre</th>
              <th style={styles.th}>Apellido</th>
              <th style={styles.th}>Documento</th>
              <th style={styles.th}>Calificación</th>
            </tr>
          </thead>
          <tbody>
            {entregas.map((entrega) => (
              <tr key={entrega._id}>
                <td style={styles.td}>{entrega.estudiante.identificacion}</td>
                <td style={styles.td}>{entrega.estudiante.nombre}</td>
                <td style={styles.td}>{entrega.estudiante.apellido}</td>
                <td style={styles.td}>
                  <button
                    style={styles.button}
                    onClick={() =>
                      handleDescargarDocumento(entrega.documentoUrl)
                    }
                  >
                    <FaDownload /> Descargar
                  </button>
                </td>
                <td style={styles.td}>
                  {calificando === entrega._id ? (
                    <>
                      <select
                        value={nuevaCalificacion}
                        onChange={(e) => setNuevaCalificacion(e.target.value)}
                        style={styles.select}
                      >
                        <option value="">Seleccionar</option>
                        <option value="Excelente">Excelente</option>
                        <option value="Bueno">Bueno</option>
                        <option value="Regular">Regular</option>
                      </select>
                      <button
                        style={styles.saveButton}
                        onClick={() =>
                          handleGuardarCalificacion(entrega.estudianteId)
                        }
                      >
                        <FaCheck />
                      </button>
                    </>
                  ) : (
                    <>
                      {entrega.calificacion ? (
                        <p>{entrega.calificacion}</p>
                      ) : (
                        <button
                          style={styles.editButton}
                          onClick={() => handleCalificar(entrega._id)}
                        >
                          Calificar
                        </button>
                      )}
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  th: { border: "1px solid #ccc", padding: "10px", background: "#f5f5f5" },
  td: { border: "1px solid #ccc", padding: "10px" },
  button: {
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    padding: "5px 10px",
    cursor: "pointer",
    borderRadius: "5px",
  },
  select: { marginRight: "10px", padding: "5px" },
  saveButton: {
    backgroundColor: "green",
    color: "white",
    border: "none",
    padding: "5px 10px",
    cursor: "pointer",
    borderRadius: "5px",
  },
  editButton: {
    backgroundColor: "orange",
    color: "white",
    border: "none",
    padding: "5px 10px",
    cursor: "pointer",
    borderRadius: "5px",
    marginLeft: "10px",
  },
};

export default DetallesActividad;
