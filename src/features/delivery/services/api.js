import instance from "../../../api/agent";

const GET_ALL_DELIVERY_DOCUMENTS = async (allFilters) => {
    const { start, pageSize, filters } = allFilters;
    
    const res = await instance.post('DeliveryDocuments/GetWithPagination', {
      start,
      pageSize,
      draw: filters.draw || 0,
      filters: filters || []
    });
    
    return res.data;
  };

  const GET_DOCUMENT_DETAILS = async ({ driverCode, loadCode, beginDate, endDate }) => {    
    const res = await instance.post('DriverDocuments/GetWithPagination', {
        driveR_CODE: driverCode,
        loaD_CODE: loadCode,
        beginDate,
        endDate
    });
    
    return res.data;
};
    
const GET_ORDER_ITEMS = async ({ficheno}) => {    
  const res = await instance.post('DriverOrderItems/GetWithPagination', {
    ficheno: ficheno
  });
  return res.data;
};

const EXPORT_DELIVERY_DOCUMENTS = async (allFilters) => {
  const { start, pageSize, filters } = allFilters;

  const url = `DeliveryDocuments/ExportDeliveryDocument`;

  try {
    const response = await instance.post(url, {
      start,
      pageSize,  
      draw: filters.draw || 0,
      filters: filters || []
    }, {
      responseType: 'blob'
    });

    return response;
  } catch (error) {
    console.error('Error exporting checklist results', error);
    throw new Error('Error exporting checklist results');
  }

};

const EXPORT_DELIVERY_DOCUMENTS_WITH_DRIVER_DOCUMENTS = async (allFilters) => {
  const { start, pageSize, filters } = allFilters;

  const url = `DeliveryDocuments/ExportDeliveryDocumentWithDriverDocument`;

  try {
    const response = await instance.post(url, {
      start,
      pageSize,  
      draw: filters.draw || 0,
      filters: filters || []
    }, {
      responseType: 'blob'
    });

    return response;
  } catch (error) {
    console.error('Error exporting checklist results', error);
    throw new Error('Error exporting checklist results');
  }

};


export {
  GET_ALL_DELIVERY_DOCUMENTS,
  GET_DOCUMENT_DETAILS,
  GET_ORDER_ITEMS,
  EXPORT_DELIVERY_DOCUMENTS,
  EXPORT_DELIVERY_DOCUMENTS_WITH_DRIVER_DOCUMENTS
 };
 