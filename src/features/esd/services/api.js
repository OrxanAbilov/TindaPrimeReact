import instance from "../../../api/agent";

const GET_CASH_ORDER_DOCUMENT_BY_ID = async (id) => {
  const res = await instance.get(
    `DocumentManagement/GetCashOrderDocumentById?docId=${id}`
  );
  return res.data;
};
const REJECT_DOCUMENT = async (id,reason) => {
  const res = await instance.post(
    `DocumentManagement/RejectDocument?docId=${id}&rejectReason=${reason}`
  );
  return res.data;
};

const CANCEL_DOCUMENT = async (id,reason) => {
  const res = await instance.post(
    `DocumentManagement/CancelDocument?docId=${id}&rejectReason=${reason}`
  );
  return res.data;
};
const APPROVE_DOCUMENT = async (id) => {
  const res = await instance.post(
    `DocumentManagement/ApproveDocument?docId=${id}`
  );
  return res.data;
};

const GET_OPERATION_HISTORY_BY_DOC_ID = async (id) => {
  const res = await instance.get(
    `DocumentManagement/GetOperationHistoryByDocId?docId=${id}`
  );
  return res.data;
}

export { GET_CASH_ORDER_DOCUMENT_BY_ID,APPROVE_DOCUMENT,CANCEL_DOCUMENT,REJECT_DOCUMENT, GET_OPERATION_HISTORY_BY_DOC_ID };
