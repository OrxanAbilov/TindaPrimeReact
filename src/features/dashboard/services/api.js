import instance from '../../../api/agent'

const GET_COUNT_DOCUMENTS = async ()=>{
const res = await instance.get("DocumentManagement/CountDocumentsForEsdChart")
return res.data;
}

export {GET_COUNT_DOCUMENTS}