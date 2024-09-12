import instance from "../../../api/agent";

const GET_ALL_DELIVERY_DOCUMENTS = async (allFilters) => {
    const { start, pageSize, order, orderColumn, filters } = allFilters;
    
    const res = await instance.post('DeliveryDocuments/GetWithPagination', {
      start,
      pageSize,
      draw: filters.draw || 0,
      // order: order || 'asc',
      // orderColumn: orderColumn || 'id',
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
    
export {
  GET_ALL_DELIVERY_DOCUMENTS,
  GET_DOCUMENT_DETAILS
 };
 