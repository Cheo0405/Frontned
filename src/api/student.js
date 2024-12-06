import axios from "./axios";

export const getStudentsRequest = () => axios.get("/estudiantes");
export const getStudentRequest = (id) => axios.get(`/estudiantes/${id}`);
export const registerStudentRequest = async (user) => {
  const form = new FormData();

  for (let key in user) {
    form.append(key, user[key]);
  }

  return await axios.post(`/estudiantes`, form, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const editedStudentRequest = async (id, user) => {
  const form = new FormData();

  for (let key in user) {
    form.append(key, user[key]);
  }

  return await axios.put(`/estudiantes/${id}`, form, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const deleteStudentRequest = (id) => axios.delete(`/estudiantes/${id}`);

export const reloadStudentRequest = (id) =>
  axios.put(`/estudiantes/${id}/reload`);
