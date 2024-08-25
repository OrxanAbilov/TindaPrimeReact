import instance from "../../../api/agent"

const GET_ALL_PROCUREMENTS = async () => {
  const res = await instance.get("Procurement/GetAllProcurements")
  return res.data
};


const GET_PROCUEMENT_DOCDETAIL_BY_ID = async (id) => {
  const res = await instance.get(
    `Procurement/GetProcurementDocDetails?procurementId=${id}`
  );
  return res.data;
};


const GET_PROCUREMENT_WORKERS = async () => {
  const res = await instance.get(
    `Workers/GetWorkersForCombo`
  );
  return res.data;
};


const GET_CARI_HESAPLAR_FOR_DROP_DOWN = async () => {
  const res = await instance.get(
    `Procurement/GetCariHesaplarForDropDown`
  );
  return res.data;
};


const GET_ALL_SUGESTION_BY_PROCUREMENT_ID = async (id) => {
  const res = await instance.get(
    `Procurement/GetAllProcurementSuggestions?procurementId=${id}`
  );
  return res.data;
};

const GET_PROCUREMENT_TERMS = async (termType) => {
  const res = await instance.get(
    `Procurement/GetProcurementTermForDropDown?type=${termType}`
  );
  return res.data;
};


const ADD_NEW_SUGGESTION = async (postData) => {
  const res = await instance.post(
    `Procurement/AddingProcurementSuggestion`,postData
  );
  return res.data;
};


const DELETE_PROCUREMENT_SUGGESTION = async (id) => {
  const res = await instance.delete(
    `Procurement/DeleteProcurementSuggestion?suggestionId=${id}`
  );
  return res.data;
};

const DOWNLOAD_SUGGESTION_FILE_BY_ID = async (id) => {
  const res = await instance.get(
    `Procurement/DownloadSuggestionFileById:int?id=${id}`
  );
  return res.data;
};

const SELECT_SUGGESTION = async (suggestionId,isSelected) => {
  const res = await instance.get(
    `Procurement/SelectSuggestion?suggestionId=${suggestionId}&isSelected=${isSelected}`
  );
  return res.data;
};

const ASSIGN_WORKER_TO_PROCUREMENT_DOCUMENT = async (workerId,procurementId) => {
  const res = await instance.put(
    `Procurement/AssignWorkerToProcurementDocument?workerId=${workerId}&procurementId=${procurementId}`
  );
  return res.data;
};

const SEND_TO_APPROVE_PROCUREMENT = async (id) => {
  const res = await instance.get(
    `Procurement/SendToApproveProcurement?procurementId=${id}`
  );
  return res.data;
};

const GET_CURR_BY_CLIENTCODE = async (clientCode) => {
  const res = await instance.get(
    `Procurement/GetCurrByClientCode?clientCode=${clientCode}`
  );
  return res.data;
};

const CANCEL_PROCUREMENT = async (id) => {
  const res = await instance.get(
    `Procurement/CancelProcurement?procurementId=${id}`
  );
  return res.data;
};

const REACTIVATE_PROCUREMENT = async (id) => {
  const res = await instance.get(
    `Procurement/ReactivateProcurement?procurementId=${id}`
  );
  return res.data;
};


export { 
  GET_ALL_PROCUREMENTS, 
  GET_PROCUEMENT_DOCDETAIL_BY_ID, 
  GET_ALL_SUGESTION_BY_PROCUREMENT_ID,
  GET_CARI_HESAPLAR_FOR_DROP_DOWN,
  ADD_NEW_SUGGESTION,
  DELETE_PROCUREMENT_SUGGESTION,
  DOWNLOAD_SUGGESTION_FILE_BY_ID,
  SELECT_SUGGESTION,
  SEND_TO_APPROVE_PROCUREMENT,
  GET_CURR_BY_CLIENTCODE,
  GET_PROCUREMENT_TERMS,
  GET_PROCUREMENT_WORKERS,
  ASSIGN_WORKER_TO_PROCUREMENT_DOCUMENT,
  CANCEL_PROCUREMENT,
  REACTIVATE_PROCUREMENT
}