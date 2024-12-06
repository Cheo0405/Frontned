import { createContext, useContext, useState, useEffect } from "react";
import {
  getDocentesRequest,
  getDocenteRequest,
  registerDocenteRequest,
  editedDocenteRequest,
  deleteDocenteRequest,
  reloadDocenteRequest,
} from "../api/docente.js";

const DocenteContext = createContext();

export const useDocente = () => {
  const context = useContext(DocenteContext);
  if (!context) {
    throw new Error("useDocente must be used within a DocenteProvider");
  }
  return context;
};

export const DocenteProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [errors, setErrors] = useState([]);

  const getDocente = async (id) => {
    try {
      const res = await getDocenteRequest(id);
      return res.data;
    } catch (error) {
      console.error(error);
    }
  };

  const getDocentes = async () => {
    try {
      const res = await getDocentesRequest();
      return res.data;
    } catch (error) {
      console.error(error);
    }
  };

  const registerDocente = async (user) => {
    try {
      const res = await registerDocenteRequest(user);
      setUser(res.data);
    } catch (error) {
      setErrors(error.response.data);
      console.error(error);
      throw error.response.data.message || "Error en el registro.";
    }
  };

  const deleteDocente = async (id) => {
    try {
      const res = await deleteDocenteRequest(id);
      return res.data;
    } catch (error) {
      console.error(error);
    }
  };

  const reloadDocente = async (id) => {
    try {
      const res = await reloadDocenteRequest(id);
      return res.data;
    } catch (error) {
      console.error(error);
    }
  };

  const updateDocente = async (id, user) => {
    try {
      await editedDocenteRequest(id, user);
    } catch (error) {
      console.error(error);
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

  return (
    <DocenteContext.Provider
      value={{
        user,
        registerDocente,
        getDocente,
        getDocentes,
        deleteDocente,
        updateDocente,
        reloadDocente,
        errors,
      }}
    >
      {children}
    </DocenteContext.Provider>
  );
};
