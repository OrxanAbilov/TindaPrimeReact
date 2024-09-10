import instance from "../../../api/agent";

const GET_ALL_DOCUMENTS_FOR_HISTORY = async (filters) => {
  const { start, pageSize, currentPage } = filters;

  try {
    const res = await instance.post('CheckList/GetAllCheckLists', {
    //   pageSize: pageSize || 10,
    //   start: currentPage ? (currentPage - 1) * (pageSize || 10) : 0,
    pageSize: pageSize || 10,
    start: start || 0,
      draw: 1,
      filters: {
        ...filters,
        isActive: filters.isActive || false,
        statuS_: filters.statuS_ || false,
        deL_STATUS: filters.deL_STATUS || false,
      }
    });
    return res.data;
  } catch (error) {
    console.error('Error fetching data', error);
    throw new Error('Error fetching data');
  }
};

const GET_ALL_QUESTION_GROUPS = async (filters) => {
  const { start, pageSize, order, orderColumn, searchList } = filters;
  
  const res = await instance.post('CheckListQuestionGroup/GetWithPagination', {
    start,
    pageSize,
    draw: filters.draw || 0,
    order: order || 'asc',
    orderColumn: orderColumn || 'id',
    searchList: searchList || []
  });
  
  return res.data;
};

const GET_QUESTION_GROUPS_FOR_DROPDOWN = async (filters) => {
  const res = await instance.get(
    `CheckListQuestionGroup`
  );
  return res.data;
};

const POST_NEW_QUESTION_GROUP = async (newGroupData) => {
  try {
    const res = await instance.post('CheckListQuestionGroup', newGroupData);
    return res.data;
  } catch (error) {
    console.error('Error creating question group', error);
    throw new Error('Error creating question group');
  }
};

const EDIT_QUESTION_GROUP = async (newGroupData) => {
  try {
    const res = await instance.put('CheckListQuestionGroup', newGroupData);
    return res.data;
  } catch (error) {
    console.error('Error editing question group', error);
    throw new Error('Error editing question group');
  }
};

const REMOVE_QUESTION_GROUP = async (groupId) => {
  try {
    const res = await instance.delete(`CheckListQuestionGroup/${groupId}`);
    return res.data;
  } catch (error) {
    console.error('Error deleting question group', error);
    throw new Error('Error deleting question group');
  }
};

const GET_ALL_REASONS = async (filters) => {
  const { start, pageSize, order, orderColumn, searchList } = filters;
  
  const res = await instance.post('CheckListReason/GetWithPagination', {
    start,
    pageSize,
    draw: filters.draw || 0,
    order: order || 'asc',
    orderColumn: orderColumn || 'id',
    searchList: searchList || []
  });
  
  return res.data;
};

const POST_NEW_REASON = async (newReasonData) => {
  try {
    const res = await instance.post('CheckListReason', newReasonData);
    return res.data;
  } catch (error) {
    console.error('Error creating reason', error);
    throw new Error('Error creating  reason');
  }
};

const EDIT_REASON = async (newReasonData) => {
  try {
    const res = await instance.put('CheckListReason', newReasonData);
    return res.data;
  } catch (error) {
    console.error('Error editing question group', error);
    throw new Error('Error editing question group');
  }
};

const REMOVE_REASON = async (reasonId) => {
  try {
    const res = await instance.delete(`CheckListReason/${reasonId}`);
    return res.data;
  } catch (error) {
    console.error('Error deleting question group', error);
    throw new Error('Error deleting question group');
  }
};

const GET_REASON_TYPES = async () => {
  const res = await instance.get(
    `CheckListReasonType`
  );
  return res.data;
};

const GET_ALL_QUESTIONS = async (filters) => {
  const { start, pageSize, order, orderColumn, searchList } = filters;
  
  const res = await instance.post('CheckListQuestion/GetWithPagination', {
    start,
    pageSize,
    draw: filters.draw || 0,
    order: order || 'asc',
    orderColumn: orderColumn || 'id',
    searchList: searchList || []
  });
  
  return res.data;
};

const GET_QUESTION_BY_ID = async (id) => {
  const res = await instance.get(
    `CheckListQuestion/${id}`
  );
  return res.data;
};

const GET_RATE_TYPES = async () => {
  const res = await instance.get(
    `CheckListRateType`
  );
  return res.data;
};

const GET_CHECKLIST_ANSWER_TYPE_BY_ID = async (id) => {
  const res = await instance.get(
    `CheckListAnswerType/${id}`
  );
  return res.data;
};

const GET_CHECKLIST_PERMISSION_BY_ID = async (id) => { //1 -sekil 2- sebeb  3-cavabda sekil
  const res = await instance.get(
    `CheckListPermission/${id}`
  );
  return res.data;
};

const POST_NEW_QUESTION = async (newQuestionData) => {
  try {
    const res = await instance.post('CheckListQuestion', newQuestionData);
    return res.data;
  } catch (error) {
    console.error('Error creating question group', error);
    throw new Error('Error creating question group');
  }
};

const EDIT_QUESTION = async (newQuestionData) => {
  try {
    const res = await instance.put('CheckListQuestion', newQuestionData);
    return res.data;
  } catch (error) {
    console.error('Error editing question group', error);
    throw new Error('Error editing question group');
  }
};

const GET_CHECKLIST_QUESTION_VARIANTS_BY_QUESTION_ID = async (id) => {
  const res = await instance.get(
    `CheckListQuestionVariant/GetVariantByQuestionId/${id}`
  );
  return res.data;
};

const GET_CHECKLIST_QUESTION_IMAGE_BY_QUESTION_ID = async (id) => {
  const res = await instance.get(
    `CheckListQuestionImage/GetImageByQuestionId/${id}`
  );
  return res.data;
};

// const REMOVE_QUESTION = async (questionId) => {
//   try {
//     const res = await instance.delete(`CheckListQuestion/${questionId}`);
//     return res.data;
//   } catch (error) {
//     console.error('Error deleting question', error);
//     throw new Error('Error deleting question');
//   }
// };

const REMOVE_QUESTION = async (questionId) => {
  try {
    const res = await instance.delete(`CheckListQuestion/${questionId}`);
    return { success: true, data: res.data }; 
  } catch (error) {
    if (error.response) {
      return { success: false, response: error.response }; 
    } else {
      console.error('Network or other error:', error);
      throw error;
    }
  }
};

const GET_ALL_CHECKLISTS = async (filters) => {
  const { start, pageSize, order, orderColumn, searchList } = filters;
  
  const res = await instance.post('CheckList/GetAllCheckLists', {
    start,
    pageSize,
    draw: filters.draw || 0,
    order: order || 'asc',
    orderColumn: orderColumn || 'id',
    searchList: searchList || []
  });
  
  return res.data;
};

const GET_CHECKLIST_CLIENT_REL_BY_CHEKLIST_ID = async (id) => {
  const res = await instance.get(
    `CheckListClientRel/CheckListId/${id}`
  );
  return res.data;
};

const GET_QUESTIONS_BY_CHECKLIST_ID = async (id, filters) => {
  const { start, pageSize, order, orderColumn, searchList } = filters;
  
  const res = await instance.post(`CheckListQuestionRel/GetWithPagination/${id}`, {
    start,
    pageSize,
    draw: filters.draw || 0,
    order: order || 'asc',
    orderColumn: orderColumn || 'id',
    searchList: searchList || []
  });
  
  return res.data;
};

const GET_SALESMEN_BY_CHECKLIST_ID = async (id, filters) => {
  const { start, pageSize, order, orderColumn, searchList } = filters;
  
  const res = await instance.post(`CheckListSalesmanRel/GetWithPagination/${id}`, {
    start,
    pageSize,
    draw: filters.draw || 0,
    order: order || 'asc',
    orderColumn: orderColumn || 'id',
    searchList: searchList || []
  });
  
  return res.data;
};

const GET_ALL_SALESMEN_BY_CHECKLIST_ID = async (filters, id) => {
  const { start, pageSize, order, orderColumn, searchList } = filters;
  
  const res = await instance.post(`CheckListSalesmanRel/Salesman/GetWithPaginationNotInRel/${id}`, {
    start,
    pageSize,
    draw: filters.draw || 0,
    order: order || 'asc',
    orderColumn: orderColumn || 'id',
    searchList: searchList || []
  });
  
  return res.data;
};

const POST_NEW_CHECKLIST = async (postData) => {
  try {
    const res = await instance.post('CheckList', postData);
    return res.data;
  } catch (error) {
    console.error('Error creating checklist', error);
    throw new Error('Error creating checklist');
  }
};

const EDIT_CHECKLIST = async (postData) => {
  try {
    const res = await instance.put('CheckList', postData);
    return res.data;
  } catch (error) {
    console.error('Error editing checklist', error);
    throw new Error('Error editing checklist');
  }
};

const GET_ALL_CHECKLIST_RESULTS = async (filters) => {
  const { start, pageSize, order, orderColumn, searchList, startDate, endDate } = filters;
  
  const url = `CheckListResult/GetWithPagination/${startDate}&${endDate}`;

  const res = await instance.post(url, {
    start,
    pageSize,
    draw: filters.draw || 0,
    order: order || 'asc',
    orderColumn: orderColumn || 'id',
    searchList: searchList || []
  });
  
  return res.data;
};


const GET_CHECKLIST_RESULT_DETAILS_BY_CHEKLIST_ID = async (id) => {
  const res = await instance.get(
    `CheckListResult/${id}`
  );
  return res.data;
};

const GET_SPECIAL_SETTINGS_OPERATIONS = async (filters) => {
  const { start, pageSize, order, orderColumn, searchList } = filters;
  
  const res = await instance.post('SpecialSettingOperations/GetWithPagination', {
    start,
    pageSize,
    draw: filters.draw || 0,
    order: order || 'asc',
    orderColumn: orderColumn || 'id',
    searchList: searchList || []
  });
  
  return res.data;
};

const POST_NEW_SPECIAL_SETTING_OPERATION = async (newOperationData) => {
  try {
    const res = await instance.post('SpecialSettingOperations', newOperationData);
    return res.data;
  } catch (error) {
    console.error('Error creating setting operation', error);
    throw new Error('Error creating setting operation');
  }
};

const EDIT_SPECIAL_SETTING_OPERATION = async (newOperationData) => {
  try {
    const res = await instance.put('SpecialSettingOperations', newOperationData);
    return res.data;
  } catch (error) {
    console.error('Error editing setting operation', error);
    throw new Error('Error editing setting operation');
  }
};

const REMOVE_SETTING_OPERATION = async (operationId) => {
  try {
    const res = await instance.delete(`SpecialSettingOperations/${operationId}`);
    return res.data;
  } catch (error) {
    console.error('Error deleting setting operation', error);
    throw new Error('Error deleting setting operation');
  }
};

const GET_SPECIAL_SETTINGS = async (filters) => {
  const { start, pageSize, order, orderColumn, searchList } = filters;
  
  const res = await instance.post('SpecialSetting/GetWithPagination/1', {
    start,
    pageSize,
    draw: filters.draw || 0,
    order: order || 'asc',
    orderColumn: orderColumn || 'id',
    searchList: searchList || []
  });
  
  return res.data;
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

const POST_NEW_SPEACIAL_SETTING = async (blockData) => {
  try {
    const res = await instance.post('SpecialSetting', blockData);
    return res.data;
  } catch (error) {
    console.error('Error creating question group', error);
    throw new Error('Error creating question group');
  }
};


const GET_SPECIAL_SETTINGS_OPERATIONS_BY_CODE = async (code,filters) => {
  const { start, pageSize, order, orderColumn, searchList } = filters;
  
    const res = await instance.post(`SpecialSetting/GetOperationsWithPagination/${code}`, {
    start,
    pageSize,
    draw: filters.draw || 0,
    order: order || 'asc',
    orderColumn: orderColumn || 'id',
    searchList: searchList || []
  });
  
  return res.data;
};

const UPDATE_SPEACIAL_SETTING = async (blockData) => {
  try {
    const res = await instance.put('SpecialSetting', blockData);
    return res.data;
  } catch (error) {
    console.error('Error creating question group', error);
    throw new Error('Error creating question group');
  }
};

export {
   GET_ALL_DOCUMENTS_FOR_HISTORY, 
   POST_NEW_CHECKLIST, 
   EDIT_CHECKLIST,
   GET_ALL_QUESTION_GROUPS,
   GET_QUESTION_GROUPS_FOR_DROPDOWN,
   POST_NEW_QUESTION_GROUP,
   EDIT_QUESTION_GROUP,
   REMOVE_QUESTION_GROUP,
   GET_ALL_REASONS,
   POST_NEW_REASON,
   EDIT_REASON,
   REMOVE_REASON,
   GET_REASON_TYPES,
   GET_ALL_QUESTIONS,
   GET_QUESTION_BY_ID,
   GET_RATE_TYPES,
   GET_CHECKLIST_ANSWER_TYPE_BY_ID,
   GET_CHECKLIST_PERMISSION_BY_ID,
   POST_NEW_QUESTION,
   EDIT_QUESTION,
   GET_CHECKLIST_QUESTION_VARIANTS_BY_QUESTION_ID,
   GET_CHECKLIST_QUESTION_IMAGE_BY_QUESTION_ID,
   REMOVE_QUESTION,
   GET_ALL_CHECKLISTS,
   GET_CHECKLIST_CLIENT_REL_BY_CHEKLIST_ID,
   GET_QUESTIONS_BY_CHECKLIST_ID,
   GET_SALESMEN_BY_CHECKLIST_ID,
   GET_ALL_SALESMEN_BY_CHECKLIST_ID,
   GET_ALL_CHECKLIST_RESULTS,
   GET_CHECKLIST_RESULT_DETAILS_BY_CHEKLIST_ID,
   GET_SPECIAL_SETTINGS_OPERATIONS,
   POST_NEW_SPECIAL_SETTING_OPERATION,
   EDIT_SPECIAL_SETTING_OPERATION,
   REMOVE_SETTING_OPERATION,
   GET_SPECIAL_SETTINGS,
   GET_ALL_CLIENTS,
   POST_NEW_SPEACIAL_SETTING,
   GET_SPECIAL_SETTINGS_OPERATIONS_BY_CODE,
   UPDATE_SPEACIAL_SETTING
  };
