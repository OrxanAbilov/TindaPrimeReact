import instance from "../../../../../api/agent"

const GER_MESMER_LIST = async () => {
    const res = await instance.get("MesMer")
    return res.data
}


const GET_MESMER_BY_ID = async (id) => {
    const res = await instance.get(`MesMer/${id}`);

    return res.data

}

const UPDATE_MESMER = async (data) => {
    const res = await instance.put(`MesMer`, data);

    return res.data

}
const INSERT_MESMER = async (data) => {
    const res = await instance.post(`MesMer`, data);

    return res.data

}

const DELETE_MESMER = async (id) => {
    const res = await instance.delete(`MesMer/${id}`);

    return res.data

}

export { GER_MESMER_LIST, GET_MESMER_BY_ID, UPDATE_MESMER,INSERT_MESMER,DELETE_MESMER }