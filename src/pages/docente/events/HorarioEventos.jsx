import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import axios from "axios";

function HorarioEventos() {
  const navigate = useNavigate();
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEntrenamientos = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        const user = storedUser ? JSON.parse(storedUser) : null;

        // Verifica que exista y tenga un id
        if (!user || !user.id) {
          console.error("No se encontró el usuario o el ID en el localStorage");
          return;
        }
        console.log(user);
        const data = await axios.post(`https://back-ingsoft-nzbv.onrender.com/api/eventos/docente/${user.id}`);
        console.log("Datos enviados:", data);
        setEventos(data.data);
      } catch (error) {
        console.error("Error fetching entrenamientos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEntrenamientos();
  }, []);

  const getStartOfWeek = () => moment().startOf("isoWeek").format("YYYY-MM-DD");
  const getEndOfWeek = () => moment().endOf("isoWeek").format("YYYY-MM-DD");

  const isInThisWeek = (date) => {
    const startOfWeek = moment().startOf("isoWeek").startOf("day");
    const endOfWeek = moment().endOf("isoWeek").endOf("day");
    return moment(date).isBetween(startOfWeek, endOfWeek, null, "[]");
  };

  const startOfWeek = moment().startOf("isoWeek");
  const fechasSemana = Array.from({ length: 6 }, (_, i) =>
    startOfWeek.clone().add(i, "days").format("YYYY-MM-DD")
  );

  const generarContenidoTabla = () => {
    const horasEntrenamiento = [
      "8:00",
      "9:00",
      "10:00",
      "11:00",
      "14:00",
      "15:00",
      "16:00",
      "17:00",
    ];
    const horatabla = [
      "8:00 am",
      "9:00 am",
      "10:00 am",
      "11:00 am",
      "2:00 pm",
      "3:00 pm",
      "4:00 pm",
      "5:00 pm",
    ];

    const filas = [];

    horasEntrenamiento.forEach((hora, index) => {
      const fila = [
        <td className="sin-borde-derecha" key={`hora-${index}`}>
          <h3
            style={{ textAlign: "center", height: "40px" }}
          >
            {horatabla[index]}
          </h3>
        </td>,
      ];

      fechasSemana.forEach((fecha) => {
        const esSabado = moment(fecha).day() === 6; // Saturday
        const claseCSS = esSabado ? "sin-borde-izquierda" : "con-bordes";
        console.log("fecha", fecha);
        const eventosDiaHora = eventos.filter((evento) => {
          const eventoFecha = moment(evento.fecha)
            .startOf("day")
            .format("YYYY-MM-DD");
          console.log("evento", evento);
          console.log("eventoFecha", eventoFecha);
          return (
            evento.hora === hora &&
            eventoFecha === fecha &&
            isInThisWeek(evento.fecha)
          );
        });

        fila.push(
          <td className={claseCSS} key={`${fecha}-${index}`}>
            {eventosDiaHora.length > 0 ? (
              eventosDiaHora.map((evento) => (
                <button
                  className="bg-blue-600"
                  style={{ borderRadius: "10px", border: "none", boxShadow: "0px 1px 3px #000000", height: "50px", width: "150px", color: "white", fontWeight: "bold" }}
                  key={evento._id}
                  onClick={() => navigate(`/administrador/eventos/${evento._id}`)}
                >
                  <p>{evento.nombre_curso}</p>
                </button>
              ))
            ) : (
              <></>
            )}
          </td>
        );
      });

      filas.push(<tr key={`fila-${index}`}>{fila}</tr>);
    });

    return filas;
  };

  return (
    <>
      <h1
        style={{ textAlign: "center", fontWeight: "bold", marginBottom: "15px", fontSize: "30px" }}
      >
        Horario de Eventos
      </h1>
      {loading ? (
        <div className="loading">
          <h2>Cargando Entrenamientos...</h2>
        </div>
      ) : (
        <div className="contenedor_tabla_entrenamiento">
          <div className="div_tabla_entrenador" style={{ marginLeft: "60px" }}>
            <table className="styled-table">
              <thead>
                <tr>
                  <th className="sin-borde-arriba-ni-izquierda"></th>
                  <th className="sin-borde-arriba">
                    <h4
                      style={{ textAlign: "center", width: "155px" }}
                    >
                      LUNES
                    </h4>
                  </th>
                  <th className="sin-borde-arriba">
                    <h4
                      style={{ textAlign: "center", width: "155px" }}
                    >
                      MARTES
                    </h4>
                  </th>
                  <th className="sin-borde-arriba">
                    <h4
                      style={{ textAlign: "center", width: "155px" }}
                    >
                      MIÉRCOLES
                    </h4>
                  </th>
                  <th className="sin-borde-arriba">
                    <h4
                      style={{ textAlign: "center", width: "155px" }}
                    >
                      JUEVES
                    </h4>
                  </th>
                  <th className="sin-borde-arriba">
                    <h4
                      style={{ textAlign: "center", width: "155px" }}
                    >
                      VIERNES
                    </h4>
                  </th>
                  <th className="sin-borde-arriba-ni-derecha">
                    <h4
                      style={{ textAlign: "center", width: "155px" }}
                    >
                      SÁBADO
                    </h4>
                  </th>
                </tr>
              </thead>
              <tbody>{generarContenidoTabla()}</tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}

export default HorarioEventos;
