import instance from "../../../api/agent";

const GET_ALL_VISIT_ENTERANCE = async (filters) => {
    const { start, pageSize, order, orderColumn, searchList } = filters;
    
    const res = await instance.post('VisitEntrance/GetWithPagination', {
      start,
      pageSize,
      draw: filters.draw || 0,
      order: order || 'asc',
      orderColumn: orderColumn || 'id',
      searchList: searchList || []
    });
    
    return res.data;
  };

export {
  GET_ALL_VISIT_ENTERANCE
 };
 