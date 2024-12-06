import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "react-modal";
import { FaCalendarAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

import EventoCarousel from "../../../components/docente/EventoCarousel.jsx";

Modal.setAppElement("#root");

function EventosDocente() {
  const [eventosPasados, setEventosPasados] = useState([]);
  const [serverError, setServerError] = useState("");
  const [identificador, setIdentificador] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        const user = storedUser ? JSON.parse(storedUser) : null;
        setIdentificador(user.id);
        const response = await axios.get("https://back-ingsoft-nzbv.onrender.com/api/eventos");
        const fetchedEvents = response.data;

        const today = new Date();
        const pastEvents = fetchedEvents.filter(
          (event) => new Date(event.fecha) < today
        );
        const upcomingEvents = fetchedEvents.filter(
          (event) => new Date(event.fecha) >= today
        );
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    const fetchSectores = async () => {
      try {
        const response = await axios.get("https://back-ingsoft-nzbv.onrender.com/api/sectores");
      } catch (error) {
        console.error("Error fetching sectores:", error);
      }
    };

    const fetchCursos = async () => {
      // Nuevo efecto para obtener los cursos
      try {
        const response = await axios.get("https://back-ingsoft-nzbv.onrender.com/api/cursos");
      } catch (error) {
        console.error("Error fetching cursos:", error);
      }
    };

    fetchEvents();
    fetchSectores();
    fetchCursos(); // Obtener cursos al cargar el componente
  }, []);

  const formatDateForInput = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0]; // Convertir a YYYY-MM-DD
  };

  useEffect(() => {
    if (serverError) {
      const timer = setTimeout(() => {
        setServerError(""); // Limpiar el mensaje de error después de 5 segundos
      }, 5000);
      return () => clearTimeout(timer); // Limpiar el temporizador si el componente se desmonta
    }
  }, [serverError]);

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="container mx-auto p-4 ">
      <h1 className="text-3xl font-bold text-center mb-8">
        Eventos Registrados
      </h1>
      <EventoCarousel title="Eventos Pasados" events={eventosPasados} />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "30px",
          marginTop: "20px",
        }}
      >
        <Link
          style={{
            backgroundColor: "#2a4a7b",
            color: "white",
            padding: "15px 30px",
            borderRadius: "10px",
            fontSize: "17px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            border: "none",
            cursor: "pointer",
            transition: "background-color 0.3s ease",
          }}
          to={`/docente/eventos/horario/${identificador}`}
        >
          <FaCalendarAlt className="w-6" />
          <span>Visualizar Horario</span>
        </Link>
      </div>
    </div>
  );
}

export default EventosDocente;
