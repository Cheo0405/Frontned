import React, { useEffect, useState } from "react";
import { FaEye, FaTrash, FaSpinner, FaCheck } from "react-icons/fa";
import axios from "axios";
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import Modal from "react-modal";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { MdSaveAlt } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import Slider from "react-slick";
import EventoCarousel from "../../../components/admin/EventoCarousel";
import { useEventos } from "../../../context/EventoContext.jsx";
import EventoCarouselPast from "../../../components/admin/EventoCarouselPast.jsx";
import { useNavigate } from "react-router-dom";

Modal.setAppElement("#root");

const Events = () => {
  const [events, setEvents] = useState([]);
  const [showCrearAviso, setShowCrearAviso] = useState(false);
  const [showEditarAviso, setShowEditarAviso] = useState(false);
  const [sectores, setSectores] = useState([]);
  const [cursos, setCursos] = useState([]); // Nuevo estado para los cursos
  const [eventosPasados, setEventosPasados] = useState([]);
  const [eventosProximos, setEventosProximos] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [serverError, setServerError] = useState("");
  const [eventToEdit, setEventToEdit] = useState(null);
  const [showEliminarAviso, setShowEliminarAviso] = useState(false);
  const [showReloadAviso, setShowReloadAviso] = useState(false);
  const [eventIdToDelete, setEventIdToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("https://back-ingsoft-nzbv.onrender.com/api/eventos");
        const fetchedEvents = response.data;
        console.log("Eventos obtenidos:", fetchedEvents); // Verifica si los eventos están llegando

        setEvents(fetchedEvents);

        const today = new Date();
        const pastEvents = fetchedEvents.filter(
          (event) => new Date(event.fecha) < today
        );
        const upcomingEvents = fetchedEvents.filter(
          (event) => new Date(event.fecha) >= today
        );

        setEventosPasados(pastEvents);
        setEventosProximos(upcomingEvents);

        console.log("Eventos pasados:", pastEvents);
        console.log("Eventos próximos:", upcomingEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    const fetchSectores = async () => {
      try {
        const response = await axios.get("https://back-ingsoft-nzbv.onrender.com/api/sectores");
        setSectores(response.data);
      } catch (error) {
        console.error("Error fetching sectores:", error);
      }
    };

    const fetchCursos = async () => {
      // Nuevo efecto para obtener los cursos
      try {
        const response = await axios.get("https://back-ingsoft-nzbv.onrender.com/api/cursos");
        setCursos(response.data);
      } catch (error) {
        console.error("Error fetching cursos:", error);
      }
    };

    fetchEvents();
    fetchSectores();
    fetchCursos(); // Obtener cursos al cargar el componente
  }, []);

  const handleDeleteEvent = (id) => {
    setEventIdToDelete(id); // Guardar el ID del evento a eliminar
    setShowEliminarAviso(true); // Mostrar el modal de confirmación
  };

  const handleReloadEvent = (id) => {
    setEventIdToDelete(id); // Guardar el ID del evento a eliminar
    setShowReloadAviso(true); // Mostrar el modal de confirmación
  };

  const deleteEvent = async () => {
    try {
      await axios.delete(
        `https://back-ingsoft-nzbv.onrender.com/api/eventos/${eventIdToDelete}`
      );
      setEventosPasados((prevEvents) =>
        prevEvents.filter((event) => event._id !== eventIdToDelete)
      );
      setEventosProximos((prevEvents) =>
        prevEvents.filter((event) => event._id !== eventIdToDelete)
      );
      setShowEliminarAviso(false); // Ocultar el modal de confirmación
      setShowReloadAviso(false); // Ocultar el modal de confirmación
      setEventIdToDelete(null); // Limpiar el ID del evento
      location.reload();
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const updatedEvent = async (id) => {
    const response = await axios.get(`https://back-ingsoft-nzbv.onrender.com/api/eventos/${id}`);
    const event = response.data;
    // Formatear la fecha antes de establecer el estado
    setEventToEdit({
      ...event,
      fecha: formatDateForInput(event.fecha), // Formatear la fecha
    });
    setShowEditarAviso(true);
    console.log("Evento actualizado:", id);
  };

  const viewEvent = async (id) => {
    console.log("ID del evento a visualizar:", id);
    navigate(`/administrador/eventos/${id}`);
  };

  const formatDateForInput = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0]; // Convertir a YYYY-MM-DD
  };

  const updateEvent = async (id, event) => {
    try {
      console.log("Datos del evento a actualizar:", event);
      console.log("ID del evento a actualizar:", id);
      const response = await axios.put(
        `https://back-ingsoft-nzbv.onrender.com/api/eventos/${id}`,
        event
      );
      setEvents((prevEvents) =>
        prevEvents.map((e) => (e._id === id ? response.data : e))
      );
      setShowEditarAviso(false);
      setShowSuccessModal("Evento actualizado exitosamente!");
    } catch (error) {
      console.error("Error creating event:", error);

      // Mostrar el mensaje de error del backend si está disponible
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setServerError(error.response.data.message);
      } else {
        setServerError(
          "Error al crear el evento. Por favor, verifica los datos ingresados."
        );
      }
    }
  };

  const createEvent = async (values) => {
    try {
      if (values.tipoEvento === "curso" && values.idCurso) {
        const selectedCourse = cursos.find(
          (curso) => curso._id === values.idCurso
        );
        if (selectedCourse) {
          values.nombre = `Evento Curso ${selectedCourse.nombre}`;
        }
      }

      console.log("Estos son los valores", values);
      const response = await axios.post(
        "https://back-ingsoft-nzbv.onrender.com/api/eventos",
        values
      );

      // Mostrar mensaje de éxito si el backend lo proporciona
      setServerError(""); // Limpiar el error en caso de éxito
      setShowSuccessModal(
        response.data.message || "Evento creado exitosamente!"
      );
      location.reload();
    } catch (error) {
      console.error("Error creating event:", error);

      // Mostrar el mensaje de error del backend si está disponible
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setServerError(error.response.data.message);
      } else {
        setServerError(
          "Error al crear el evento. Por favor, verifica los datos ingresados."
        );
      }
    }
  };

  const validateEventForm = (values) => {
    const errors = {};
    const today = new Date().toISOString().split("T")[0];

    if (!values.tipoEvento) {
      errors.tipoEvento = "Tipo de evento es requerido";
    }

    if (values.tipoEvento === "plantel") {
      if (!values.nombre) {
        errors.nombre = "Nombre es requerido";
      }
    }

    if (!values.fecha) {
      errors.fecha = "Fecha es requerida";
    } else if (new Date(values.fecha) < new Date(today)) {
      errors.fecha = "La fecha no puede ser anterior a hoy";
    }

    if (!values.hora) {
      errors.hora = "Hora es requerida";
    }

    if (!values.lugar) {
      errors.lugar = "Lugar es requerido";
    }

    if (values.tipoEvento === "curso") {
      if (!values.idCurso) {
        errors.idCurso = "Curso es requerido";
      }
    }
    console.log("Los errores del formulario son:", errors);
    return errors;
  };

  const validateEditEventForm = (values) => {
    const errors = {};
    const today = new Date().toISOString().split("T")[0];

    if (!values.fecha) {
      errors.fecha = "Fecha es requerida";
    } else if (new Date(values.fecha) < new Date(today)) {
      errors.fecha = "La fecha no puede ser anterior a hoy";
    }

    if (!values.hora) {
      errors.hora = "Hora es requerida";
    }

    if (!values.lugar) {
      errors.lugar = "Lugar es requerido";
    }

    console.log("Los errores del formulario son:", errors);
    return errors;
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
      <EventoCarouselPast
        title="Eventos Pasados"
        events={eventosPasados}
        deleteEvent={handleDeleteEvent}
        updateEvent={updatedEvent}
        viewEvent={viewEvent}
        reloadEvent={handleReloadEvent}
      />

      <EventoCarousel
        title="Eventos Próximos"
        events={eventosProximos}
        deleteEvent={handleDeleteEvent}
        updateEvent={updatedEvent}
        viewEvent={viewEvent}
        reloadEvent={handleReloadEvent}
      />
      <div className="flex justify-center mt-6">
        <button
          className="bg-yellow-900 py-4 px-6 rounded-lg hover:bg-yellow-500 items-center w-96"
          onClick={() => setShowCrearAviso(true)}
        >
          <div className="flex justify-center text-white">
            <PlusCircleIcon className="w-6 mr-2" />
            Ingresar Evento
          </div>
        </button>
      </div>
      {/* Aviso de Creacion Aviso*/}
      <Modal
        isOpen={showCrearAviso}
        onRequestClose={() => setShowCrearAviso(false)}
        contentLabel="Crear Evento"
        className="top-50 left-1/2"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div className="bg-yellow-800 rounded-lg flex flex-col justify-center items-center p-6 w-96">
          <h2 className="text-white text-center text-[25px] m-6">
            CREAR EVENTO
          </h2>
          <Formik
            initialValues={{
              tipoEvento: "", // nuevo campo
              nombre: "",
              fecha: "",
              hora: "",
              lugar: "",
              descripcion: "",
              idCurso: "", // nuevo campo para eventos de curso
            }}
            validate={validateEventForm}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
              console.log("Valores enviados al servidor:", values);
              await createEvent(values);
              resetForm();
              setSubmitting(false);
            }}
          >
            {({
              handleChange,
              handleSubmit,
              setFieldValue,
              values,
              errors,
              touched,
              isSubmitting,
            }) => (
              <Form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <select
                    name="tipoEvento"
                    className="m-2 h-12 rounded-lg bg-gray-700 text-white w-full pl-4"
                    onChange={(e) => {
                      handleChange(e);
                      console.log(
                        "Tipo de evento seleccionado:",
                        e.target.value
                      ); // Log del nuevo valor

                      setFieldValue("tipoEvento", e.target.value);
                      console.log(values.tipoEvento);
                    }}
                    value={values.tipoEvento}
                  >
                    <option value="" label="Selecciona el tipo de evento" />
                    <option value="plantel">
                      Evento para integrantes del plantel
                    </option>
                    <option value="curso">Evento de curso</option>
                  </select>
                  {errors.tipoEvento && touched.tipoEvento && (
                    <div className="text-red-500 text-center">
                      {errors.tipoEvento}
                    </div>
                  )}
                </div>

                {/* Campos específicos para eventos dirigidos al plantel */}
                {values.tipoEvento === "plantel" && (
                  <>
                    <div className="mb-4">
                      <input
                        type="text"
                        placeholder="Nombre"
                        name="nombre"
                        className="m-2 h-12 rounded-lg bg-gray-700 text-white w-full pl-4"
                        onChange={handleChange}
                      />
                      {errors.nombre && touched.nombre && (
                        <div className="text-red-500 text-center">
                          {errors.nombre}
                        </div>
                      )}
                    </div>
                    <div className="mb-4">
                      <input
                        type="date"
                        name="fecha"
                        min={today} // Añadido para restringir la selección de fechas
                        className="m-2 h-12 rounded-lg bg-gray-700 text-white w-full pl-4"
                        onChange={handleChange}
                      />
                      {errors.fecha && touched.fecha && (
                        <div className="text-red-500 text-center">
                          {errors.fecha}
                        </div>
                      )}
                    </div>
                    <div className="mb-4">
                      <input
                        type="time"
                        name="hora"
                        className="m-2 h-12 rounded-lg bg-gray-700 text-white w-full pl-4"
                        onChange={handleChange}
                      />
                      {errors.hora && touched.hora && (
                        <div className="text-red-500 text-center">
                          {errors.hora}
                        </div>
                      )}
                    </div>
                    <div className="mb-4">
                      <select
                        name="lugar"
                        className="m-2 h-12 rounded-lg bg-gray-700 text-white w-full pl-4"
                        onChange={handleChange}
                        value={values.lugar}
                      >
                        <option value="" label="Selecciona un lugar" />
                        {sectores.map((sector) => (
                          <option key={sector._id} value={sector.nombre}>
                            {sector.nombre}
                          </option>
                        ))}
                      </select>
                      {errors.lugar && touched.lugar && (
                        <div className="text-red-500 text-center">
                          {errors.lugar}
                        </div>
                      )}
                    </div>
                    <div className="mb-4">
                      <textarea
                        name="descripcion"
                        placeholder="Descripción"
                        className="m-2 h-24 rounded-lg bg-gray-700 text-white w-full pl-4"
                        onChange={handleChange}
                      />
                      {errors.descripcion && touched.descripcion && (
                        <div className="text-red-500 text-center">
                          {errors.descripcion}
                        </div>
                      )}
                    </div>
                  </>
                )}
                {/* Campos específicos para eventos de curso */}
                {values.tipoEvento === "curso" && (
                  <>
                    <div className="mb-4">
                      <select
                        name="idCurso"
                        className="m-2 h-12 rounded-lg bg-gray-700 text-white w-full pl-4"
                        onChange={(e) => {
                          setFieldValue("idCurso", e.target.value);
                          console.log(
                            "Nuevo valor de idCurso:",
                            e.target.value
                          );
                        }}
                        value={values.idCurso}
                      >
                        <option value="" label="Selecciona un curso" />
                        {cursos.map((curso) => (
                          <option key={curso._id} value={curso._id}>
                            {curso.nombre}
                          </option>
                        ))}
                      </select>
                      {errors.idCurso && touched.idCurso && (
                        <div className="text-red-500 text-center">
                          {errors.idCurso}
                        </div>
                      )}
                    </div>
                    <div className="mb-4">
                      <input
                        type="date"
                        name="fecha"
                        min={today}
                        className="m-2 h-12 rounded-lg bg-gray-700 text-white w-full pl-4"
                        onChange={handleChange}
                      />
                      {errors.fecha && touched.fecha && (
                        <div className="text-red-500 text-center">
                          {errors.fecha}
                        </div>
                      )}
                    </div>
                    <div className="mb-4">
                      <input
                        type="time"
                        name="hora"
                        className="m-2 h-12 rounded-lg bg-gray-700 text-white w-full pl-4"
                        onChange={handleChange}
                      />
                      {errors.hora && touched.hora && (
                        <div className="text-red-500 text-center">
                          {errors.hora}
                        </div>
                      )}
                    </div>
                    <div className="mb-4">
                      <select
                        name="lugar"
                        className="m-2 h-12 rounded-lg bg-gray-700 text-white w-full pl-4"
                        onChange={handleChange}
                        value={values.lugar}
                      >
                        <option value="" label="Selecciona un lugar" />
                        {sectores.map((sector) => (
                          <option key={sector._id} value={sector.nombre}>
                            {sector.nombre}
                          </option>
                        ))}
                      </select>
                      {errors.lugar && touched.lugar && (
                        <div className="text-red-500 text-center">
                          {errors.lugar}
                        </div>
                      )}
                    </div>
                  </>
                )}

                <div className="flex justify-between mt-6">
                  <button
                    type="button"
                    className="bg-red-600 text-white py-2 px-4 rounded-lg"
                    onClick={() => setShowCrearAviso(false)}
                  >
                    <IoClose className="inline-block w-5 h-5" />
                    Cerrar
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || values.tipoEvento === ""}
                    className={`bg-blue-600 text-white py-2 px-4 rounded-lg flex items-center ${
                      values.tipoEvento === ""
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    {isSubmitting ? "Guardando..." : "Guardar"}
                    {isSubmitting && (
                      <FaSpinner className="ml-2 animate-spin" />
                    )}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
          {serverError && (
            <div className="text-red-500 mt-4">{serverError}</div>
          )}
        </div>
      </Modal>

      {/* Aviso de Editar */}
      <Modal
        isOpen={showEditarAviso}
        onRequestClose={() => setShowEditarAviso(false)}
        contentLabel="Crear Evento"
        className="top-50 left-1/2"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div
          className="bg-yellow-800 rounded-lg flex flex-col justify-center items-center p-6"
          style={{ width: "496px" }}
        >
          <h2 className="text-white text-center text-[25px] m-6">
            EDITAR EVENTO
          </h2>
          <Formik
            initialValues={{
              nombre: eventToEdit ? eventToEdit.nombre_curso || "" : "",
              fecha: eventToEdit ? eventToEdit.fecha || "" : "",
              hora: eventToEdit ? eventToEdit.hora || "" : "",
              lugar: eventToEdit ? eventToEdit.sector || "" : "",
            }}
            validate={validateEditEventForm}
            onSubmit={async (values, { setSubmitting }) => {
              if (eventToEdit && eventToEdit._id) {
                await updateEvent(eventToEdit._id, values);
              }
              setSubmitting(false);
            }}
          >
            {({
              handleChange,
              handleSubmit,
              setFieldValue,
              values,
              errors,
              touched,
              isSubmitting,
            }) => (
              <Form onSubmit={handleSubmit}>
                <div style={{ width: "396px" }}>
                  <div className="mb-4">
                    <input
                      type="text"
                      placeholder="Nombre"
                      name="nombre"
                      className="m-2 h-12 rounded-lg bg-gray-700 text-white w-full pl-4"
                      onChange={handleChange}
                      value={values.nombre}
                      disabled
                    />
                    {errors.nombre && touched.nombre && (
                      <div className="text-red-500 text-center">
                        {errors.nombre}
                      </div>
                    )}
                  </div>
                  <div className="mb-4">
                    <input
                      type="date"
                      name="fecha"
                      min={today} // Añadido para restringir la selección de fechas
                      className="m-2 h-12 rounded-lg bg-gray-700 text-white w-full pl-4"
                      onChange={handleChange}
                      value={values.fecha}
                    />
                    {errors.fecha && touched.fecha && (
                      <div className="text-red-500 text-center">
                        {errors.fecha}
                      </div>
                    )}
                  </div>
                  <div className="mb-4">
                    <input
                      type="time"
                      name="hora"
                      className="m-2 h-12 rounded-lg bg-gray-700 text-white w-full pl-4"
                      onChange={handleChange}
                      value={values.hora}
                    />
                    {errors.hora && touched.hora && (
                      <div className="text-red-500 text-center">
                        {errors.hora}
                      </div>
                    )}
                  </div>
                  <div className="mb-4">
                    <select
                      name="lugar"
                      className="m-2 h-12 rounded-lg bg-gray-700 text-white w-full pl-4"
                      onChange={handleChange}
                      value={values.lugar}
                    >
                      <option value="" label="Selecciona un lugar" />
                      {sectores.map((sector) => (
                        <option key={sector._id} value={sector.nombre}>
                          {sector.nombre}
                        </option>
                      ))}
                    </select>
                    {errors.lugar && touched.lugar && (
                      <div className="text-red-500 text-center">
                        {errors.lugar}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex justify-between mt-6">
                  <button
                    type="button"
                    className="bg-red-600 text-white py-2 px-4 rounded-lg"
                    onClick={() => setShowEditarAviso(false)}
                  >
                    <IoClose className="inline-block w-5 h-5" />
                    Cerrar
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || values.tipoEvento === ""}
                    className={`bg-blue-600 text-white py-2 px-4 rounded-lg flex items-center ${
                      values.tipoEvento === ""
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    {isSubmitting ? "Guardando..." : "Guardar"}
                    {isSubmitting && (
                      <FaSpinner className="ml-2 animate-spin" />
                    )}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
          {serverError && (
            <div className="text-red-500 mt-4">{serverError}</div>
          )}
        </div>
      </Modal>

      {/* Aviso de Eliminacion*/}
      <Modal
        isOpen={showEliminarAviso}
        onRequestClose={() => setShowEliminarAviso(false)}
        contentLabel="Eliminar Sector"
        className="absolute  top-1/4 left-1/2"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div
          className="absolute bg-blue-900 z-50 rounded-lg flex flex-col justify-center items-center p-6 w-96"
          style={{ marginLeft: "-90px", marginTop: "70px" }}
        >
          {" "}
          <div className="mb-8 text-white text-center poppins text-[25px] m-6">
            <h2 className="mb-8 text-white text-center poppins text-[25px] m-6">
              ¿Estás seguro que deseas cancelar este evento?
            </h2>
          </div>
          <div className="flex justify-center space-x-4">
            <button
              className="bg-green-600 py-2 px-4 rounded-lg hover:bg-green-900 text-white flex items-center"
              onClick={() => {
                deleteEvent(eventIdToDelete);
              }}
            >
              <FaCheck className="w-6 mr-2" />
              Si, Cancelar
            </button>
            <button
              className="bg-red-600 py-2 px-4 rounded-lg hover:bg-red-900 text-white flex items-center"
              onClick={() => setShowEliminarAviso(false)}
            >
              <IoClose className="w-6 mr-2" />
              Cancelar
            </button>
          </div>
        </div>
      </Modal>
      {/* Aviso de Eliminacion*/}
      <Modal
        isOpen={showReloadAviso}
        onRequestClose={() => setShowReloadAviso(false)}
        contentLabel="Eliminar Sector"
        className="absolute  top-1/4 left-1/2"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div
          className="absolute bg-blue-900 z-50 rounded-lg flex flex-col justify-center items-center p-6 w-96"
          style={{ marginLeft: "-90px", marginTop: "70px" }}
        >
          {" "}
          <div className="mb-8 text-white text-center poppins text-[25px] m-6">
            <h2 className="mb-8 text-white text-center poppins text-[25px] m-6">
              ¿Estás seguro que deseas habilitar de nuevo este evento?
            </h2>
          </div>
          <div className="flex justify-center space-x-4">
            <button
              className="bg-green-600 py-2 px-4 rounded-lg hover:bg-green-900 text-white flex items-center"
              onClick={() => {
                deleteEvent(eventIdToDelete);
              }}
            >
              <FaCheck className="w-6 mr-2" />
              Si, Habilitar
            </button>
            <button
              className="bg-red-600 py-2 px-4 rounded-lg hover:bg-red-900 text-white flex items-center"
              onClick={() => setShowReloadAviso(false)}
            >
              <IoClose className="w-6 mr-2" />
              Cancelar
            </button>
          </div>
        </div>
      </Modal>

      {/* Mensaje de éxito del modal */}
      {showSuccessModal && (
        <Modal
          isOpen={showSuccessModal}
          onRequestClose={() => setShowSuccessModal(false)}
          contentLabel="Éxito"
          className="top-50 left-1/2"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <div className="bg-green-800 rounded-lg flex flex-col justify-center items-center p-6 w-96">
            <h2 className="text-white text-center text-[25px] m-6">
              {showSuccessModal}
            </h2>
            <button
              className="bg-yellow-600 h-12 w-24 rounded-lg flex items-center justify-center text-white"
              onClick={() => setShowSuccessModal(false)}
            >
              Cerrar
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Events;
