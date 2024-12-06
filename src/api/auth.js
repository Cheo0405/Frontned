import axios from "./axios";

export const registerRequest = async (user) => {
  const form = new FormData();

  for (let key in user) {
    form.append(key, user[key]);
  }

  return await axios.post(`/registerDocente`, form, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const loginRequest = (user) => axios.post(`/login`, user);

export const verifyTokenRequet = () => axios.get("/verify");

export const getUsuariosRequest = () => axios.get("/usuarios");

export const sendEmailRequest = (user) => axios.post("/sendEmail", user);

export const resetPasswordRequest = (cedula, token, contrasena) => {
  return axios.post(`/reset-password/${cedula}/${token}`, { contrasena });
};