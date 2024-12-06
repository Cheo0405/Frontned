import axios from "./axios"

export const getDocentesRequest = () => axios.get("/docentes");
export const getDocenteRequest = (id) => axios.get(`/docentes/${id}`);
export const registerDocenteRequest = async (user) => {
    const form = new FormData();

    for(let key in user){
        form.append(key, user[key]);
    }

    return await axios.post(`/docentes`, form, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};
export const editedDocenteRequest = async (id,user) => {
    const form = new FormData();

    for(let key in user){
        form.append(key, user[key]);
    }

    return await axios.put(`/docentes/${id}`, form, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};
export const deleteDocenteRequest = (id) => axios.delete(`/docentes/${id}`);

export const reloadDocenteRequest = (id) => axios.put(`/docentes/${id}/reload`);
