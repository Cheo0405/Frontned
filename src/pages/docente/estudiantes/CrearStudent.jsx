import { Form, Formik } from "formik";
import { useStudent } from "../../../context/StudentContext";
import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { MdSaveAlt } from "react-icons/md";
import { FaRegIdCard, FaPhoneAlt } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";
import { FaFileImage } from "react-icons/fa6";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import axios from "axios";
import { FaCheck } from "react-icons/fa";
import { MdOutlineGroups2 } from "react-icons/md";

Modal.setAppElement("#root"); // Necesario para accesibilidad

function CrearStudent() {
  const navigate = useNavigate();
  const [imagen, setImagen] = useState(null);
  const [showAviso, setShowAviso] = useState(false);

  const handleClick = () => {
    navigate("/docente/eventos");
  };

  const { registerStudent } = useStudent();

  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagen(file);
    } else {
      setImagen(null);
    }
  };

  const correoRegistrado = async (correo) => {
    try {
      const response = await axios.get("https://back-ingsoft-nzbv.onrender.com/api/usuarios");
      const usuarios = response.data;

      // Verificar si el correo está en la lista de usuarios
      const usuarioEncontrado = usuarios.some(
        (usuario) => String(usuario.correo) === String(correo)
      );
      return usuarioEncontrado;
    } catch (error) {
      console.error("Error al verificar el correo:", error);
      return false;
    }
  };

  const documentoRegistrado = async (identificacion) => {
    try {
      const response = await axios.get("https://back-ingsoft-nzbv.onrender.com/api/usuarios");
      const usuarios = response.data;
      const usuarioEncontrado = usuarios.some(
        (usuario) => String(usuario.identificacion) === String(identificacion)
      );
      return usuarioEncontrado;
    } catch (error) {
      console.error("Error al verificar el documento:", error);
      return false;
    }
  };

  const telefonoRegistrado = async (telefono) => {
    try {
      const response = await axios.get("https://back-ingsoft-nzbv.onrender.com/api/usuarios");
      const usuarios = response.data;
      const usuarioEncontrado = usuarios.some(
        (usuario) => String(usuario.telefono) === String(telefono)
      );
      return usuarioEncontrado;
    } catch (error) {
      console.error("Error al verificar el teléfono:", error);
      return false;
    }
  };

  const handleClickImagen = () => {
    document.getElementById("imagen").click();
  };

  const validationSchema = Yup.object().shape({
    identificacion: Yup.string()
      .matches(
        /^\+?[0-9]{8,10}$/,
        "La cédula debe tener entre 8 y 10 dígitos numéricos"
      )
      .required("El documento es requerido")
      .test(
        "check-duplicado",
        "Documento ya registrado en el sistema",
        async (identificacion) => {
          const duplicado = await documentoRegistrado(identificacion);
          return !duplicado;
        }
      ),
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
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Formato de correo electrónico inválido"
      )
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
    genero: Yup.string()
      .required("El género es requerido")
      .oneOf(
        ["Femenino", "Masculino", "Otro"],
        "Debe seleccionar un género válido"
      ),
  });

  return (
    <>
      <div className="">
        <br />
        <h1 className="text-[38px] text-center font-bold">
          {" "}
          Agregar Estudiante
        </h1>
        <br />
        <Formik
          initialValues={{
            tipoIdentificacion: "TI", // Valor por defecto
            identificacion: "",
            nombre: "",
            apellido: "",
            telefono: "",
            correo: "",
            image: null,
            genero: "",
          }}
          enableReinitialize={true}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            try {
              await registerStudent(values);
              setShowAviso(true);
              setImagen(null);
              resetForm();
            } catch (error) {
              if (error.response && error.response.data) {
                console.error(
                  "Error al crear el estudiante:",
                  error.response.data.message
                );
              } else {
                console.error("Error al crear el estudiante:", error);
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
                  backgroundColor: "rgba(140, 100, 40, 0.73)",
                  width: "1000px",
                  marginLeft: "200px",
                }}
              >
                {" "}
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
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  {errors.identificacion && touched.identificacion && (
                    <div
                      className={`justify-center text-center ${
                        errors.identificacion.includes("ya registrado")
                          ? "text-white"
                          : "text-red-500"
                      }`}
                    >
                      {errors.identificacion}
                    </div>
                  )}

                  <div
                    className={`flex m-4 items-center ${
                      errors.nombre ? "mb-0" : "mb-4"
                    }`}
                  >
                    <FaUser
                      className="text-white "
                      style={{ fontSize: "1.5rem" }}
                    />
                    <input
                      type="text"
                      placeholder="Nombres"
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
                    >
                      <option value="" disabled selected>
                        Género
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
                    {imagen ? (
                      <img
                        src={URL.createObjectURL(imagen)}
                        alt="Imagen seleccionada"
                        className="h-full w-full object-cover rounded-lg cursor-pointer"
                        onClick={handleClickImagen}
                      />
                    ) : (
                      <label
                        htmlFor="imagen"
                        className="cursor-pointer flex flex-col items-center"
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
                        setImagen(e.target.files[0]);
                        handleImagenChange(e);
                      }}
                    />
                  </div>
                  {errors.image && touched.image && (
                    <div className="text-red-500 justify-center text-center">
                      {errors.image}
                    </div>
                  )}
                  <div
                    className="flex justify-center space-x-4 m-5"
                    style={{ marginLeft: "-50px" }}
                  >
                    {" "}
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
                      onClick={() => handleClick()}
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

      {/* Aviso de Creacion Alumno*/}
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
          {" "}
          <div className="mb-8 text-white text-center poppins text-[25px] m-6">
            <h2 className="mb-8 text-white text-center poppins text-[25px] m-6">
              Estudiante creado con éxito.
            </h2>
          </div>
          <div className="flex justify-center space-x-4">
            <button
              className="bg-green-600 py-2 px-4 rounded-lg hover:bg-green-900 text-white flex items-center"
              onClick={() => {
                handleClick();
              }}
            >
              <FaCheck className="w-6 mr-2" />
              Aceptar
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default CrearStudent;
