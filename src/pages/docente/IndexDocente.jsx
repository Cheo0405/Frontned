import React, { useState, useEffect } from "react";
import Versiculos from "../admin/Versiculos.json";
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
      console.log(usuarioEncontrado);
      // Verificar si el usuario encontrado tiene una identificación diferente a la del usuario que se está editando
      if (usuarioEncontrado) {
        return usuarioEncontrado._id !== administrador._id;
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
        return usuarioEncontrado._id !== administrador._id;
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
      className="flex flex-col items-center justify-center max-h-screen gap-3"
    >
      {/*Bienvenida*/}
      <div className="flex flex-col gap-4 px-5 mt-4 md:w-100 md:px-10" style={{ marginTop: "10px" }}>
        <p className="py-3 text-xl md:text-2xl font-semibold" style={{ marginLeft: "-100px" }}>¡Hola!</p>
        <strong className="text-4xl md:text-5xl">
          Docente {administrador.nombre}
        </strong>
      </div>
      {/*Versiculo de bienvenida*/}
      <div className="flex flex-col gap-3 py-8 md:ml-0 md:mr-0" style={{ marginTop: "40px" }}>
        <p className="text-custom-brown2 text-xl text-center" style={{ marginRight: "-900px" }}>
          VERSICULO DEL DIA
        </p>
        <p className="text-white text-2xl font-medium text-center bg-custom-brown2 rounded-lg ml-5 mr-5 mt-5 px-5 py-10 md:ml-5 md:mr-5 md:py-10 md:px-5" style={{ width: "1000px" }}>
          <strong>{versiculo.texto}</strong>
          <p className="mt-5 text-base md:mt-5 md:text-2xl">{versiculo.cita}</p>
        </p>
      </div>
    </div>
  );
}

export default IndexAdmin;
