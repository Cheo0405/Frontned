import { createContext, useContext, useState, useEffect } from "react";
import {
  getStudentsRequest,
  getStudentRequest,
  registerStudentRequest,
  editedStudentRequest,
  deleteStudentRequest,
  reloadStudentRequest,
} from "../api/student.js";

const StudentContext = createContext();

export const useStudent = () => {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error("useStudent must be used within an StudentProvider");
  }
  return context;
};

export const StudentProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [errors, setErrors] = useState([]);

  const getStudent = async (id) => {
    try {
      const res = await getStudentRequest(id);
      return res.data;
    } catch (error) {
      console.error(error);
    }
  };

  const getStudents = async () => {
    try {
      const res = await getStudentsRequest();
      return res.data;
    } catch (error) {
      console.error(error);
    }
  };

  const registerStudent = async (user) => {
    try {
      const res = await registerStudentRequest(user);
      setUser(res.data);
    } catch (error) {
      setErrors(error.response.data);
      console.error(error);
      throw error.response.data.message || "Error en el registro.";
    }
  };

  const deleteStudent = async (id) => {
    try {
      const res = await deleteStudentRequest(id);
      return res.data;
    } catch (error) {
      console.error(error);
    }
  };

  const updateStudent = async (id, user) => {
    try {
      await editedStudentRequest(id, user);
    } catch (error) {
      console.error(error);
    }
  };

  const reloadStudent = async (id) => {
    try {
      const res = await reloadStudentRequest(id);
      return res.data;
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
    <StudentContext.Provider
      value={{
        user,
        registerStudent,
        getStudent,
        getStudents,
        deleteStudent,
        updateStudent,
        reloadStudent,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
};
