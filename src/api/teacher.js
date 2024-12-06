import axios from "./axios"

export const getTeachersRequest = () => axios.get("/");

export const getTeacherRequest = (id) => axios.get(`/getDocente/${id}`);

export const registerTeacherRequest = async (user) => {
    const form = new FormData();

    for(let key in user){
        form.append(key, user[key]);
    }

    return await axios.post(`/registerDocente`, form, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

export const editedTeacherRequest = async (user) => {
    const form = new FormData();

    for(let key in user){
        form.append(key, user[key]);
    }

    return await axios.post(`/updateDocente`, form, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};