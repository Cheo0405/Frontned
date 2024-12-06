import { useForm } from "react-hook-form";
import { useTeacher } from "../../../context/TeacherContext.jsx";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaUser, FaPhoneAlt } from "react-icons/fa";
import { HiIdentification } from "react-icons/hi2";
import { MdEmail } from "react-icons/md";
import { TbLock } from "react-icons/tb";
import { IoIosSave } from "react-icons/io";
import "../../../components/styles/RegisterDocente.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import user from "../../../assets/user.png";

const ModalContent = ({ closeModal }) => (
  <div className="bg-blue-600 p-4 rounded-md">
    <p className="text-white text-xl font-semibold mb-4">¡Registro exitoso!</p>
    <p>La información del Docente ha sido actualizada correctamente.</p>
    <button
      onClick={() => {
        closeModal();
      }}
      className="bg-white text-blue py-2 px-4 rounded-lg mt-4"
    >
      Cerrar
    </button>
  </div>
);

function EditTeacherPage() {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false); // Estado para indicar carga

  const [docente, setDocente] = useState({
    id: "",
    identificacion: "",
    nombre: "",
    apellido: "",
    correo: "",
    telefono: "",
    imagen: "",
  });

  const {
    update,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { getTeacher, updateTeacher, errors: registerErrors } = useTeacher();
  const navigate = useNavigate();

  const inputRef = useRef(null);

  const [selectedImage, setSelectedImage] = useState(user);
  const [showModal, setShowModal] = useState(false);

  const handleImageClick = () => {
    inputRef.current.click();
  };

  useEffect(() => {
    const loadDocente = async () => {
      if (id) {
        try {
          const docenteObtenido = await getTeacher(id);
          console.log("docenteObtenido: ", docenteObtenido);
          setDocente({
            id: docenteObtenido._id,
            identificacion: docenteObtenido.identificacion,
            nombre: docenteObtenido.nombre,
            apellido: docenteObtenido.apellido,
            correo: docenteObtenido.correo,
            telefono: docenteObtenido.telefono,
            imagen: docenteObtenido.image.url,
          });

          // Solo actualiza selectedImage si la imagen está disponible
          if (docenteObtenido.image.url) {
            setSelectedImage(docenteObtenido.image.url);
          }
        } catch (error) {
          console.error("Error al cargar el docente:", error);
        }
      }
    };
    loadDocente();
  }, [id]); // Asegúrate de que el efecto se ejecute solo cuando `id` cambie

  const handleImageChange = (event, setFieldValue) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);

      setFieldValue("image", file);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    navigate(`/ADMINISTRADOR`);
  };

  const onSubmit = handleSubmit(async (values) => {
    try {
      signup(values);
      console.log(values);
      setShowModal(true);
    } catch (error) {
      console.error("Error al Registrar:", error);
    }
  });

  return (
    <div className="flex flex-col items-center justify-center mt-0">
      <div>
        <h1 className="text-4xl font-bold my-5 text-center tittle-edit mt-6">
          Actualizar Información Personal
        </h1>
        <br></br>
        {Array.isArray(registerErrors) &&
          registerErrors.map((error, i) => (
            <div className="bg-red-500 p-2 text-white text-center" key={i}>
              {error}
            </div>
          ))}
        <Formik
          initialValues={{
            identificacion: docente.identificacion,
            nombre: docente.nombre,
            apellido: docente.apellido,
            telefono: docente.telefono,
            correo: docente.correo,
            image: docente.imagen,
          }}
          enableReinitialize
          validationSchema={Yup.object({
            identificacion: Yup.string().required(
              "Identificación es requerida"
            ),
            nombre: Yup.string().required("Nombre es requerido"),
            apellido: Yup.string().required("Apellido es requerido"),
            telefono: Yup.string().required("Teléfono es requerido"),
            correo: Yup.string()
              .email("Formato de correo no válido")
              .required("Correo es obligatorio"),
            image: Yup.mixed().required("La imagen es requerida"),
          })}
          onSubmit={async (values, actions) => {
            console.log("información del formulario", values);
            await updateTeacher(values);
            setShowModal(true);
          }}
        >
          {({ handleSubmit, setFieldValue }) => (
            <Form
              onSubmit={handleSubmit}
              className="flex flex-col items-center"
            >
              <div className="content-form bg-opacity-50 w-auto p-10 rounded-md flex justify-center">
                {/* Columna izquierda */}
                <div className="flex flex-col items-center text-white mr-4">
                  <div className="flex items-center mb-2">
                    <div className="text-white mr-2">
                      <HiIdentification className="w-6 h-6" />
                    </div>
                    <Field
                      type="text"
                      name="identificacion"
                      className="w-96 bg-zinc-700 text-white px-4 py-2 rounded-md my-2 h-14"
                      placeholder="Número de Identificación"
                      pattern="[0-9]*"
                      readOnly={true}
                    />
                  </div>
                  <ErrorMessage
                    name="identificacion"
                    component="p"
                    className="text-red-500"
                  />

                  <div className="flex items-center mb-2">
                    <div className="text-white mr-2">
                      <FaUser className="w-6 h-6" />
                    </div>
                    <Field
                      type="text"
                      name="nombre"
                      className="w-96 bg-zinc-700 text-white px-4 py-2 rounded-md my-2 h-14"
                      placeholder="Nombre"
                      pattern="[A-Za-zñÑáéíóúÁÉÍÓÚ\s]*"
                    />
                  </div>
                  <ErrorMessage
                    name="nombre"
                    component="p"
                    className="text-red-500"
                  />

                  <div className="flex items-center mb-2">
                    <div className="text-white mr-2">
                      <FaUser className="w-6 h-6" />
                    </div>
                    <Field
                      type="text"
                      name="apellido"
                      className="w-96 bg-zinc-700 text-white px-4 py-2 rounded-md my-2 h-14"
                      placeholder="Apellido"
                      pattern="[A-Za-zñÑáéíóúÁÉÍÓÚ\s]*"
                    />
                  </div>
                  <ErrorMessage
                    name="apellido"
                    component="p"
                    className="text-red-500"
                  />

                  <div className="flex items-center mb-2">
                    <div className="text-white mr-2">
                      <FaPhoneAlt className="w-6 h-6" />
                    </div>
                    <Field
                      type="text"
                      name="telefono"
                      className="w-96 bg-zinc-700 text-white px-4 py-2 rounded-md my-2 h-14"
                      placeholder="Teléfono"
                      pattern="[0-9]*"
                    />
                  </div>
                  <ErrorMessage
                    name="telefono"
                    component="p"
                    className="text-red-500"
                  />

                  <div className="flex items-center mb-2">
                    <div className="text-white mr-2">
                      <MdEmail className="w-6 h-6" />
                    </div>
                    <Field
                      type="email"
                      name="correo"
                      className="w-96 bg-zinc-700 text-white px-4 py-2 rounded-md my-2 h-14"
                      placeholder="Correo Electrónico"
                    />
                  </div>
                  <ErrorMessage
                    name="correo"
                    component="p"
                    className="text-red-500"
                  />
                </div>
                {/* Columna derecha */}
                <div className="flex flex-col items-center text-white ml-10">
                  <label>Imagen</label>
                  <br></br>
                  <div onClick={handleImageClick} className="image-container">
                    <input
                      type="file"
                      name="image"
                      onChange={(e) => handleImageChange(e, setFieldValue)}
                      ref={inputRef}
                      style={{ display: "none" }}
                    />
                    <img
                      src={selectedImage}
                      alt="Selected"
                      style={{
                        width: "200px",
                        height: "200px",
                        marginTop: "-15px",
                      }}
                    />
                  </div>
                  <ErrorMessage
                    component="p"
                    name="image"
                    className="text-red-400 text-sm"
                  />
                </div>
              </div>

              {/* Botón de envío */}
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:text-custom-brown2 poppins mt-4"
                type="submit"
              >
                <div className="flex">
                  Guardar <IoIosSave className="ml-4 mt-1" />
                </div>
              </button>
            </Form>
          )}
        </Formik>
      </div>
      {showModal && (
        <div className="fixed top-42 left-120 flex items-center justify-center ml-90">
          <ModalContent closeModal={closeModal} />
        </div>
      )}
    </div>
  );
}

export default EditTeacherPage;