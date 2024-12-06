import React, { useEffect, useState } from "react";
import axios from "axios";
import Slider from "react-slick";
import { FaEye, FaTrash } from "react-icons/fa";
import "./EventCarousel.css";
import { VscEdit } from "react-icons/vsc";

// Componente de tarjeta de evento
const EventCard = ({
  id,
  title,
  date,
  location,
  neighborhood,
  time,
  deleteEvent,
  updateEvent,
  viewEvent,
}) => {
  // Función para formatear la fecha
  const formatDate = (date) => {
    const d = new Date(date);
    return isNaN(d.getTime()) ? "Fecha inválida" : d.toLocaleDateString();
  };

  // Función para formatear la hora
  const formatTime = (time) => {
    if (!time) return "Hora inválida";
    // Crear una fecha arbitraria para combinar con la hora
    const timeParts = time.split(':');
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

  return (
    <div
      className="border border-blue-500 rounded-lg p-4 flex flex-col justify-between mx-2"
      style={{ height: "170px" }}
    >
      <h2 className="text-lg font-bold">{title}</h2>
      <p className="text-sm">Fecha: {formatDate(date)}</p>
      <p className="text-sm">Lugar: {location}</p>
      <p className="text-sm">Hora: {formatTime(time)}</p>
      <div className="flex justify-end space-x-2 mt-2">
        <button className="text-green-500" onClick={() => viewEvent(id)}>
          <FaEye />
        </button>
      </div>
    </div>
  );
};

// Componente de carrusel de eventos
const EventoCarouselPast = ({ title, events, deleteEvent, updateEvent, viewEvent }) => {
  const [sectores, setSectores] = useState([]);

  useEffect(() => {
    const fetchSectores = async () => {
      try {
        const response = await axios.get("https://back-ingsoft-nzbv.onrender.com/api/sectores");
        setSectores(response.data);
      } catch (error) {
        console.error("Error fetching sectores:", error);
      }
    };

    fetchSectores(); // Obtener sectores al cargar el componente
  }, []);

  const getAddress = (sectorNumber) => {
    const sector = sectores.find(sector => sector.nombre === sectorNumber);
    return sector ? `${sector.direccion}, ${sector.barrio}` : "No disponible";
  };

  // Configuración del carrusel
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: Math.min(events.length, 3),
    slidesToScroll: 2,
    nextArrow: <div className="slick-arrow slick-nex">Siguiente</div>,
    prevArrow: <div className="slick-arrow slick-prev">Anterior</div>,
  };

  return (
    <div className="my-8 carousel-container">
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <Slider {...settings}>
        {events.map((event, index) => (
          <EventCard
            key={index}
            id={event._id}
            title={event.nombre_curso}
            date={event.fecha}
            location={getAddress(event.sector)} // Usar la función para obtener la dirección y el barrio
            neighborhood={event.barrio} // Puedes eliminar este prop si `location` ya contiene la información completa
            time={event.hora}
            deleteEvent={deleteEvent}
            updateEvent={updateEvent}
            viewEvent={viewEvent}
          />
        ))}
      </Slider>
    </div>
  );
};

export default EventoCarouselPast;
