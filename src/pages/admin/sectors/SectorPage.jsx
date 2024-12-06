import { useSectores } from "../../../context/SectorContext"; //acomodar
import { useEffect } from "react";
import React, { useState } from "react";

import axios from "axios";
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import { FaCalendarAlt } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { FaCheck, FaEye } from "react-icons/fa";
import DataTable from "react-data-table-component";
import Modal from "react-modal";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";
import { VscEdit, VscTrash } from "react-icons/vsc";
import { MdSaveAlt } from "react-icons/md";
import { record } from "zod";
import { MdOutlineRestartAlt } from "react-icons/md";

Modal.setAppElement("#root"); // Necesario para accesibilidad

function SectorPage() {
  const { getSectores, sectores, deleteSector, createSector, updateSector } =
    useSectores();

  useEffect(() => {
    getSectores();
  }, []);

  const [selectedSectors, setSelectedSectors] = useState(null); // []
  const [showDiv, setShowDiv] = useState(false);
  const [sectorEvents, setSectorEvents] = useState([]);
  const [showInhabilitarAviso, setShowInhabilitarAviso] = useState(false);
  const [showHabilitarAviso, setShowHabilitarAviso] = useState(false);
  const [showCrearAviso, setShowCrearAviso] = useState(false);
  const [showEditarAviso, setEditarAviso] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    console.log("Estado del modal:", showModal);
  }, [showModal]);

  const handleDeleteSector = async (id) => {
    try {
      console.log("ID del sector a eliminar:", id);
      await axios.delete(`https://back-ingsoft-nzbv.onrender.com/api/sectores/${id}`);
      location.reload();
    } catch (error) {
      if (error.response && error.response.status === 400) {
        // Si la respuesta del backend es un error debido a los cursos activos o eventos no pasados
        alert(error.response.data.message); // Muestra el mensaje de error al usuario
        location.reload();
      } else {
        alert(
          "Hubo un problema al intentar desactivar el curso. Intenta más tarde."
        );
      }
    }
  };

  const handleEliminarClick = () => {
    if (selectedRows.selectedRows.length === 0) {
      alert("Por favor, seleccione un sector para eliminar");
    } else {
      const P1 = selectedRows.selectedRows[0].id;
      const sector = records.find((record) => record._id === P1);
      setSelectedSectors(sector);
      setShowInhabilitarAviso(true);
    }
  };

  const handleReloadClick = () => {
    if (selectedRows.selectedRows.length === 0) {
      alert("Por favor, seleccione un sector para eliminar");
    } else {
      const P1 = selectedRows.selectedRows[0].id;
      const sector = records.find((record) => record._id === P1);
      setSelectedSectors(sector);
      setShowHabilitarAviso(true);
    }
  };

  const handleEditarClick = () => {
    if (selectedRows.selectedRows.length === 0) {
      alert("Por favor, seleccione un sector para editar");
    } else {
      const P1 = selectedRows.selectedRows[0].id;
      const sector = records.find((record) => record._id === P1);
      setSelectedSectors(sector);
      setEditarAviso(true);
    }
  };

  const handleVisualizarClick = async () => {
    try {
      if (selectedRows.selectedRows.length === 0) {
        alert("Por favor, seleccione un sector para eliminar");
      } else {
        const P1 = selectedRows.selectedRows[0].id;
        const sector = records.find((record) => record._id === P1);
        console.log("Sector seleccionado para visualizar eventos:", sector);
        setSelectedSectors(sector);
        const response = await axios.get(
          `https://back-ingsoft-nzbv.onrender.com/api/sectores/${sector.nombre}/eventos`
        );
        console.log("Eventos del sector:", response.data);
        setSectorEvents(response.data); // Suponiendo que tu API devuelve los eventos del sector
        console.log("Intentando abrir el modal");
        setShowModal(true);
      }
    } catch (error) {
      console.error("Error fetching sector events:", error);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSectorEvents([]);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://back-ingsoft-nzbv.onrender.com/api/sectores");
        const sectores = await Promise.all(
          response.data.map(async (item) => {
            return {
              ...item,
              id: item._id,
              numero: item.numero,
              nombre: item.nombre,
              barrio: item.barrio,
              direccion: item.direccion,
            };
          })
        );
        setRecords(sectores);
        setFilteredRecords(sectores);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  //variables tabla

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
        record.barrio.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.direccion.toString().includes(searchTerm)
    );
    setFilteredRecords(filtered);
  }, [searchTerm, records]);

  const columns = [
    { name: "N° Sector", selector: (row) => row.numero, sortable: true },
    { name: "Nombre", selector: (row) => row.nombre, sortable: true },
    { name: "Barrio", selector: (row) => row.barrio, sortable: true },
    { name: "Direccion", selector: (row) => row.direccion, sortable: true },
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

  const customStyles = {
    headCells: {
      style: {
        fontSize: "20px",
        fontWeight: "bold",
      },
    },
    rows: {
      style: {
        fontSize: "14px",
      },
    },
    table: {
      style: {
        borderRadius: "10px",
        overflow: "hidden",
        width: 1100, // Ajusta el ancho de la tabla
      },
    },
  };
  const sectorExistenteNumero = async (numero) => {
    try {
      const response = await axios.get("https://back-ingsoft-nzbv.onrender.com/api/sectores");
      const sectores = response.data;

      // Verificar si el correo está en la lista de usuarios
      const sectoresEncontrados = sectores.some(
        (sector) => sector.numero === numero
      );
      return sectoresEncontrados;
    } catch (error) {
      console.error("Error al verificar el correo:", error);
      return false;
    }
  };

  const sectorExistenteNombre = async (nombre) => {
    try {
      const response = await axios.get("https://back-ingsoft-nzbv.onrender.com/api/sectores");
      const sectores = response.data;

      // Verificar si el correo está en la lista de usuarios
      const sectoresEncontrados = sectores.some(
        (sector) => sector.nombre.toLowerCase() === nombre.toLowerCase()
      );
      return sectoresEncontrados;
    } catch (error) {
      console.error("Error al verificar el correo:", error);
      return false;
    }
  };

  const sectorExistenteDireccionBarrio = async (direccion, barrio, id) => {
    try {
      const response = await axios.get("https://back-ingsoft-nzbv.onrender.com/api/sectores");
      const sectores = response.data;

      // Verificar si existe un sector con la misma dirección y barrio, excluyendo el sector actual si el ID no es null
      const coincidenciaExacta = sectores.some(
        (sector) =>
          sector.direccion.toLowerCase() === direccion.toLowerCase() &&
          sector.barrio.toLowerCase() === barrio.toLowerCase() &&
          (id ? sector._id !== id : true) // Excluir el sector actual solo si ID no es null
      );

      return { coincidenciaExacta };
    } catch (error) {
      console.error("Error al verificar el sector existente:", error);
      return { coincidenciaExacta: false };
    }
  };

  // Esquema de validación
  const validationSchemaEditar = Yup.object().shape({
    barrio: Yup.string()
      .max(50, "El barrio no puede tener más de 50 caracteres")
      .matches(/^[A-Za-z ]+$/, "Solo letras permitidas")
      .required("El barrio es requerido"),

    direccion: Yup.string()
      .required("La dirección es requerida")
      .test(
        "check-duplicado-direccion-barrio",
        "Esta combinación de dirección y barrio ya está asignada a otro sector",
        async function (direccion) {
          const { barrio } = this.parent;

          // Verifica si la dirección o barrio han cambiado
          if (
            selectedSectors.direccion.toLowerCase() ===
              direccion.toLowerCase() &&
            selectedSectors.barrio.toLowerCase() === barrio.toLowerCase()
          ) {
            return true; // No es necesario verificar si no hay cambios
          }

          const { coincidenciaExacta } = await sectorExistenteDireccionBarrio(
            direccion,
            barrio,
            selectedSectors._id // Asegúrate de pasar el ID para excluir el registro actual
          );
          return !coincidenciaExacta;
        }
      ),
  });

  const validationSchema = Yup.object().shape({
    numero: Yup.string()
      .required("El número es requerido")
      .test("check-duplicado", "Número de Sector Existente", async (numero) => {
        const response = await axios.get("https://back-ingsoft-nzbv.onrender.com/api/sectores");
        return !response.data.some((sector) => sector.numero === numero);
      }),
    nombre: Yup.string()
      .max(50, "El nombre no puede tener más de 50 caracteres")
      .matches(/^[A-Za-z ]+$/, "Solo letras permitidas")
      .required("El nombre es requerido")
      .test("check-duplicado", "Nombre Existente", async (nombre) => {
        const response = await axios.get("https://back-ingsoft-nzbv.onrender.com/api/sectores");
        return !response.data.some(
          (sector) => sector.nombre.toLowerCase() === nombre.toLowerCase()
        );
      }),
    barrio: Yup.string()
      .max(50, "El barrio no puede tener más de 50 caracteres")
      .matches(/^[A-Za-z ]+$/, "Solo letras permitidas")
      .required("El barrio es requerido"),
    direccion: Yup.string()
      .required("La dirección es requerida")
      .test(
        "check-duplicado-direccion-barrio",
        "Esta combinación de barrio y dirección ya existe",
        async function (direccion) {
          const { barrio } = this.parent;
          console.log(barrio);
          const response = await axios.get(
            "https://back-ingsoft-nzbv.onrender.com/api/sectores"
          );
          const exists = response.data.some(
            (sector) =>
              sector.direccion.toLowerCase() === direccion.toLowerCase() &&
              sector.barrio.toLowerCase() === barrio.toLowerCase() &&
              sector._id !== (selectedSectors ? selectedSectors._id : null)
          );
          return !exists;
        }
      ),
  });

  const formatDate = (date) => {
    const d = new Date(date);
    return isNaN(d.getTime()) ? "Fecha inválida" : d.toLocaleDateString();
  };

  // Función para formatear la hora
  const formatTime = (time) => {
    if (!time) return "Hora inválida";
    // Crear una fecha arbitraria para combinar con la hora
    const timeParts = time.split(":");
    if (timeParts.length === 2) {
      const [hours, minutes] = timeParts;
      const date = new Date();
      date.setHours(parseInt(hours, 10));
      date.setMinutes(parseInt(minutes, 10));
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true, // Mostrar la hora en formato de 12 horas
      });
    }
    return "Hora inválida";
  };

  return (
    <>
      <div className="flex flex-col items-center mt-2 gap-4 min-h-screen">
        {/*tabla de sectores*/}
        <div className="mb-6">
          <h1 className="text-[38px] text-center font-bold">
            {" "}
            Sectores Registrados
          </h1>
        </div>
        <div className="search-bar-jugadores" style={{ marginTop: "-20px" }}>
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
                className="flex items-center bg-green-600 hover:bg-green-700 text-white text-sm py-2 px-3 rounded mr-5"
                onClick={() => handleEditarClick()}
              >
                <VscEdit size="30px" className="w-5 md:w-6" />
              </div>
              <div
                className="flex items-center bg-yellow-600 hover:bg-yellow-700 text-white text-sm py-2 px-3 rounded mr-5 cursor-pointer"
                onClick={() => handleVisualizarClick()}
              >
                <FaEye size="30px" className="w-5 md:w-6" />
              </div>
              {mostrarOpciones.estado === "ACTIVO" ? (
                <div
                className="flex items-center bg-red-500 hover:bg-red-700 text-white text-sm py-2 px-3 rounded"
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
            className="outer-wrapper p-5 h-auto"
            style={{ marginTop: "-40px" }}
          >
            <div className="overflow-x-auto overflow-y-auto rounded-lg">
              <DataTable
                columns={columns}
                data={filteredRecords}
                selectableRows
                selectableRowsSingle
                pagination
                paginationPerPage={4}
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

          <div className=" flex justify-center">
            <button
              className="bg-yellow-900 py-4 px-6 rounded-lg hover:bg-yellow-500  poppins  items-center w-96"
              onClick={() => setShowCrearAviso(true)}
            >
              <div className="flex justify-center text-white carrois-gothicSC text-xl">
                {" "}
                <PlusCircleIcon className="w-6 mr-2" /> Ingresar Sector{" "}
              </div>
            </button>{" "}
          </div>
        </div>

        {/* Aviso de Eliminacion*/}
        <Modal
          isOpen={showHabilitarAviso}
          onRequestClose={() => setShowHabilitarAviso(false)}
          contentLabel="Eliminar Sector"
          className="absolute  top-1/4 left-1/2"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <div
            className="absolute bg-blue-900 z-50 rounded-lg flex flex-col justify-center items-center p-6 w-96"
            style={{ marginLeft: "-90px", marginTop: "70px" }}
          >
            {" "}
            <div className="mb-8 text-white text-center poppins text-[25px] m-6">
              <h2 className="mb-8 text-white text-center poppins text-[25px] m-6">
                ¿Estás seguro que deseas habilitar el sector?
              </h2>
            </div>
            <div className="flex justify-center space-x-4">
              <button
                className="bg-green-600 py-2 px-4 rounded-lg hover:bg-green-900 text-white flex items-center"
                onClick={() => {
                  handleDeleteSector(selectedSectors._id);
                  setShowHabilitarAviso(false);
                  location.reload();
                }}
              >
                <FaCheck className="w-6 mr-2" />
                Si, Habilitar
              </button>
              <button
                className="bg-red-600 py-2 px-4 rounded-lg hover:bg-red-900 text-white flex items-center"
                onClick={() => setShowHabilitarAviso(false)}
              >
                <IoClose className="w-6 mr-2" />
                Cancelar
              </button>
            </div>
          </div>
        </Modal>
        {/* Aviso de Eliminacion*/}
        <Modal
          isOpen={showInhabilitarAviso}
          onRequestClose={() => setShowInhabilitarAviso(false)}
          contentLabel="Eliminar Sector"
          className="absolute  top-1/4 left-1/2"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <div
            className="absolute bg-blue-900 z-50 rounded-lg flex flex-col justify-center items-center p-6 w-96"
            style={{ marginLeft: "-90px", marginTop: "70px" }}
          >
            {" "}
            <div className="mb-8 text-white text-center poppins text-[25px] m-6">
              <h2 className="mb-8 text-white text-center poppins text-[25px] m-6">
                ¿Estás seguro que deseas inhabilitar el sector?
              </h2>
            </div>
            <div className="flex justify-center space-x-4">
              <button
                className="bg-green-600 py-2 px-4 rounded-lg hover:bg-green-900 text-white flex items-center"
                onClick={() => {
                  handleDeleteSector(selectedSectors._id);
                  setShowInhabilitarAviso(false);
                  location.reload();
                }}
              >
                <FaCheck className="w-6 mr-2" />
                Si, Inhabilitar
              </button>
              <button
                className="bg-red-600 py-2 px-4 rounded-lg hover:bg-red-900 text-white flex items-center"
                onClick={() => setShowInhabilitarAviso(false)}
              >
                <IoClose className="w-6 mr-2" />
                Cancelar
              </button>
            </div>
          </div>
        </Modal>
        <Modal
          isOpen={showModal}
          onRequestClose={closeModal}
          className="absolute bg-white p-6 rounded-lg w-full max-w-4xl top-1/4"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Eventos del Sector</h2>
            <button onClick={closeModal} className="text-xl">
              <IoClose />
            </button>
          </div>

          {/* Cards de eventos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sectorEvents.map((evento) => (
              <div
                key={evento.id}
                className="bg-gray-200 p-4 rounded-lg flex flex-col justify-between"
              >
                <div className="flex items-center mb-2">
                  <FaCalendarAlt className="mr-2 text-xl" />
                  <span className="font-bold">{evento.nombre_curso}</span>
                </div>

                <p className="text-sm mb-2">
                  Fecha: {formatDate(evento.fecha)}
                </p>
                <p className="text-sm mb-2">Hora: {formatTime(evento.hora)}</p>
              </div>
            ))}
          </div>
        </Modal>

        {/* Aviso de crear*/}
        <Modal
          isOpen={showCrearAviso}
          onRequestClose={() => setShowCrearAviso(false)}
          contentLabel="Crear Sector"
          className="  top-50 left-1/2"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <div className=" bg-blue-900  z-50  rounded-lg flex flex-col justify-center items-center p-6 w-96">
            <div className=" text-white text-center poppins text-[25px] ">
              <h2 className=" text-white text-center poppins text-[25px] m-6">
                INGRESAR SECTOR
              </h2>
            </div>

            <Formik
              initialValues={{
                numero: "",
                nombre: "",
                direccion: "",
                barrio: "",
              }}
              enableReinitialize={true}
              validationSchema={validationSchema}
              onSubmit={async (values, { setSubmitting, resetForm }) => {
                try {
                  values.nombre =
                    values.nombre.charAt(0).toUpperCase() +
                    values.nombre.slice(1);
                  console.log("voy a crear esto ", values);
                  await createSector(values);
                  resetForm();
                  setShowCrearAviso(false);
                  location.reload();
                } catch (error) {
                  console.error("Error al crear el entrenador:", error);
                }
                setSubmitting(false);
              }}
            >
              {({
                handleChange,
                handleSubmit,
                errors,
                touched,
                isSubmitting,
                values,
              }) => (
                <Form onSubmit={handleSubmit}>
                  <div className="justify-center m-2">
                    <div
                      className={`flex m-4 items-center ${
                        errors.numero ? "mb-0" : "mb-4"
                      }`}
                    >
                      <input
                        type="text"
                        placeholder="Numero"
                        className="m-2 ml-3 h-12 rounded-lg bg-gray-700 text-white w-full pl-4"
                        name="numero"
                        onChange={handleChange}
                      />
                    </div>
                    {errors.numero && touched.numero && (
                      <div className="text-red-500 justify-center text-center">
                        {errors.numero}
                      </div>
                    )}

                    <div
                      className={`flex m-4 items-center ${
                        errors.nombre ? "mb-0" : "mb-4"
                      }`}
                    >
                      <input
                        type="text"
                        placeholder="Nombre"
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
                        errors.direccion ? "mb-0" : "mb-4"
                      }`}
                    >
                      <input
                        type="text"
                        className="m-2 h-12 ml-3 rounded-lg bg-gray-700 text-white w-full pl-4"
                        placeholder="Direccion"
                        name="direccion"
                        onChange={handleChange}
                      />
                    </div>
                    {errors.direccion && touched.direccion && (
                      <div className="text-red-500 justify-center text-center">
                        {errors.direccion}
                      </div>
                    )}

                    <div
                      className={`flex m-4 items-center ${
                        errors.barrio ? "mb-0" : "mb-4"
                      }`}
                    >
                      <input
                        type="text"
                        className="m-2 h-12 ml-3 rounded-lg bg-gray-700 text-white w-full pl-4"
                        placeholder="Barrio"
                        name="barrio"
                        onChange={handleChange}
                      />
                    </div>
                    {errors.barrio && touched.barrio && (
                      <div className="text-red-500 justify-center text-center">
                        {errors.barrio}
                      </div>
                    )}

                    <div className="flex justify-center space-x-4 m-5 ">
                      <button
                        type="submit"
                        className="bg-yellow-700 py-2 px-4 rounded-lg hover:bg-yellow-600 text-white flex items-center"
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
                        onClick={() => setShowCrearAviso(false)}
                        className="bg-red-600 py-2 px-4 rounded-lg hover:bg-red-800 text-white flex items-center"
                      >
                        <IoClose className="w-6 mr-2" />
                        <span className="">Cancelar</span>
                      </button>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </Modal>

        {/* Aviso de Editar*/}
        <Modal
          isOpen={showEditarAviso}
          onRequestClose={() => setEditarAviso(false)}
          contentLabel="Editar Sector"
          className="  top-50 left-1/2"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <div className=" bg-blue-900  z-50  rounded-lg flex flex-col justify-center items-center p-6 w-96">
            <div className=" text-white text-center poppins text-[25px] ">
              <h2 className=" text-white text-center poppins text-[25px] m-6">
                EDITAR SECTOR
              </h2>
            </div>

            <Formik
              initialValues={{
                numero: selectedSectors?.numero || "",
                nombre: selectedSectors?.nombre || "",
                direccion: selectedSectors?.direccion || "",
                barrio: selectedSectors?.barrio || "",
              }}
              enableReinitialize={true}
              validationSchema={validationSchemaEditar}
              onSubmit={async (values, { setSubmitting, resetForm }) => {
                try {
                  console.log("Valores finales antes de enviar:", values);
                  await updateSector(selectedSectors._id, values);
                  setEditarAviso(false);
                  resetForm();
                  location.reload(); // Refresca la lista de sectores
                } catch (error) {
                  console.error("Error al actualizar el sector:", error);
                }
                setSubmitting(false);
              }}
            >
              {({
                handleChange,
                handleSubmit,
                errors,
                touched,
                isSubmitting,
                values,
              }) => (
                <Form onSubmit={handleSubmit}>
                  <div className="justify-center m-2">
                    <div
                      className={`flex m-4 items-center ${
                        errors.numero ? "mb-0" : "mb-4"
                      }`}
                    >
                      <input
                        type="text"
                        placeholder="Numero"
                        className="m-2 ml-3 h-12 rounded-lg bg-gray-700 text-white w-full pl-4"
                        name="numero"
                        value={values.numero}
                        onChange={handleChange}
                        disabled
                      />
                    </div>

                    <div
                      className={`flex m-4 items-center ${
                        errors.nombre ? "mb-0" : "mb-4"
                      }`}
                    >
                      <input
                        type="text"
                        placeholder="Nombre"
                        className="m-2 ml-3 h-12 rounded-lg bg-gray-700 text-white w-full pl-4"
                        name="nombre"
                        value={values.nombre}
                        onChange={handleChange}
                        disabled
                      />
                    </div>
                    {errors.nombre && touched.nombre && (
                      <div className="text-red-500 justify-center text-center">
                        {errors.nombre}
                      </div>
                    )}

                    <div
                      className={`flex m-4 items-center ${
                        errors.barrio ? "mb-0" : "mb-4"
                      }`}
                    >
                      <input
                        type="text"
                        className="m-2 h-12 ml-3 rounded-lg bg-gray-700 text-white w-full pl-4"
                        placeholder="Barrio"
                        name="barrio"
                        value={values.barrio}
                        onChange={handleChange}
                      />
                    </div>
                    {errors.barrio && touched.barrio && (
                      <div className="text-red-500 justify-center text-center">
                        {errors.barrio}
                      </div>
                    )}

                    <div
                      className={`flex m-4 items-center ${
                        errors.direccion ? "mb-0" : "mb-4"
                      }`}
                    >
                      <input
                        type="text"
                        className="m-2 h-12 ml-3 rounded-lg bg-gray-700 text-white w-full pl-4"
                        placeholder="Direccion"
                        name="direccion"
                        value={values.direccion}
                        onChange={handleChange}
                      />
                    </div>
                    {errors.direccion && touched.direccion && (
                      <div className="text-red-500 justify-center text-center">
                        {errors.direccion}
                      </div>
                    )}

                    <div className="flex justify-center space-x-4 m-5 ">
                      <button
                        type="submit"
                        className="bg-yellow-600 py-2 px-4 rounded-lg hover:bg-yellow-700 text-white flex items-center"
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
                        onClick={() => setEditarAviso(false)}
                        className="bg-red-600 py-2 px-4 rounded-lg hover:bg-red-800 text-white flex items-center"
                      >
                        <IoClose className="w-6 mr-2" />
                        <span className="">Cancelar</span>
                      </button>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </Modal>
      </div>
    </>
  );
}

export default SectorPage;
