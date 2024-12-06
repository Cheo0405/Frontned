import React from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import logoOrganizacion from "../assets/logoOrganizacion.png";
import "../components/styles/LoginStyle.css";
import { useState } from "react";
import { TbLock } from "react-icons/tb";
import { useParams } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function ResetPasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { errors: signinErrors, successMessage, resetPassword } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const { cedula, token } = useParams(); // Obtener cedula y token desde la URL

  const onSubmit = handleSubmit(async (data) => {
    try {
      console.log(data);
      const response = await resetPassword(cedula, token, data.clave); // Pasar cedula y token desde la URL y clave desde el formulario
      if (response.successMessage === "Contraseña actualizada correctamente") {
        setTimeout(() => {
          navigate("/login"); // Redirigir al usuario a la página de inicio de sesión
        }, 6000); // 5 segundos
      }
    } catch (error) {
      console.error("Error al restablecer la contraseña:", error);
    }
  });

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <div className="flex h-[calc(100vh-100px)] items-center justify-center space-x-20">
      <div className="relative">
        <div className="bg-yellow-700 h-16 fixed top-0 w-full z-10 flex items-center justify-start right-0 m-0 p-0"></div>
      </div>

      <div className="contenedor bg-blue-900 max-w-md w-full p-10 rounded-md items-center justify-center relative">
        <h1 className="text-2xl font-bold my-2 text-white text-center">
          Crea una contraseña
        </h1>
        <br></br>
        <style jsx>{`
          .smaller-text {
            font-size: 15px;
          }
          .image-ipuc {
            margin-top: 100px;
          }
        `}</style>

        <p className="text-lg my-2 text-white text-center">
          <span className="smaller-text">
            Ya estamos al final de este proceso de registro, crea tu contraseña.
          </span>
        </p>
        <br />
        <form onSubmit={onSubmit}>
          <div className="relative flex items-center">
            <div className="text-white mr-2">
              <TbLock className="w-6 h-6" />
            </div>

            <input
              type={showPassword ? "text" : "password"}
              {...register("clave", {
                required: "La contraseña es obligatoria",
                minLength: {
                  value: 8,
                  message: "La contraseña debe tener al menos 8 caracteres",
                },
                maxLength: {
                  value: 15,
                  message: "La contraseña no puede tener más de 15 caracteres",
                },
                pattern: {
                  value: /^(?=.*[A-Z])(?=.*\d).+$/,
                  message:
                    "La contraseña debe contener al menos una letra mayúscula y un número",
                },
              })}
              className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2 pr-10"
              placeholder="Contraseña"
            />
            <div
              className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? (
                <FaEyeSlash className="text-white" />
              ) : (
                <FaEye className="text-white" />
              )}
            </div>
          </div>
          {/* Mostrar mensajes de error específicos */}
          {errors.clave?.type === "required" && (
            <p className="text-red-500">La contraseña es obligatoria</p>
          )}
          {errors.clave?.type === "minLength" && (
            <p className="text-red-500">
              La contraseña debe tener al menos 8 caracteres
            </p>
          )}
          {errors.clave?.type === "maxLength" && (
            <p className="text-red-500">
              La contraseña no puede tener más de 15 caracteres
            </p>
          )}
          {errors.clave?.type === "pattern" && (
            <p className="text-red-500">
              La contraseña debe contener al menos una letra mayúscula y un
              número
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
              value="Registrar Contraseña"
              className="bg-white text-blue-600 px-4 py-2 rounded-md transition duration-300 ease-in-out hover:bg-custom-brown1 hover:text-white"
            />
          </div>
        </form>
      </div>

      <div className="text-center">
        <img
          src={logoOrganizacion}
          alt="Logo de la organización"
          className="w-86 h-64 mx-auto image-ipuc"
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
