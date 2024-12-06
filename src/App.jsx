import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { SectorProvider } from "./context/SectorContext";
import { StudentProvider } from "./context/StudentContext";
import { EventoProvider } from "./context/EventoContext";
import { CursoProvider } from "./context/CursoContext";
import { DocenteProvider } from "./context/DocentesContext";
import LoginPage from "./pages/LoginPage";
import SendEmailPage from "./pages/SendEmailPage";
import ResetPasswordPage from "./pages/ResetPasswordpage";
import CreatePasswordPage from "./pages/CreatePasswordpage";
import HomePage from "./pages/HomePage";
import ProtectedRoute from "./ProtectedRoute";
import IndexAdmin from "./pages/admin/IndexAdmin";
import AdminLayout from "./pages/admin/Layout";
import SectorPage from "./pages/admin/sectors/SectorPage";
import TeacherPage from "./pages/admin/teachers/TeacherPage";
import RegisterTeacherPage from "./pages/admin/teachers/RegisterTeacherPage";
import RegisterSectorPage from "./pages/admin/sectors/RegisterSectorPage";
import Notifications from "./pages/admin/notifications/Notifications";
import Students from "./pages/admin/students/Students";
import Events from "./pages/admin/events/Events";
import Courses from "./pages/admin/courses/Courses";
import CrearStudent from "./pages/docente/estudiantes/CrearStudent";
import EditarStudent from "./pages/admin/students/EditarStudent";
import CrearDocente from "./pages/admin/teachers/CrearDocente";
import EditarDocente from "./pages/admin/teachers/EditarDocente";
import IndexDocente from "./pages/docente/IndexDocente";
import DocenteLayout from "./pages/docente/Layout";
import DocenteEventos from "./pages/docente/events/eventos";
import DetallesEventos from "./pages/docente/events/verEventos"; //cambio
import InformacionDocente from "./pages/docente/informacionDocente";
import CursosDocente from "./pages/docente/courses/Courses";
import DetallesCurso from "./pages/docente/courses/detallesCurso";
import DetallesDocente from "./pages/admin/teachers/docenteDetalles";
import DetallesEstudiante from "./pages/admin/students/estudianteDetalles";
import DetallesCursoAdmi from "./pages/admin/courses/detallesCursoAdmi";
import DetallesEventoAdmi from "./pages/admin/events/detallesEventos";
import HorarioEventos from "./pages/admin/events/HorarioEventos";
import HorarioEventosDocente from "./pages/docente/events/HorarioEventos";
import IndexEstudiante from "./pages/estudiante/IndexEstudiante";
import EstudianteLayout from "./pages/estudiante/Layout";
import DetallesCursoEstudiante from "./pages/estudiante/cursos/detallesCurso";
import DetallesActividadEstudiante from "./pages/estudiante/cursos/detallesActividad";
import DetallesActividadDocente from "./pages/docente/courses/detallesActividad";

function App() {
  return (
    <AuthProvider>
      <DocenteProvider>
        <CursoProvider>
          <EventoProvider>
            <SectorProvider>
              <StudentProvider>
                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/send-email" element={<SendEmailPage />} />
                    <Route
                      path="/reset-password/:cedula/:token"
                      element={<ResetPasswordPage />}
                    />
                    <Route
                      path="/create-password/:cedula/:token"
                      element={<CreatePasswordPage />}
                    />

                    <Route element={<ProtectedRoute />}>
                      <Route
                        path="/administrador"
                        element={
                          <AdminLayout>
                            {" "}
                            <IndexAdmin />{" "}
                          </AdminLayout>
                        }
                      />
                      <Route
                        path="/administrador/notificaciones"
                        element={
                          <AdminLayout>
                            {" "}
                            <Notifications />{" "}
                          </AdminLayout>
                        }
                      />
                      <Route
                        path="/administrador/sectores"
                        element={
                          <AdminLayout>
                            {" "}
                            <SectorPage />{" "}
                          </AdminLayout>
                        }
                      />
                      <Route
                        path="/administrador/sectores/register"
                        element={
                          <AdminLayout>
                            {" "}
                            <RegisterSectorPage />{" "}
                          </AdminLayout>
                        }
                      />
                      <Route
                        path="/administrador/docentes"
                        element={
                          <AdminLayout>
                            {" "}
                            <TeacherPage />{" "}
                          </AdminLayout>
                        }
                      />
                      <Route
                        path="/administrador/docentes/register"
                        element={
                          <AdminLayout>
                            {" "}
                            <CrearDocente />{" "}
                          </AdminLayout>
                        }
                      />
                      <Route
                        path="/administrador/docentes/details/:id"
                        element={
                          <AdminLayout>
                            {" "}
                            <DetallesDocente />{" "}
                          </AdminLayout>
                        }
                      />
                      <Route
                        path="/administrador/estudiantes/details/:id"
                        element={
                          <AdminLayout>
                            {" "}
                            <DetallesEstudiante />{" "}
                          </AdminLayout>
                        }
                      />
                      <Route
                        path="/administrador/cursos"
                        element={
                          <AdminLayout>
                            {" "}
                            <Courses />{" "}
                          </AdminLayout>
                        }
                      />
                      <Route
                        path="/administrador/cursos/:id"
                        element={
                          <AdminLayout>
                            {" "}
                            <DetallesCursoAdmi />{" "}
                          </AdminLayout>
                        }
                      />
                      <Route
                        path="/administrador/eventos"
                        element={
                          <AdminLayout>
                            {" "}
                            <Events />{" "}
                          </AdminLayout>
                        }
                      />
                      <Route
                        path="/administrador/eventos/horario"
                        element={
                          <AdminLayout>
                            {" "}
                            <HorarioEventos />{" "}
                          </AdminLayout>
                        }
                      />
                      <Route
                        path="/administrador/eventos/:id"
                        element={
                          <AdminLayout>
                            {" "}
                            <DetallesEventoAdmi />{" "}
                          </AdminLayout>
                        }
                      />
                      <Route
                        path="/administrador/estudiantes"
                        element={
                          <AdminLayout>
                            {" "}
                            <Students />{" "}
                          </AdminLayout>
                        }
                      />
                      <Route
                        path="/administrador/estudiantes/:ced"
                        element={
                          <AdminLayout>
                            {" "}
                            <EditarStudent />{" "}
                          </AdminLayout>
                        }
                      />
                      <Route
                        path="/administrador/docentes/:ced"
                        element={
                          <AdminLayout>
                            {" "}
                            <EditarDocente />{" "}
                          </AdminLayout>
                        }
                      />
                      <Route
                        path="/docente"
                        element={
                          <DocenteLayout>
                            <IndexDocente />
                          </DocenteLayout>
                        }
                      />
                      <Route
                        path="/docente/informacion"
                        element={
                          <DocenteLayout>
                            <InformacionDocente />
                          </DocenteLayout>
                        }
                      />
                      <Route
                        path="/docente/cursos"
                        element={
                          <DocenteLayout>
                            <CursosDocente />
                          </DocenteLayout>
                        }
                      />
                      <Route
                        path="/docente/cursos/:id"
                        element={
                          <DocenteLayout>
                            <DetallesCurso />
                          </DocenteLayout>
                        }
                      />
                      <Route
                        path="/docente/actividad/:id"
                        element={
                          <DocenteLayout>
                            <DetallesActividadDocente />
                          </DocenteLayout>
                        }
                      />
                      <Route
                        path="/docente/eventos"
                        element={
                          <DocenteLayout>
                            <DocenteEventos />
                          </DocenteLayout>
                        }
                      />
                      <Route
                        path="/docente/eventos/horario/:id"
                        element={
                          <DocenteLayout>
                            <HorarioEventosDocente />
                          </DocenteLayout>
                        }
                      />
                      <Route
                        path="/docente/vereventos/:id"
                        element={
                          <DocenteLayout>
                            <DetallesEventos />
                          </DocenteLayout>
                        }
                      />
                      <Route
                        path="/docente/estudiantes/registrar"
                        element={
                          <DocenteLayout>
                            {" "}
                            <CrearStudent />{" "}
                          </DocenteLayout>
                        }
                      />
                      <Route
                        path="/estudiante"
                        element={
                          <EstudianteLayout>
                            <IndexEstudiante />
                          </EstudianteLayout>
                        }
                      />
                      <Route
                        path="/estudiante/curso/:id"
                        element={
                          <EstudianteLayout>
                            <DetallesCursoEstudiante />
                          </EstudianteLayout>
                        }
                      />
                      <Route
                        path="/estudiante/actividad/:id"
                        element={
                          <EstudianteLayout>
                            <DetallesActividadEstudiante />
                          </EstudianteLayout>
                        }
                      />
                    </Route>
                  </Routes>
                </BrowserRouter>
              </StudentProvider>
            </SectorProvider>
          </EventoProvider>
        </CursoProvider>
      </DocenteProvider>
    </AuthProvider>
  );
}
export default App;
