import React, { useState } from "react";
import { FaEye, FaTrash, FaPlus } from "react-icons/fa";
import { useCursos } from "../../../context/CursoContext.jsx";
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
import { IoReloadCircle } from "react-icons/io5";
import { set } from "mongoose";
import { useNavigate } from "react-router-dom";

Modal.setAppElement("#root"); // Necesario para accesibilidad
const Courses = () => {
  const [showAviso, setShowAviso] = useState(false);
  const [showDiv, setShowDiv] = useState(false);
  const [showDivReload, setShowDivReload] = useState(false);
  const [cursosE, setCursos] = useState([]);
  const { getCursos, deleteCurso, createCurso } = useCursos();
  const [showCrearAviso, setShowCrearAviso] = useState(false);
  const [showEditarAviso, setShowEditarAviso] = useState(false);
  const [cursoToDelete, setCursoToDelete] = useState(null);
  const [cursoReload, setCursoReload] = useState(null);
  const [docenteValue, setDocenteValue] = useState("");
  const [cursoEditado, setCursoEditado] = useState(null);
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();
  const handleDeleteCurso = async (cursoId) => {
    try {
      await axios.delete(`https://back-ingsoft-nzbv.onrender.com/api/cursos/${cursoId}`);
      location.reload();
    } catch (error) {
      if (error.response && error.response.status === 400) {
        // Si la respuesta del backend es un error debido a los cursos activos o eventos no pasados
        alert(error.response.data.message); // Muestra el mensaje de error al usuario
        location.reload();
      } else {
        alert(
          "Hubo un problema al intentar desactivar el curso. Intenta más tarde."
        );
      }
    }
  };
  const creatCurso = async (cursoData) => {
    try {
      const response = await axios.post(
        "https://back-ingsoft-nzbv.onrender.com/api/cursos",
        cursoData
      );
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Error al crear el curso. Por favor, intenta de nuevo.");
    }
  };
  const updateCurso = async (id, curso) => {
    try {
      console.log("Datos del curso a actualizar:", curso);
      console.log("ID del curso a actualizar:", id);
      const response = await axios.put(
        `https://back-ingsoft-nzbv.onrender.com/api/cursos/${id}`,
        curso
      );
      location.reload();
    } catch (error) {
      console.error("Error al actualizar el curso:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setServerError(error.response.data.message);
      } else {
        setServerError(
          "Error al crear el curso. Por favor, verifica los datos ingresados."
        );
      }
    }
  };
  const handleClick = () => {
    navigate("/administrador/cursos");
  };
  const [docenteSeleccionado, setDocenteSeleccionado] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://back-ingsoft-nzbv.onrender.com/api/cursos");
        const responseD = await axios.get("https://back-ingsoft-nzbv.onrender.com/api/docentes");
        const docentesData = responseD.data.map((item) => ({
          _id: item._id,
          nombre: item.nombre,
          apellido: item.apellido,
        }));
        setDocenteSeleccionado(docentesData);
        const cursos = await Promise.all(
          (response.data = await Promise.all(
            response.data.map(async (item) => {
              const date = new Date(item.createdAt);
              const formattedDate = date.toISOString().split("T")[0]; // Obtener solo la fecha en formato YYYY-MM-DD
              return {
                ...item,
                _id: item._id,
                nombre: item.nombre,
                fecha: formattedDate, // Guardar la fecha formateada
              };
            })
          ))
        );
        setCursos(cursos);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);
  const validationSchema = Yup.object().shape({
    nombre: Yup.string()
      .max(50, "El nombre no puede tener más de 50 caracteres")
      .matches(/^[A-Za-z ]+$/, "Solo letras permitidas")
      .required("El nombre es requerido"),
    descripcion: Yup.string()
      .max(150, "La descripción no puede tener más de 150 caracteres")
      .required("La descripción es requerida"),
    docente1: Yup.string()
      .required("Debe seleccionar un primer docente")
      .notOneOf([""], "Debe seleccionar un primer docente"),
    docente2: Yup.string()
      .required("Debe seleccionar un segundo docente")
      .notOneOf([""], "Debe seleccionar un segundo docente"),
  });
  const handleDocenteChange = (setFieldValue, selectedDocente, isFirst) => {
    setFieldValue(isFirst ? "docente1" : "docente2", selectedDocente);
  };
  const CursoCard = ({ curso }) => {
    const docentes = docenteSeleccionado.filter((docente) =>
      curso.docentes.includes(docente._id)
    );
    console.log("Docentes del curso actual:", docentes);

    return (
      <div className="border border-blue-500 rounded-lg p-4 flex flex-col justify-between transition-all duration-300 ease-in-out hover:border-red-500 hover:shadow-lg">
        <div className="flex justify-end space-x-2">
          <button
            className="text-green-500 mr-4"
            onClick={() => {
              navigate(`/administrador/cursos/${curso._id}`);
            }}
          >
            <FaEye style={{ fontSize: "24px" }} />
          </button>
          <button
            className="text-yellow-500"
            style={{ marginLeft: "-5px" }}
            onClick={() => {
              setCursoEditado(curso); // Cargar datos del curso en estado para editar
              setShowEditarAviso(true); // Mostrar modal de edición
            }}
          >
            <VscEdit style={{ fontSize: "24px" }} />
          </button>
          {curso.estado === "INACTIVO" ? (
            <button
              className="text-blue-500"
              onClick={() => {
                setCursoToDelete(curso._id); // Almacenar ID del curso a reactivar
                setShowDivReload(true); // Mostrar modal de confirmación
              }}
            >
              <IoReloadCircle style={{ fontSize: "25px" }} />
            </button>
          ) : (
            <button
              className="text-red-500"
              onClick={() => {
                setCursoToDelete(curso._id); // Almacenar ID del curso a eliminar
                setShowDiv(true); // Mostrar modal de confirmación
              }}
            >
              <FaTrash style={{ fontSize: "22px" }} />
            </button>
          )}
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
    <div className="container mx-auto p-16 m-5">
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
      <div className="flex justify-center mt-6">
        <button
          className="bg-yellow-900 py-4 px-6 rounded-lg hover:bg-yellow-500 poppins items-center w-96"
          onClick={() => {
            setShowCrearAviso(true); // Mostrar modal de creacion
          }}
        >
          <div className="flex justify-center text-white carrois-gothicSC text-xl">
            <FaPlus className="w-6 mr-2" /> Crear Curso
          </div>
        </button>
      </div>
      <Modal
        isOpen={showDiv}
        onRequestClose={() => setShowDiv(false)}
        contentLabel="Eliminar Estudiante"
        className="absolute  top-1/4 left-1/2"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div
          className="absolute bg-blue-900  z-50  rounded-lg flex flex-col justify-center items-center p-6 w-96"
          style={{ marginLeft: "-90px", marginTop: "70px" }}
        >
          <div className="mb-8 text-white text-center poppins text-[25px] m-6">
            <h2 className="mb-8 text-white text-center poppins text-[25px] m-6">
              ¿Seguro de inhabilitar el curso?
            </h2>
          </div>
          <div className="flex justify-center space-x-4">
            <button
              className="bg-green-600 py-2 px-4 rounded-lg hover:bg-green-900 text-white flex items-center"
              onClick={() => {
                // Lógica para eliminar el curso
                handleDeleteCurso(cursoToDelete);
                setShowDiv(false);
              }}
            >
              <FaCheck className="w-6 mr-2" />
              Si, Inhabilitar
            </button>
            <button
              className="bg-red-600 py-2 px-4 rounded-lg hover:bg-red-900 text-white flex items-center"
              onClick={() => setShowDiv(false)}
            >
              <IoClose className="w-6 mr-2" />
              Cancelar
            </button>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={showDivReload}
        onRequestClose={() => setShowDivReload(false)}
        contentLabel="Eliminar Estudiante"
        className="absolute  top-1/4 left-1/2"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div
          className="absolute bg-blue-900  z-50  rounded-lg flex flex-col justify-center items-center p-6 w-96"
          style={{ marginLeft: "-90px", marginTop: "70px" }}
        >
          <div className="mb-8 text-white text-center poppins text-[25px] m-6">
            <h2 className="mb-8 text-white text-center poppins text-[25px] m-6">
              ¿Seguro de habilitar el curso?
            </h2>
          </div>
          <div className="flex justify-center space-x-4">
            <button
              className="bg-green-600 py-2 px-4 rounded-lg hover:bg-green-900 text-white flex items-center"
              onClick={() => {
                // Lógica para eliminar el curso
                handleDeleteCurso(cursoToDelete);
                setShowDivReload(false);
              }}
            >
              <FaCheck className="w-6 mr-2" />
              Si, Habilitar
            </button>
            <button
              className="bg-red-600 py-2 px-4 rounded-lg hover:bg-red-900 text-white flex items-center"
              onClick={() => setShowDiv(false)}
            >
              <IoClose className="w-6 mr-2" />
              Cancelar
            </button>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={showCrearAviso}
        onRequestClose={() => setShowCrearAviso(false)}
        contentLabel="Crear Sector"
        className="  top-50 left-1/2"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div
          className="z-50  rounded-lg flex flex-col justify-center items-center p-6 w-96"
          style={{
            backgroundColor: "#8c6428", // Color sin opacidad
            width: "600px",
            marginTop: "20px",
          }}
        >
          <div className=" text-white text-center poppins text-[25px] ">
            <h2 className=" text-white text-center poppins text-[25px] m-6">
              INGRESAR CURSO
            </h2>
          </div>

          <Formik
            initialValues={{
              nombre: "",
              docente1: "",
              docente2: "",
              descripcion: "",
            }}
            enableReinitialize={true}
            validationSchema={validationSchema}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
              try {
                const cursoData = {
                  nombre:
                    values.nombre.charAt(0).toUpperCase() +
                    values.nombre.slice(1),
                  descripcion: values.descripcion,
                  docente1: values.docente1,
                  docente2: values.docente2 || null, // Opción para segundo docente
                };
                console.log("Datos del curso a crear:", cursoData);
                const response = await creatCurso(cursoData);
                setServerError(""); // Limpiar el error en caso de éxito
                setShowAviso(true);
                resetForm();
                setShowCrearAviso(false); // Actualizar la página después de crear
              } catch (error) {
                console.error("Error al crear el curso:", error);
                setServerError(
                  error.message ||
                    "Error al crear el curso. Por favor, verifica los datos ingresados."
                );
              }
              setSubmitting(false);
            }}
          >
            {({
              handleChange,
              handleSubmit,
              errors,
              setFieldValue,
              touched,
              isSubmitting,
              values,
            }) => (
              <Form onSubmit={handleSubmit}>
                <div className="justify-center m-2" style={{ width: "500px" }}>
                  <div
                    className={`flex m-4 items-center ${
                      errors.nombre ? "mb-0" : "mb-4"
                    }`}
                  >
                    <FaSignature
                      className="text-white "
                      style={{ fontSize: "1.5rem" }}
                    />
                    <input
                      type="text"
                      placeholder="Nombre"
                      className="m-2 ml-3 h-12 rounded-lg bg-gray-700 text-white w-full pl-4"
                      name="nombre"
                      onChange={handleChange}
                    />
                  </div>
                  {errors.nombre && touched.nombre && (
                    <div className="text-red-500 justify-center text-center">
                      {errors.nombre}
                    </div>
                  )}
                  <div
                    className={`flex m-4 items-center ${
                      errors.docente1 ? "mb-0" : "mb-4"
                    }`}
                  >
                    <FaUser
                      className="text-white "
                      style={{ fontSize: "1.5rem" }}
                    />
                    <select
                      name="docente1"
                      onChange={(e) =>
                        handleDocenteChange(setFieldValue, e.target.value, true)
                      }
                      className="m-2 ml-3 h-12 rounded-lg bg-gray-700 text-white w-full pl-4"
                    >
                      <option value="">Seleccionar docente 1</option>
                      {docenteSeleccionado.map((docente) => (
                        <option key={docente._id} value={docente._id}>
                          {docente.nombre} {docente.apellido}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.docente1 && touched.docente1 && (
                    <div className="text-red-500 justify-center text-center">
                      {errors.docente1}
                    </div>
                  )}
                  <div
                    className={`flex m-4 items-center ${
                      errors.docente2 ? "mb-0" : "mb-4"
                    }`}
                  >
                    <FaUser
                      className="text-white"
                      style={{ fontSize: "1.5rem" }}
                    />
                    <select
                      name="docente2"
                      onChange={(e) =>
                        handleDocenteChange(
                          setFieldValue,
                          e.target.value,
                          false
                        )
                      }
                      className="m-2 ml-3 h-12 rounded-lg bg-gray-700 text-white w-full pl-4"
                      disabled={!values.docente1} // Deshabilitar hasta que se seleccione docente1
                    >
                      <option value="">Seleccionar docente 2</option>
                      {docenteSeleccionado
                        .filter((docente) => docente._id !== values.docente1) // Filtrar para excluir el docente1
                        .map((docente) => (
                          <option key={docente._id} value={docente._id}>
                            {docente.nombre} {docente.apellido}
                          </option>
                        ))}
                    </select>
                  </div>
                  {errors.docente2 && touched.docente2 && (
                    <div className="text-red-500 justify-center text-center">
                      {errors.docente2}
                    </div>
                  )}
                  <div
                    className={`flex m-4 items-center ${
                      errors.descripcion ? "mb-0" : "mb-4"
                    }`}
                  >
                    <FaSignature
                      className="text-white "
                      style={{ fontSize: "1.5rem" }}
                    />
                    <textarea
                      placeholder="Descripción"
                      className="m-2 ml-3 h-32 rounded-lg bg-gray-700 text-white w-full pl-4 pt-2"
                      name="descripcion"
                      onChange={handleChange}
                      rows="5" // Puedes ajustar este valor según el tamaño que desees
                    />
                  </div>
                  {errors.descripcion && touched.descripcion && (
                    <div className="text-red-500 justify-center text-center">
                      {errors.descripcion}
                    </div>
                  )}
                  <div className="flex justify-center space-x-4 m-5 ">
                    <button
                      type="submit"
                      className="bg-blue-900 py-2 px-4 rounded-lg hover:bg-blue-700 text-white flex items-center"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        "Cargando..."
                      ) : (
                        <div className="flex items-center">
                          <MdSaveAlt className="w-6 mr-2" />
                          <span className="">Guardar</span>
                        </div>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCrearAviso(false)}
                      className="bg-red-700 py-2 px-4 rounded-lg hover:bg-red-600 text-white flex items-center"
                    >
                      <IoClose className="w-6 mr-2" />
                      <span className="">Cancelar</span>
                    </button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
          {serverError && (
            <div className="text-red-500 mt-4">{serverError}</div>
          )}
        </div>
      </Modal>
      <Modal
        isOpen={showAviso}
        onRequestClose={() => setShowAviso(false)}
        contentLabel="Notificacion Aviso  Estudiante"
        className="absolute  top-1/4 left-1/2"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div
          className="absolute bg-blue-900  z-50  rounded-lg flex flex-col justify-center items-center p-6 w-96"
          style={{ marginLeft: "-90px", marginTop: "70px" }}
        >
          <div className="mb-8 text-white text-center poppins text-[25px] m-6">
            <h2 className="mb-8 text-white text-center poppins text-[25px] m-6">
              Curso creado con éxito.
            </h2>
          </div>
          <div className="flex justify-center space-x-4">
            <button
              className="bg-green-600 py-2 px-4 rounded-lg hover:bg-green-900 text-white flex items-center"
              onClick={() => {
                setShowCrearAviso(false);
                location.reload();
              }}
            >
              <FaCheck className="w-6 mr-2" />
              Aceptar
            </button>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={showEditarAviso}
        onRequestClose={() => setShowEditarAviso(false)}
        contentLabel="Crear Sector"
        className="top-50 left-1/2"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div
          className="z-50  rounded-lg flex flex-col justify-center items-center p-6 w-96"
          style={{
            backgroundColor: "#8c6428", // Color sin opacidad
            width: "600px",
            marginTop: "20px",
          }}
        >
          <div className=" text-white text-center poppins text-[25px] ">
            <h2 className=" text-white text-center poppins text-[25px] m-6">
              EDITAR CURSO
            </h2>
          </div>

          <Formik
            initialValues={{
              nombre: cursoEditado ? cursoEditado.nombre || "" : "",
              descripcion: cursoEditado ? cursoEditado.descripcion || "" : "",
              docente1: cursoEditado ? cursoEditado.docentes[0] || "" : "",
              docente2: cursoEditado ? cursoEditado.docentes[1] || "" : "",
            }}
            validationSchema={validationSchema}
            onSubmit={async (values) => {
              await updateCurso(cursoEditado._id, values);
            }}
          >
            {({
              handleChange,
              handleSubmit,
              errors,
              setFieldValue,
              touched,
              isSubmitting,
              values,
            }) => (
              <Form onSubmit={handleSubmit}>
                <div className="justify-center m-2" style={{ width: "500px" }}>
                  <div
                    className={`flex m-4 items-center ${
                      errors.nombre ? "mb-0" : "mb-4"
                    }`}
                  >
                    <FaSignature
                      className="text-white "
                      style={{ fontSize: "1.5rem" }}
                    />
                    <input
                      type="text"
                      placeholder="Nombre"
                      className="m-2 ml-3 h-12 rounded-lg bg-gray-700 text-white w-full pl-4"
                      name="nombre"
                      onChange={handleChange}
                      value={values.nombre}
                      disabled
                    />
                  </div>
                  {errors.nombre && touched.nombre && (
                    <div className="text-red-500 justify-center text-center">
                      {errors.nombre}
                    </div>
                  )}
                  <div
                    className={`flex m-4 items-center ${
                      errors.docente1 ? "mb-0" : "mb-4"
                    }`}
                  >
                    <FaUser
                      className="text-white "
                      style={{ fontSize: "1.5rem" }}
                    />
                    <select
                      name="docente1"
                      value={values.docente1}
                      onChange={(e) =>
                        handleDocenteChange(setFieldValue, e.target.value, true)
                      }
                      className="m-2 ml-3 h-12 rounded-lg bg-gray-700 text-white w-full pl-4"
                    >
                      <option value="">Seleccionar docente 1</option>
                      {docenteSeleccionado.map((docente) => (
                        <option key={docente._id} value={docente._id}>
                          {docente.nombre} {docente.apellido}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.docente1 && touched.docente1 && (
                    <div className="text-red-500 justify-center text-center">
                      {errors.docente1}
                    </div>
                  )}
                  <div
                    className={`flex m-4 items-center ${
                      errors.docente2 ? "mb-0" : "mb-4"
                    }`}
                  >
                    <FaUser
                      className="text-white"
                      style={{ fontSize: "1.5rem" }}
                    />
                    <select
                      name="docente2"
                      value={values.docente2}
                      onChange={(e) =>
                        handleDocenteChange(
                          setFieldValue,
                          e.target.value,
                          false
                        )
                      }
                      className="m-2 ml-3 h-12 rounded-lg bg-gray-700 text-white w-full pl-4"
                      disabled={!values.docente1} // Deshabilitar hasta que se seleccione docente1
                    >
                      <option value="">Seleccionar docente 2</option>
                      {docenteSeleccionado
                        .filter((docente) => docente._id !== values.docente1) // Filtrar para excluir el docente1
                        .map((docente) => (
                          <option key={docente._id} value={docente._id}>
                            {docente.nombre} {docente.apellido}
                          </option>
                        ))}
                    </select>
                  </div>
                  {errors.docente2 && touched.docente2 && (
                    <div className="text-red-500 justify-center text-center">
                      {errors.docente2}
                    </div>
                  )}
                  <div
                    className={`flex m-4 items-center ${
                      errors.descripcion ? "mb-0" : "mb-4"
                    }`}
                  >
                    <FaSignature
                      className="text-white "
                      style={{ fontSize: "1.5rem" }}
                    />
                    <textarea
                      value={values.descripcion}
                      placeholder="Descripción"
                      className="m-2 ml-3 h-32 rounded-lg bg-gray-700 text-white w-full pl-4 pt-2"
                      name="descripcion"
                      onChange={handleChange}
                      rows="5" // Puedes ajustar este valor según el tamaño que desees
                    />
                  </div>
                  {errors.descripcion && touched.descripcion && (
                    <div className="text-red-500 justify-center text-center">
                      {errors.descripcion}
                    </div>
                  )}
                  <div className="flex justify-center space-x-4 m-5 ">
                    <button
                      type="submit"
                      className="bg-blue-900 py-2 px-4 rounded-lg hover:bg-blue-700 text-white flex items-center"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        "Cargando..."
                      ) : (
                        <div className="flex items-center">
                          <MdSaveAlt className="w-6 mr-2" />
                          <span className="">Guardar</span>
                        </div>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowEditarAviso(false)}
                      className="bg-red-700 py-2 px-4 rounded-lg hover:bg-red-600 text-white flex items-center"
                    >
                      <IoClose className="w-6 mr-2" />
                      <span className="">Cancelar</span>
                    </button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </Modal>
    </div>
  );
};
export default Courses;
