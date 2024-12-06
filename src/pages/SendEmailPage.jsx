import React from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import logoOrganizacion from "../assets/logoOrganizacion.png";
import { FaArrowAltCircleLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import "../components/styles/LoginStyle.css";
import { useState } from "react";
import { MdMarkEmailUnread } from "react-icons/md";

function ResetPasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const {
    sendEmail,
    errors: signinErrors,
    isAuthenticated,
    successMessage,
  } = useAuth();
  const [userDatas, setUserDatas] = useState("");
  const navigate = useNavigate();

  const onSubmit = handleSubmit(async (data) => {
    try {
      console.log(data);
      const userData = await sendEmail(data);
      console.log(userData);
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
    }
  });

  return (
    <div className="flex h-[calc(100vh-100px)] items-center justify-center space-x-20">
      <div className="relative">
        <div className="bg-yellow-700 h-16 fixed top-0 w-full z-10 flex items-center justify-start right-0 m-0 p-0">
          <Link to="/login">
            <FaArrowAltCircleLeft className="text-white ml-4 cursor-pointer top-0 z-20 w-8 h-8 hover:text-custom-blue1" />
          </Link>
        </div>
      </div>

      <div className="contenedor bg-blue-900 max-w-md w-full p-10 rounded-md items-center justify-center relative">
        <h1 className="text-2xl font-bold my-2 text-white text-center">
          Restablecer Contraseña
        </h1>
        <br></br>
        <style jsx>{`
          .smaller-text {
            font-size: 15px;
          }
        `}</style>

        <p className="text-lg my-2 text-white text-center">
          <span className="smaller-text">
            Para restablecer tu contraseña, ingresa tu correo electrónico
          </span>
        </p>
        <br />
        <form onSubmit={onSubmit}>
          <div className="flex items-center">
            <div className="text-white mr-2">
              <MdMarkEmailUnread className="w-5 h-5" />
            </div>
            <input
              type="text"
              {...register("correo", { required: true })}
              className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2"
              placeholder="Correo electrónico"
            ></input>
          </div>
          {errors.correo && (
            <p className="text-red-500">
              Por favor, ingresa un correo electrónico
            </p>
          )}
          <br />

          {signinErrors.map((error, i) => (
            <div className="bg-red-500 p-2 text-white text-center" key={i}>
              {error}
            </div>
          ))}
          {successMessage && ( // Mostrar el mensaje de éxito
            <div className="bg-green-500 p-2 text-white text-center">
              {successMessage}
            </div>
          )}
          <br />
          <div className="flex items-center justify-center">
            <input
              type="submit"
              value="Enviar Correo"
              className="bg-white text-blue-600 px-4 py-2 rounded-md transition duration-300 ease-in-out hover:bg-custom-brown1 hover:text-white"
            />
          </div>
        </form>
      </div>

      <div className="text-center">
        <img
          src={logoOrganizacion}
          alt="Logo de la organización"
          className="w-86 h-64 mx-auto"
        />
        <br></br>

        <h1 className="text-4xl font-bold text-blue-800 mt-4 mb-4">
          ¡ Bienvenidos !
        </h1>
      </div>

      <div className="inferior bg-yellow-700 h-16 fixed bottom-0 right-0 m-0 p-0"></div>
    </div>
  );
}

export default ResetPasswordPage;
