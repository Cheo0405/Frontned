import React, { useEffect, useState } from "react";
import axios from "axios";
import Slider from "react-slick";
import { FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const EventCard = ({ id, title, date, location, time }) => {
  const navigate = useNavigate();
  const formatDate = (date) => {
    const d = new Date(date);
    return isNaN(d.getTime()) ? "Fecha inválida" : d.toLocaleDateString();
  };

  const formatTime = (time) => {
    if (!time) return "Hora inválida";
    const timeParts = time.split(":");
    if (timeParts.length === 2) {
      const [hours, minutes] = timeParts;
      const date = new Date();
      date.setHours(parseInt(hours, 10));
      date.setMinutes(parseInt(minutes, 10));
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    }
    return "Hora inválida";
  };

  const handleViewEvent = () => {
    // Navigate to the event details page with the event ID
    navigate(`/docente/vereventos/${id}`);
  };

  return (
    <div
      className="border border-blue-500 rounded-lg p-4 flex flex-col justify-between mx-4"
      style={{ minHeight: "200px" }}
    >
      <h2 className="text-lg font-bold">{title}</h2>
      <p className="text-sm">Fecha: {formatDate(date)}</p>
      <p className="text-sm">Lugar: {location}</p>
      <p className="text-sm">Hora: {formatTime(time)}</p>
      <div className="flex justify-end space-x-2 mt-2">
        <button className="text-green-500" onClick={handleViewEvent}>
          <FaEye />
        </button>
      </div>
    </div>
  );
};

const EventoCarousel = ({ title }) => {
  const [sectores, setSectores] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState({
    upcoming: [],
    past: [],
  });

  useEffect(() => {
    const docenteId = JSON.parse(localStorage.getItem("user"))?.id;
    if (!docenteId) return;

    const fetchEventsAndFilter = async () => {
      try {
        const eventosResponse = await axios.get(
          "https://back-ingsoft-nzbv.onrender.com/api/eventos"
        );
        const cursosResponse = await axios.get(
          "https://back-ingsoft-nzbv.onrender.com/api/cursos"
        );
        const eventos = eventosResponse.data;
        const cursos = cursosResponse.data;

        const today = new Date();
        const filtered = eventos.filter((event) => {
          const cursoNombre = event.nombre_curso
            .replace("Evento Curso ", "")
            .trim();
          const curso = cursos.find((c) => c.nombre.trim() === cursoNombre);
          return curso && curso.docentes.includes(docenteId);
        });

        setFilteredEvents({
          upcoming: filtered.filter((event) => new Date(event.fecha) >= today),
          past: filtered.filter((event) => new Date(event.fecha) < today),
        });
      } catch (error) {
        console.error("Error fetching events or courses:", error);
      }
    };

    fetchEventsAndFilter();
  }, []);

  useEffect(() => {
    const fetchSectores = async () => {
      try {
        const response = await axios.get("https://back-ingsoft-nzbv.onrender.com/api/sectores");
        setSectores(response.data);
      } catch (error) {
        console.error("Error fetching sectores:", error);
      }
    };

    fetchSectores();
  }, []);

  const getAddress = (sectorNumber) => {
    const sector = sectores.find((sector) => sector.nombre === sectorNumber);
    return sector ? `${sector.direccion}, ${sector.barrio}` : "No disponible";
  };

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 2,
    nextArrow: <div className="slick-arrow slick-next">Siguiente</div>,
    prevArrow: <div className="slick-arrow slick-prev">Anterior</div>,
  };

  return (
    <div className="my-8 carousel-container">
      {Object.entries(filteredEvents).map(([key, events]) => (
        <div key={key}>
          <h3 className="text-xl font-semibold mb-4">
            {key === "upcoming" ? "Próximos Eventos" : "Eventos Pasados"}
          </h3>
          <Slider {...settings}>
            {events.map((event, index) => (
              <EventCard
                key={index}
                id={event._id}
                title={event.nombre_curso}
                date={event.fecha}
                location={getAddress(event.sector)}
                time={event.hora}
              />
            ))}
          </Slider>
        </div>
      ))}
    </div>
  );
};

export default EventoCarousel;
