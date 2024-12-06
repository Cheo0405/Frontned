import React, { useState, useEffect } from "react";
import Versiculos from "./Versiculos.json";
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";
import { VscEdit, VscTrash } from "react-icons/vsc";
import Modal from "react-modal";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { IoClose } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { MdSaveAlt } from "react-icons/md";
import { FaRegIdCard, FaPhoneAlt } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";
import { FaFileImage } from "react-icons/fa6";
import { FaCheck } from "react-icons/fa";
import { MdOutlineGroups2 } from "react-icons/md";
import axios from "axios";

Modal.setAppElement("#root");

function IndexAdmin() {
  const [versiculo, setVersiculo] = useState(null);
  const [administrador, setAdministrador] = useState(null);
  const [showEditarAviso, setShowEditarAviso] = useState(false);
  const [imagen, setImagen] = useState(null);
  const [imagenURL, setImagenURL] = useState(null);
  const [serverError, setServerError] = useState("");
  const [showAviso, setShowAviso] = useState(false);

  const correoRegistrado = async (correo, identificacionActual) => {
    try {
      // Hacer la solicitud para obtener todos los docentes
      const response = await axios.get("https://back-ingsoft-nzbv.onrender.com/api/usuarios");
      const usuarios = response.data;

      console.log("estos son los usuarios: ", usuarios);

      // Buscar si hay algún usuario con el correo especificado
      const usuarioEncontrado = usuarios.find(
        (usuario) => String(usuario.correo) === String(correo)
      );

      if (usuarioEncontrado) {
        return usuarioEncontrado.identificacion !== administrador.identificacion;
      }

      return false; // El correo no está registrado
    } catch (error) {
      console.error("Error al verificar el correo:", error);
      return false;
    }
  };

  const telefonoRegistrado = async (telefono) => {
    try {
      const response = await axios.get("https://back-ingsoft-nzbv.onrender.com/api/usuarios");
      const usuarios = response.data;
      const usuarioEncontrado = usuarios.find(
        (usuario) => String(usuario.telefono) === String(telefono)
      );
      if (usuarioEncontrado) {
        return usuarioEncontrado.identificacion !== administrador.identificacion;
      }

      return false;
    } catch (error) {
      console.error("Error al verificar el teléfono:", error);
      return false;
    }
  };

  const validationSchema = Yup.object().shape({
    nombre: Yup.string()
      .max(50, "El nombre no puede tener más de 50 caracteres")
      .matches(/^[A-Za-z ]+$/, "Solo letras permitidas")
      .required("El nombre es requerido"),
    apellido: Yup.string()
      .max(50, "El apellido no puede tener más de 50 caracteres")
      .matches(/^[A-Za-z ]+$/, "Solo letras permitidas")
      .required("El apellido es requerido"),
    telefono: Yup.string()
      .matches(/^\+?[0-9]{10}$/, "El teléfono debe tener 10 dígitos numéricos")
      .required("El teléfono es requerido")
      .test(
        "check-duplicado",
        "Teléfono ya registrado en el sistema",
        async (telefono) => {
          const duplicado = await telefonoRegistrado(telefono);
          return !duplicado;
        }
      ),
    correo: Yup.string()
      .max(125, "El correo no puede tener más de 125 caracteres")
      .email("Formato de correo electrónico inválido")
      .required("El Correo es requerido")
      .test(
        "check-duplicado",
        "El Correo ya está registrado en el sistema",
        async (correo) => {
          const duplicado = await correoRegistrado(correo);
          return !duplicado;
        }
      ),
    image: Yup.mixed().required("Debe seleccionar una imagen"),
  });

  const updateMe = async (id, me) => {
    console.log(id);
    try {
      const response = await axios.put(
        `https://back-ingsoft-nzbv.onrender.com/api/update-me/${id}`,
        me
      );

      // Actualizar el estado local con los nuevos datos
      setAdministrador(response.data);

      // Guardar los nuevos datos en localStorage
      localStorage.setItem("user", JSON.stringify(response.data));

      setShowEditarAviso(false);
      // Recargar la página si es necesario (aunque esto no siempre es ideal)
    } catch (error) {
      console.error("Error al actualizar el administrador:", error);

      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setServerError(error.response.data.message);
      } else {
        setServerError(
          "Error al actualizar el administrador. Por favor, verifica los datos ingresados."
        );
      }
    }
  };

  useEffect(() => {
    const selectNewVersiculo = () => {
      const today = new Date().toISOString().slice(0, 10); // Toma la fecha actual (YYYY-MM-DD)
      const index =
        today.charCodeAt(today.length - 1) % Versiculos.versiculosDelDia.length; // (último dígito del día de hoy -1) % cantidad de versiculos en el archivo json

      setVersiculo(Versiculos.versiculosDelDia[index]); // Selecciona un versiculo
    };

    selectNewVersiculo();

    // Cada 24h se cambia el versiculo
    const timerId = setInterval(() => {
      selectNewVersiculo();
    }, 24 * 60 * 60 * 1000);

    const data = JSON.parse(localStorage.getItem("user")) || {};
    setAdministrador(data);

    // Reset al temporizador
    return () => clearInterval(timerId);
  }, []);

  // Este useEffect se ejecutará cada vez que 'administrador' cambie
  useEffect(() => {
    if (administrador) {
      console.log(administrador);
    }
  }, [administrador]);

  if (!versiculo) {
    return <div>Cargando...</div>;
  }

  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagen(file);
      setImagenURL(URL.createObjectURL(file));
    } else {
      setImagen(null);
      setImagenURL(null);
    }
  };

  const handleClickImagen = () => {
    document.getElementById("imagen").click();
  };

  return (
    <div
      style={{ marginTop: "4.5rem" }}
      className="flex flex-col max-h-screen gap-3 md:flex-row"
    >
      {/*Bienvenida*/}
      <div className="flex flex-col gap-4 px-5 mt-4 md:mt-0 md:w-100 md:px-10">
        <p className="py-3 text-xl md:text-2xl font-semibold">¡Hola!</p>
        <strong className="px-10 py-0 text-4xl md:text-5xl">
          Administrador
        </strong>

        <div className="flex flex-col gap-5 px-10 py-10">
          <Link
            className="flex gap-3 justify-start rounded-lg bg-custom-brown1 px-5 py-3 text-base font-light text-white transition-colors hover:bg-custom-brown2"
            to="/administrador/estudiantes" //ruta a la que lleva
          >
            <PlusCircleIcon className="w-6" />{" "}
            <span>VISUALIZAR ESTUDIANTES</span>
          </Link>

          <Link
            className="flex gap-3 justify-start rounded-lg bg-custom-brown1 px-5 py-3 text-base font-light text-white transition-colors hover:bg-custom-brown2"
            to="/administrador/docentes/register"
          >
            <PlusCircleIcon className="w-6" />
            <span>INGRESAR DOCENTE</span>
          </Link>

          <Link
            className="flex gap-3 justify-start rounded-lg bg-custom-brown1 px-5 py-3 text-base font-light text-white transition-colors hover:bg-custom-brown2"
            to="/administrador/eventos/horario" //ruta a la que lleva
          >
            <PlusCircleIcon className="w-6" />
            <span>VISUALIZAR HORARIO SEMANAL</span>
          </Link>
        </div>
      </div>

      {/*Versiculo de bienvenida*/}
      <div className="flex flex-col gap-3 ml-3 mr-3 mt-5 py-8 md:mt-0 md:ml-0 md:mr-5">
        <p className="text-custom-brown2 text-xl text-center">
          VERSICULO DEL DIA
        </p>
        <p className="text-white text-2xl font-medium text-center bg-custom-brown2 rounded-lg ml-5 mr-5 mt-5 px-5 py-10 md:ml-5 md:mr-5 md:py-10 md:px-5">
          <strong>{versiculo.texto}</strong>
          <p className="mt-5 text-base md:mt-5 md:text-2xl">{versiculo.cita}</p>
        </p>
      </div>

      {/* Datos del administrador */}
      <div
        className="p-5 rounded-lg mt-5 md:mt-0 transition-transform duration-300 ease-in-out transform hover:-translate-y-2 hover:shadow-lg hover:border-red-500"
        style={{
          border: "2px solid blue",
          height: "460px",
          marginLeft: "25px",
        }}
      >
        <h2 className="text-xl font-bold text-center">Datos del Usuario: </h2>
        <br />
        {administrador ? (
          <div>
            <p style={{ marginBottom: "10px" }}>
              <strong>Nombre:</strong> <br /> {administrador.nombre}
            </p>
            <p style={{ marginBottom: "10px" }}>
              <strong>Apellido:</strong> <br /> {administrador.apellido}
            </p>
            <p style={{ marginBottom: "10px" }}>
              <strong>Identificación:</strong> <br />{" "}
              {administrador.identificacion}
            </p>
            <p style={{ marginBottom: "10px" }}>
              <strong>Correo:</strong> <br /> {administrador.correo}
            </p>
            <p style={{ marginBottom: "10px" }}>
              <strong>Telefono:</strong> <br /> {administrador.telefono}
            </p>
            <div
              className="flex items-center bg-green-600 hover:bg-green-700 text-white text-sm py-2 px-3 rounded mr-5 cursor-pointer"
              style={{ width: "130px", marginTop: "30px", marginLeft: "40px" }}
              onClick={() => {
                setShowEditarAviso(true);
              }}
            >
              Actualizar
              <VscEdit
                size="30px"
                className="w-5 md:w-6"
                style={{ marginLeft: "10px" }}
              />
            </div>
          </div>
        ) : (
          <p>No se encontraron datos del administrador.</p>
        )}
      </div>

      <Modal
        isOpen={showEditarAviso}
        onRequestClose={() => setShowAviso(false)}
        contentLabel="Notificacion Aviso  Estudiante"
        className="absolute  top-1/4 left-1/2"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div className="" style={{ width: "496px" }}>
          <br />
          <Formik
            initialValues={{
              tipoIdentificacion: administrador?.tipoIdentificacion || "",
              identificacion: administrador?.identificacion || "",
              nombre: administrador?.nombre || "",
              apellido: administrador?.apellido || "",
              telefono: administrador?.telefono || "",
              correo: administrador?.correo || "",
              image: administrador?.image || "",
              genero: administrador?.genero || "",
            }}
            enableReinitialize={true}
            validationSchema={validationSchema}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
              try {
                console.log(administrador);
                await updateMe(administrador.identificacion, values);
                setShowAviso(true);
                setImagen(null);
                resetForm();
              } catch (error) {
                if (error.response && error.response.data) {
                  console.error(
                    "Error al editar el estudiante:",
                    error.response.data.message
                  );
                } else {
                  console.error("Error al editar el estudiante:", error);
                }
              }
              setSubmitting(false);
            }}
          >
            {({
              handleChange,
              handleSubmit,
              setFieldValue,
              errors,
              touched,
              isSubmitting,
              values,
            }) => (
              <Form onSubmit={handleSubmit}>
                <div
                  className="p-6 rounded-md flex justify-center"
                  style={{
                    backgroundColor: "#8c6428",
                    width: "1000px",
                    marginLeft: "-400px",
                    marginTop: "-60px",
                  }}
                >
                  <div className="justify-center m-6">
                    <div
                      className={`flex m-4 items-center ${
                        errors.identificacion ? "mb-0" : "mb-4"
                      }`}
                    >
                      <FaRegIdCard
                        className="text-white mr-2"
                        style={{ fontSize: "2rem" }}
                      />
                      <div className="flex">
                        <select
                          name="tipoIdentificacion"
                          className="bg-gray-700 text-white h-12 rounded-lg w-32 pl-4 pr-2"
                          onChange={(e) => {
                            setFieldValue("tipoIdentificacion", e.target.value);
                          }}
                          value={values.tipoIdentificacion}
                        >
                          <option value="CC">CC</option>
                          <option value="TI">TI</option>
                        </select>
                        <input
                          type="text"
                          placeholder="Documento"
                          className="ml-2 bg-gray-700 text-white h-12 rounded-lg w-64 pl-4"
                          name="identificacion"
                          value={values.identificacion}
                          onChange={handleChange}
                          disabled
                        />
                      </div>
                    </div>

                    <div
                      className={`flex m-4 items-center ${
                        errors.nombre ? "mb-0" : "mb-4"
                      }`}
                    >
                      <FaUser
                        className="text-white"
                        style={{ fontSize: "1.5rem" }}
                      />
                      <input
                        type="text"
                        placeholder="Nombres"
                        className="m-2 ml-3 h-12 rounded-lg bg-gray-700 text-white w-full pl-4"
                        name="nombre"
                        value={values.nombre}
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
                        errors.apellido ? "mb-0" : "mb-4"
                      }`}
                    >
                      <FaUser
                        className="text-white "
                        style={{ fontSize: "1.5rem" }}
                      />
                      <input
                        type="text"
                        className="m-2 h-12 ml-3 rounded-lg bg-gray-700 text-white w-full pl-4"
                        placeholder="Apellidos"
                        name="apellido"
                        value={values.apellido}
                        onChange={handleChange}
                      />
                    </div>
                    {errors.apellido && touched.apellido && (
                      <div className="text-red-500 justify-center text-center">
                        {errors.apellido}
                      </div>
                    )}
                    <div
                      className={`flex m-4 items-center ${
                        errors.telefono ? "mb-0" : "mb-4"
                      }`}
                    >
                      <FaPhoneAlt
                        className="text-white "
                        style={{ fontSize: "1.75rem" }}
                      />
                      <input
                        type="text"
                        className="m-2 h-12 ml-3 rounded-lg bg-gray-700 text-white w-full pl-4"
                        placeholder="Telefono"
                        name="telefono"
                        value={values.telefono}
                        onChange={handleChange}
                      />
                    </div>
                    {errors.telefono && touched.telefono && (
                      <div
                        className={`text-center ${
                          errors.telefono.includes("ya registrado")
                            ? "text-white"
                            : "text-red-500"
                        }`}
                      >
                        {errors.telefono}
                      </div>
                    )}
                    <div
                      className={`flex m-4 items-center ${
                        errors.correo ? "mb-0" : "mb-4"
                      }`}
                    >
                      <IoIosMail
                        className="text-white "
                        style={{ fontSize: "2rem" }}
                      />
                      <input
                        type="text"
                        className="m-2 ml-3 bg-gray-700 h-12 rounded-lg text-white w-full pl-4"
                        placeholder="Correo"
                        name="correo"
                        value={values.correo}
                        onChange={handleChange}
                      />
                    </div>
                    {errors.correo && touched.correo && (
                      <div
                        className={`text-center ${
                          errors.correo.includes("ya está registrado")
                            ? "text-white"
                            : "text-red-500"
                        }`}
                      >
                        {errors.correo}
                      </div>
                    )}
                  </div>
                  <div className="justify-center m-6 items-center">
                    <div
                      style={{ marginLeft: "-25px", marginTop: "11px" }}
                      className={`flex m-4 items-center ${
                        errors.genero ? "mb-0" : "mb-4"
                      }`}
                    >
                      <MdOutlineGroups2
                        className="text-white"
                        style={{ fontSize: "2rem" }}
                      />

                      <select
                        name="genero"
                        className="m-2 ml-3 bg-gray-700 h-12 rounded-lg text-white pl-4"
                        style={{ width: "370px" }}
                        onChange={handleChange}
                        value={values.genero} // Aquí estableces el valor seleccionado dinámicamente
                      >
                        <option value="" disabled>
                          Selecciona un género
                        </option>
                        <option value="Femenino">Femenino</option>
                        <option value="Masculino">Masculino</option>
                        <option value="Otro">Otro</option>
                      </select>
                    </div>
                    {errors.genero && touched.genero && (
                      <div className="text-red-500 justify-center text-center">
                        {errors.genero}
                      </div>
                    )}
                    <div
                      className="flex items-center justify-center rounded-lg bg-gray-700 h-60 w-64 relative ml-14 mt-6"
                      style={{ marginTop: "5px" }}
                    >
                      {" "}
                      {imagenURL ? (
                        <img
                          src={imagenURL}
                          alt="Imagen seleccionada"
                          className="h-full w-full object-cover rounded-lg cursor-pointer"
                          onClick={handleClickImagen}
                        />
                      ) : administrador.image ? (
                        <img
                          src={administrador.image.url}
                          alt="Imagen seleccionada"
                          className="h-full w-full object-cover rounded-lg cursor-pointer"
                          onClick={handleClickImagen}
                        />
                      ) : (
                        <label
                          htmlFor="image"
                          className="cursor-pointer flex flex-col justify-center items-center"
                          onClick={handleClickImagen}
                        >
                          <FaFileImage
                            className="text-white"
                            style={{ fontSize: "8rem" }}
                          />
                          <h1 className="text-white">Subir imagen</h1>
                        </label>
                      )}
                      <input
                        type="file"
                        id="imagen"
                        className="hidden"
                        name="image"
                        accept="image/*"
                        onChange={(e) => {
                          setFieldValue("image", e.target.files[0]);
                          handleImagenChange(e);
                        }}
                      />
                    </div>
                    {errors.image && touched.image && (
                      <div className="text-red-500 justify-center text-center">
                        {errors.image}
                      </div>
                    )}
                    <div className="flex justify-center space-x-4 m-5 ">
                      <button
                        type="submit"
                        className="bg-green-600 py-2 px-4 rounded-lg hover:bg-green-900 text-white flex items-center"
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
                </div>
              </Form>
            )}
          </Formik>
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
              Informacion actualizada con éxito.
            </h2>
          </div>
          <div className="flex justify-center space-x-4">
            <button
              className="bg-green-600 py-2 px-4 rounded-lg hover:bg-green-900 text-white flex items-center"
              onClick={() => {
                setShowEditarAviso(false);
                setShowAviso(false);
              }}
            >
              <FaCheck className="w-6 mr-2" />
              Aceptar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default IndexAdmin;
