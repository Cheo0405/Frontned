import React, { useState, useEffect } from "react";
import { VscEdit } from "react-icons/vsc";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { FaRegIdCard, FaPhoneAlt } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";
import { FaFileImage } from "react-icons/fa6";
import { MdOutlineGroups2 } from "react-icons/md";
import { MdSaveAlt } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import axios from "axios";

function informacionDocente() {
  const [docente, setDocente] = useState(null);
  const [imagen, setImagen] = useState(null);
  const [imagenURL, setImagenURL] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("user")) || {};
    setDocente(data);
  }, []);

  // Este useEffect se ejecutará cuando `docente` cambie
  useEffect(() => {
    if (docente) {
      console.log("Este es el docente: ", docente);
    }
  }, [docente]);

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
      console.log(usuarioEncontrado);
      console.log(usuarioEncontrado._id);
      console.log(docente.id);
      console.log(usuarioEncontrado.identificacion === docente.identificacion);
      // Verificar si el usuario encontrado tiene una identificación diferente a la del usuario que se está editando
      if (usuarioEncontrado) {
        return usuarioEncontrado.identificacion !== docente.identificacion;
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
        return usuarioEncontrado.identificacion !== docente.identificacion;
      }

      return false;
    } catch (error) {
      console.error("Error al verificar el teléfono:", error);
      return false;
    }
  };

  const validationSchema = Yup.object().shape({
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
          console.log(duplicado);
          return !duplicado;
        }
      ),
    image: Yup.mixed().required("Debe seleccionar una imagen"),
  });

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

  const imagenEditar = () => {
    setImagenURL(null);
    setIsEditing(!isEditing);
  };

  const updateMe = async (id, me) => {
    try {
      const formData = new FormData();

      // Agregar cada campo al FormData
      formData.append("telefono", me.telefono);
      formData.append("correo", me.correo);

      // Si hay una imagen, agregarla al FormData
      if (me.image) {
        formData.append("image", me.image);
      }

      const response = await axios.put(
        `https://back-ingsoft-nzbv.onrender.com/api/docentes/${id}/update-me`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Actualizar el estado local con los nuevos datos
      setDocente(response.data);

      // Guardar los nuevos datos en localStorage
      localStorage.setItem("user", JSON.stringify(response.data));

      // Mostrar mensaje de éxito
      setSuccessMessage("Datos actualizados con éxito");

      // Recargar la página después de 2 segundos
      setTimeout(() => {
        window.location.reload(); // Recargar la página para ver los cambios
      }, 1000);
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

  return (
    <div style={{ display: "flex", gap: "20px", justifyContent: "center" }}>
      <div
        style={{
          display: "flex",
          gap: "20px",
          width: "100%",
          maxWidth: "1200px",
        }}
      >
        {/* Datos del administrador */}
        <div className="p-5 rounded-lg mt-5 md:mt-0" style={{ width: "600px" }}>
          <h2 className="text-2xl font-bold text-center">
            Información Personal
          </h2>
          {successMessage && ( // Mostrar el mensaje si está presente
            <div className="bg-green-500 text-white p-3 rounded mb-4 text-center">
              {successMessage}
            </div>
          )}
          <br />
          <div
            className="bg-custom-brown1"
            style={{
              height: "470px",
              marginLeft: "25px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-start",
              paddingTop: "20px",
              borderRadius: "30px",
              width: "460px",
            }}
          >
            {docente ? (
              <div>
                {/* Imagen del docente */}
                {docente.image && (
                  <img
                    src={docente.image.url}
                    style={{
                      width: "200px",
                      height: "250px",
                      borderRadius: "10%",
                      objectFit: "cover",
                      marginBottom: "10px",
                      marginLeft: "70px",
                    }}
                  />
                )}
                {/* Datos en dos columnas */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    width: "350px",
                    textAlign: "left",
                  }}
                >
                  {/* Fila 1: Nombre */}
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <strong>Nombre:</strong>
                    <span style={{ color: "white" }}>{docente.nombre}</span>
                  </div>
                  {/* Fila 2: Apellido */}
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <strong>Apellido:</strong>
                    <span style={{ color: "white" }}>{docente.apellido}</span>
                  </div>
                  {/* Fila 3: Identificación */}
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <strong>Identificación:</strong>
                    <span style={{ color: "white" }}>
                      {docente.identificacion}
                    </span>
                  </div>
                  {/* Fila 4: Correo */}
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <strong>Correo:</strong>
                    <span style={{ color: "white" }}>{docente.correo}</span>
                  </div>
                  {/* Fila 5: Teléfono */}
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <strong>Teléfono:</strong>
                    <span style={{ color: "white" }}>{docente.telefono}</span>
                  </div>
                </div>
              </div>
            ) : (
              <p>No se encontraron datos del administrador.</p>
            )}
          </div>
          <div
            className={`flex items-center ${
              isEditing
                ? "bg-red-600 hover:bg-red-700"
                : "bg-green-600 hover:bg-green-700"
            } text-white text-sm py-2 px-3 rounded mr-5 cursor-pointer`}
            style={{
              width: "130px",
              marginTop: "10px",
              marginLeft: "200px",
              height: "40px",
            }}
            onClick={() => imagenEditar()}
          >
            {isEditing ? "Cancelar" : "Actualizar"}
            <VscEdit
              size="30px"
              className="w-5 md:w-6"
              style={{ marginLeft: "10px" }}
            />
          </div>
          <Formik
            initialValues={{
              image: isEditing && docente ? docente.image || "" : "",
              telefono: isEditing && docente ? docente.telefono || "" : "",
              correo: isEditing && docente ? docente.correo || "" : "",
            }}
            enableReinitialize={true}
            validationSchema={validationSchema}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
              const updatedValues = {
                telefono: values.telefono,
                correo: values.correo,
                image: values.image, // Este es el archivo de la imagen
              };

              try {
                await updateMe(docente.identificacion, updatedValues);
              } catch (error) {
                console.error("Error al editar el docente:", error);
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
                  className="p-6 flex justify-center"
                  style={{
                    backgroundColor: "#0F3174",
                    width: "500px",
                    marginLeft: "600px",
                    marginTop: "-630px",
                    height: "610px",
                  }}
                >
                  <div className="justify-center m-6">
                    <div
                      className="flex items-center justify-center rounded-lg bg-gray-700 h-60 w-64 relative ml-14 mt-6"
                      style={{
                        marginTop: "40px",
                        marginLeft: "10px",
                        width: "350px",
                        marginBottom: "40px",
                      }}
                    >
                      {isEditing ? (
                        <img
                          src={imagenURL || docente.image.url}
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
                        style={{ objectFit: "cover",}}
                        onChange={(e) => {
                          setFieldValue("image", e.target.files[0]); // Asegúrate de pasar el archivo
                          handleImagenChange(e);
                        }}
                        disabled={!isEditing}
                      />
                    </div>
                    {errors.image && touched.image && (
                      <div className="text-red-500 justify-center text-center">
                        {errors.image}
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
                        name="telefono"
                        className={`m-2 ml-3 bg-gray-700 h-12 rounded-lg text-white w-full pl-4 ${
                          errors.telefono ? "border-red-500" : ""
                        }`}
                        onChange={handleChange}
                        value={values.telefono}
                        disabled={!isEditing}
                        placeholder={isEditing ? docente?.telefono : "Teléfono"}
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
                        name="correo"
                        className={`m-2 ml-3 bg-gray-700 h-12 rounded-lg text-white w-full pl-4 ${
                          errors.correo ? "border-red-500" : ""
                        }`}
                        onChange={handleChange}
                        value={values.correo}
                        disabled={!isEditing}
                        placeholder={isEditing ? docente?.correo : "Correo"}
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
                    <button
                      type="submit"
                      disabled={isSubmitting || !isEditing}
                      className={`flex items-center bg-green-600 hover:bg-green-700 text-white text-sm py-2 px-3 rounded ml-5 mr-5 cursor-pointer ${
                        isSubmitting || !isEditing
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      style={{ width: "190px", marginLeft: "90px" }}
                      onClick={() => {
                        handleSubmit();
                      }}
                    >
                      Guardar cambios
                      <MdSaveAlt
                        size="30px"
                        className="w-5 md:w-6"
                        style={{ marginLeft: "15px" }}
                      />
                    </button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}

export default informacionDocente;
