import { createContext, useContext, useState, useEffect } from "react";
import {
  registerRequest,
  loginRequest,
  verifyTokenRequet,
  getUsuariosRequest,
  sendEmailRequest,
  resetPasswordRequest,
} from "../api/auth";
import Cookies from "js-cookie";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errors, setErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [usuarios, setUsuarios] = useState([]);

  const signup = async (user) => {
    try {
      const res = await registerRequest(user);
      console.log(res.data);
      setUser(res.data);
      setIsAuthenticated(true);
      setErrors([]); // Limpiar los errores al tener éxito
      return res.data;
    } catch (error) {
      setErrors(error.response.data);
      console.error(error);
      throw error.response.data.message || "Error en el registro.";
    }
  };

  const signin = async (user) => {
    try {
      console.log(user);
      const res = await loginRequest(user);
      const userData = res.data;
      console.log(userData);
      setIsAuthenticated(true);
      setUser(userData);

      return userData;
    } catch (error) {
      console.log(error.response.data);
      if (Array.isArray(error.response.data)) {
        return setErrors(error.response.data);
      }
      setErrors([error.response.data.message]);
    }
  };

  const sendEmail = async (user) => {
    try {
      const res = await sendEmailRequest(user);
      console.log(res.data);
      setIsAuthenticated(true);
      setErrors([]); // Limpiar los errores al tener éxito
      setSuccessMessage("Por favor, revisa tu bandeja de entrada y de spam."); // Establecer el mensaje de éxito
      return res.data;
    } catch (error) {
      console.log(error.response.data);
      if (Array.isArray(error.response.data)) {
        return setErrors(error.response.data);
      }
      setErrors([error.response.data.message]);
      setSuccessMessage(""); // Limpiar el mensaje de éxito en caso de error
    }
  };

  const resetPassword = async (cedula, token, contrasena) => {
    try {
      const res = await resetPasswordRequest(cedula, token, contrasena);
      console.log(res.data);
      setIsAuthenticated(true);
      setErrors([]); // Limpiar los errores al tener éxito
      setSuccessMessage("La contraseña ha sido restablecida correctamente."); // Establecer el mensaje de éxito
      return res.data;
    } catch (error) {
      console.log(error.response.data);
      if (Array.isArray(error.response.data)) {
        return setErrors(error.response.data);
      }
      setErrors([error.response.data.message]);
      setSuccessMessage("");
    }
  };

  const logout = () => {
    Cookies.remove("token");
    setIsAuthenticated(false);
    setUser(null);
  };

  const getUsuarios = async () => {
    try {
      const res = await getUsuariosRequest();
      setUsuarios(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const getTeachers = async () => {
    try {
      const res = await getUsuariosRequest();
      const teachers = res.data.filter((usuario) => usuario.rol === "DOCENTE");

      setUsuarios(teachers);
    } catch (error) {
      console.error("Error al obtener los profesores:", error);
      return [];
    }
  };

  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => {
        setErrors([]);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errors]);

  useEffect(() => {
    if (successMessage.length > 0) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    async function checkLogin() {
      const cookies = Cookies.get();

      if (!cookies.token) {
        setIsAuthenticated(false);
        setLoading(false);
        return setUser(null);
      }

      try {
        const res = await verifyTokenRequet(cookies.token);
        if (!res.data) {
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }

        setIsAuthenticated(true);
        setUser(res.data);
        setLoading(false);
      } catch (error) {
        setIsAuthenticated(false), setUser(null);
        setLoading(false);
      }
    }
    checkLogin();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        usuarios,
        signup,
        signin,
        logout,
        sendEmail,
        getUsuarios,
        getTeachers,
        resetPassword,
        loading,
        user,
        isAuthenticated,
        errors,
        successMessage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
