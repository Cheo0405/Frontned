import { useStudent } from "../../../context/StudentContext"; //acomodar
import { useEffect } from "react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import { MdOutlineRestartAlt } from "react-icons/md";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";

import { IoClose } from "react-icons/io5";
import { FaCheck, FaEye } from "react-icons/fa";
import DataTable from "react-data-table-component";
import Modal from "react-modal";
import * as Yup from "yup";

import { VscEdit, VscTrash } from "react-icons/vsc";

Modal.setAppElement("#root"); // Necesario para accesibilidad

function Students() {
  const { getStudents, deleteStudent, reloadStudent } = useStudent();

  useEffect(() => {
    getStudents();
  }, []);

  const [selectedStudents, setSelectedStudens] = useState(null); // []
  const [showDiv, setShowDiv] = useState(false);

  const [showEliminarAviso, setShowEliminarAviso] = useState(false);
  const [showReloadAviso, setShowReloadAviso] = useState(false);

  const handleDeleteStudent = async (id) => {
    try {
      await deleteStudent(id);
      setShowEliminarAviso(false);
      console.log("Estudiante eliminado exitosamente");
      // Realizar cualquier acción adicional después de eliminar el estudiante
    } catch (error) {
      console.error("Error al eliminar al Estudiante:", error);
      // Manejar el error apropiadamente
    }
  };

  const handleReloadEstudiante = async (id) => {
    try {
      await reloadStudent(id);
      setShowReloadAviso(false);
      console.log("Estudiante habilitado exitosamente");
      // Realizar cualquier acción adicional después de habilitar el docente
    } catch (error) {
      console.error("Error al habilitar al Estudiante", error);
      // Manejar el error apropiadamente
    }
  };

  const handleEliminarClick = () => {
    if (selectedRows.selectedRows.length === 0) {
      alert("Por favor, seleccione un estudiante para Inhabilitar");
    } else {
      const P1 = selectedRows.selectedRows[0]._id;
      const sector = records.find((record) => record._id === P1);
      setSelectedStudens(sector);
      setShowEliminarAviso(true);
    }
  };

  const handleReloadClick = () => {
    if (selectedRows.selectedRows.length === 0) {
      alert("Por favor, seleccione un estudiante para habilitar");
    } else {
      const P1 = selectedRows.selectedRows[0]._id;
      const sector = records.find((record) => record._id === P1);
      setSelectedStudens(sector);
      setShowReloadAviso(true);
    }
  };

  const handleEditarClick = () => {
    if (selectedRows.selectedRows.length === 0) {
      alert("Por favor, seleccione un Estudiante para editar");
    } else {
      const P1 = selectedRows.selectedRows[0]._id;
      const estudiante = records.find((record) => record._id === P1);
      setSelectedStudens(estudiante);
      VistaEditar(estudiante._id);
    }
  };

  const VistaEditar = (id) => {
    navigate(`${id}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://back-ingsoft-nzbv.onrender.com/api/estudiantes"
        );
        const estudiantes = await Promise.all(
          response.data.map(async (item) => {
            return {
              ...item,
              _id: item._id,
              documento: item.documento,
              nombre: item.nombre,
              apellido: item.apellido,
              correo: item.correo,
              telefono: item.telefono,
              estado: item.estado,
            };
          })
        );
        setRecords(estudiantes);
        setFilteredRecords(estudiantes);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  //variables tabla

  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/administrador/estudiantes/registrar");
  };

  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRows, setSelectedRows] = useState({ selectedRows: [] });
  const [mostrarOpciones, setMostrarOpciones] = useState(null);

  useEffect(() => {
    const filtered = records.filter(
      (record) =>
        record.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.identificacion.toString().includes(searchTerm)
    );
    setFilteredRecords(filtered);
  }, [searchTerm, records]);



  const columns = [
    {
      name: "Identificación",
      selector: (row) => row.identificacion,
      sortable: true,
      width: "185px",
      cell: (row) => (
        <div style={{ fontSize: "13px" }}>{row.identificacion}</div>
      ),
    },
    {
      name: "Nombre",
      selector: (row) => row.nombre,
      sortable: true,
      width: "180px",
      cell: (row) => <div style={{ fontSize: "13px" }}>{row.nombre}</div>,
    },
    {
      name: "Apellido",
      selector: (row) => row.apellido,
      sortable: true,
      width: "180px",
      cell: (row) => <div style={{ fontSize: "13px" }}>{row.apellido}</div>,
    },
    {
      name: "Correo",
      selector: (row) => row.correo,
      sortable: true,
      width: "250px",
      cell: (row) => <div style={{ fontSize: "13px" }}>{row.correo}</div>,
    },
    {
      name: "Teléfono",
      selector: (row) => row.telefono,
      sortable: true,
      width: "150px",
      cell: (row) => <div style={{ fontSize: "13px" }}>{row.telefono}</div>,
    },
    {
      name: "Estado",
      selector: (row) => row.estado,
      sortable: true,
      width: "150px",
      cell: (row) => (
        <div
          style={{
            textAlign: "center",
            fontSize: "13px",
            color: row.estado === "ACTIVO" ? "green" : "red",
            fontWeight: "bold",
          }}
        >
          {row.estado}
        </div>
      ),
    },
  ];

  const handleViewStudents = () => {
    if (selectedRows.selectedRows.length === 0) {
      alert("Por favor, seleccione un Estudiante para editar");
    } else {
      const P1 = selectedRows.selectedRows[0]._id;
      const estudiante = records.find((record) => record._id === P1);
      console.log(estudiante);
      setSelectedStudens(estudiante);
      VistaEstudianteDetalles(estudiante._id);
    }
  };

  const VistaEstudianteDetalles = (id) => {
    navigate(`/administrador/estudiantes/details/${id}`);
  };

  const customStyles = {
    headCells: {
      style: {
        fontSize: "18px",
        fontWeight: "bold",
      },
    },
    rows: {
      style: {
        fontSize: "12px",
      },
    },
    table: {
      style: {
        borderRadius: "15px",
        overflow: "hidden",
        width: 1100, // Ajusta el ancho de la tabla
        maxWidth: "1100px",
      },
    },
  };

  return (
    <>
      <div className="flex flex-col items-center mt-2 gap-4 min-h-screen">
        {/*tabla de estudiantes*/}
        <br />
        <div className="mb-6">
          <h1 className="text-[38px] text-center font-bold">
            {" "}
            Estudiante Registrados
          </h1>
        </div>
        <div className="search-bar-jugadores">
          <FontAwesomeIcon
            icon={faSearch}
            size="xl"
            className="search-icon-jugadores"
          />
          <input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input-jugadores border rounded-lg border-gray-300 bg-gray-100 p-2 text-gray-700"
          />
          <div
            className="clear-search-jugadores-circle"
            onClick={() => setSearchTerm("")}
          >
            <FontAwesomeIcon icon={faTimes} />
          </div>
        </div>
        <div className="flex flex-col items-center mt-2 gap-4 min-h-screen p-5 h-auto w-full max-w-axl">
          {mostrarOpciones && (
            <div
              className="flex justify-end items-end mb-4 botones-acciones-docentes"
              style={{ marginBottom: "57px" }}
            >
              <div
                className="flex items-center bg-green-600 hover:bg-green-700 text-white text-sm py-2 px-3 rounded mr-5 cursor-pointer"
                onClick={() => {
                  handleEditarClick();
                }}
              >
                <VscEdit size="30px" className="w-5 md:w-6" />
              </div>

              {/* Botón para visualizar */}
              <div
                className="flex items-center bg-yellow-600 hover:bg-yellow-700 text-white text-sm py-2 px-3 rounded mr-5 cursor-pointer"
                onClick={() => handleViewStudents()}
              >
                <FaEye size="30px" className="w-5 md:w-6" />
              </div>

              {/* Verificar el estado del docente para mostrar el botón adecuado */}
              {mostrarOpciones.estado === "ACTIVO" ? (
                <div
                  className="flex items-center bg-red-500 hover:bg-red-700 text-white text-sm py-2 px-3 rounded cursor-pointer"
                  onClick={() => handleEliminarClick()}
                >
                  <VscTrash size="30px" className="w-5 md:w-6" />
                </div>
              ) : (
                <div
                  className="flex items-center bg-blue-500 hover:bg-blue-700 text-white text-sm py-2 px-3 rounded cursor-pointer"
                  onClick={() => handleReloadClick(mostrarOpciones._id)}
                >
                  <MdOutlineRestartAlt size="30px" className="w-5 md:w-6" />
                </div>
              )}
            </div>
          )}

          <div
            className="outer-wrapper p-5 h-auto table-docentes-visualizer"
            style={{ marginTop: "-40px" }}
          >
            <div className=" overflow-x-auto max-w-full">
              <DataTable
                columns={columns}
                data={filteredRecords}
                selectableRows
                selectableRowsSingle
                pagination
                paginationPerPage={5}
                onSelectedRowsChange={(state) => {
                  setSelectedRows(state);
                  setMostrarOpciones(state.selectedRows[0]);
                }}
                fixedHeader
                progressPending={loading}
                customStyles={customStyles}
              />
            </div>
          </div>
        </div>

        {/* Aviso de Eliminacion*/}
        <Modal
          isOpen={showEliminarAviso}
          onRequestClose={() => setShowEliminarAviso(false)}
          contentLabel="Eliminar Estudiante"
          className="absolute  top-1/4 left-1/2"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <div
            className="absolute bg-blue-900 z-50 rounded-lg flex flex-col justify-center items-center p-6 w-96"
            style={{ marginLeft: "-90px", marginTop: "70px" }}
          >
            <div className="mb-8 text-white text-center poppins text-[25px] m-6">
              <h2 className="mb-8 text-white text-center poppins text-[25px] m-6">
                ¿Estás seguro que deseas inhabilitar?
              </h2>
            </div>
            <div className="flex justify-center space-x-4">
              <button
                className="bg-green-600 py-2 px-4 rounded-lg hover:bg-green-900 text-white flex items-center"
                onClick={() => {
                  handleDeleteStudent(selectedStudents._id);
                  setShowEliminarAviso(false);
                  location.reload();
                }}
              >
                <FaCheck className="w-6 mr-2" />
                Si, inhabilitar
              </button>
              <button
                className="bg-red-600 py-2 px-4 rounded-lg hover:bg-red-900 text-white flex items-center"
                onClick={() => setShowEliminarAviso(false)}
              >
                <IoClose className="w-6 mr-2" />
                Cancelar
              </button>
            </div>
          </div>
        </Modal>

        {/* Aviso de Resubir*/}
        <Modal
          isOpen={showReloadAviso}
          onRequestClose={() => setShowReloadAviso(false)}
          contentLabel="Eliminar Estudiante"
          className="absolute top-1/4 left-1/2"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <div
            className="absolute bg-blue-900 z-50 rounded-lg flex flex-col justify-center items-center p-6 w-96"
            style={{ marginLeft: "-90px", marginTop: "70px" }}
          >
            <div className="mb-8 text-white text-center poppins text-[25px] m-6">
              <h2 className="mb-8 text-white text-center poppins text-[25px] m-6">
                ¿Estás seguro que deseas habilitar?
              </h2>
            </div>
            <div className="flex justify-center space-x-4">
              <button
                className="bg-green-600 py-2 px-4 rounded-lg hover:bg-green-900 text-white flex items-center"
                onClick={() => {
                  handleReloadEstudiante(selectedStudents._id);
                  setShowReloadAviso(false);
                  location.reload();
                }}
              >
                <FaCheck className="w-6 mr-2" />
                Si, habilitar
              </button>
              <button
                className="bg-red-600 py-2 px-4 rounded-lg hover:bg-red-900 text-white flex items-center"
                onClick={() => setShowEliminarAviso(false)}
              >
                <IoClose className="w-6 mr-2" />
                Cancelar
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
}

export default Students;
