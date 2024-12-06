import axios from "./axios"

export const getSectoresRequest = () => axios.get("/sectores");

export const getSectorRequest = (id) => axios.get(`/sectores/${id}`);

export const createSectorRequest = (sector) => axios.post("/sectores", sector);

export const updateSectorRequest = (id, sector) =>
    axios.put(`/sectores/${id}`, sector);

export const deleteSectorRequest = (id) => axios.delete(`/sectores/${id}`);