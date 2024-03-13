import instance from "../../../../api/agent"

const GET_ALL_DOCUMENTS_FOR_HISTORY = async ()=>{
const res = await instance.get("DocumentManagement/GetAllDocumentsForHistory")
return res.data
}


export {GET_ALL_DOCUMENTS_FOR_HISTORY}