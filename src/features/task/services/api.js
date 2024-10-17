import instance from "../../../api/agent";

const GET_ALL_DEPARTMENTS = async () => {
  const res = await instance.get("Department/get-combo");
  return res.data.data;
};

const GET_POSITIONS_BY_DEPARTMENT = async (depId) => {
  const res = await instance.get(
    `Positions/GetPositionsForCombo?depId=${depId}`
  );
  return res.data.data;
};

const GET_ALL_BRANCHES = async () => {
  const res = await instance.get("Branches");
  return res.data.data;
};

const GET_ALL_IMPORTANCES = async () => {
  const res = await instance.get("Importances");
  return res.data.data;
};

const GET_USERS_FOR_COMBO_AUTOCOMPLETE = async (searchTerm) => {
  const res = await instance.get(`Users/GetUsersForComboAutoCompelete?search=${searchTerm}`);
  return res.data.data;
};

const GET_ALL_CLIENTS = async (filters) => {
  const { start, pageSize, order, orderColumn, searchList } = filters;
  
  const res = await instance.post('SpecialSetting/GetClientsWithPagination', {
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
  GET_ALL_DEPARTMENTS,
  GET_POSITIONS_BY_DEPARTMENT,
  GET_ALL_BRANCHES,
  GET_ALL_IMPORTANCES,
  GET_USERS_FOR_COMBO_AUTOCOMPLETE,
  GET_ALL_CLIENTS
 };
