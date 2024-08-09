import instance from "../../../api/agent";

const GET_ALL_NOTIFICATION_OPERATIONS = async (filters) => {
    const { start, pageSize, order, orderColumn, searchList } = filters;
    
    const res = await instance.post('NotificationOperations/GetWithPagination', {
      start,
      pageSize,
      draw: filters.draw || 0,
      order: order || 'asc',
      orderColumn: orderColumn || 'id',
      searchList: searchList || []
    });
    
    return res.data;
  };

  const POST_NEW_NOTIFICATION_OPERATION = async (newOperationData) => {
    try {
      const res = await instance.post('NotificationOperations', newOperationData);
      return res.data;
    } catch (error) {
      console.error('Error creating NotificationOperation', error);
      throw new Error('Error creating NotificationOperation');
    }
  };
  
  const EDIT_NOTIFICATION_OPERATION = async (newOperationData) => {
    try {
      const res = await instance.put('NotificationOperations', newOperationData);
      return res.data;
    } catch (error) {
      console.error('Error editing NotificationOperation', error);
      throw new Error('Error editing NotificationOperation');
    }
  };
  
  const REMOVE_NOTIFICATION_OPERATION = async (operationId) => {
    try {
      const res = await instance.delete(`NotificationOperations/${operationId}`);
      return res.data;
    } catch (error) {
      console.error('Error deleting NotificationOperation', error);
      throw new Error('Error deleting NotificationOperation');
    }
  };

  const GET_ALL_SALESMEN = async (filters) => {
    const { start, pageSize, order, orderColumn, searchList } = filters;
    
    const res = await instance.post('NotificationSenders/GetSalesmanWithPagination', {
      start,
      pageSize,
      draw: filters.draw || 0,
      order: order || 'asc',
      orderColumn: orderColumn || 'id',
      searchList: searchList || []
    });
    
    return res.data;
  };
  
  const GET_ALL_NOTIFICATIONS = async (filters) => {
    const { start, pageSize, order, orderColumn, searchList } = filters;
    
    const res = await instance.post('NotificationSenders/GetWithPagination', {
      start,
      pageSize,
      draw: filters.draw || 0,
      order: order || 'asc',
      orderColumn: orderColumn || 'id',
      searchList: searchList || []
    });
    
    return res.data;
  };

  const GET_NOTIFICATION_OPERATIONS_FOR_DROPDOWN = async () => {
    const res = await instance.get(
      `NotificationOperations`
    );
    return res.data;
  };

  const POST_NEW_NOTIFICATION = async (newNotificationData) => {
    try {
      const res = await instance.post('NotificationSenders', newNotificationData);
      return res.data;
    } catch (error) {
      console.error('Error creating newNotification', error);
      throw new Error('Error creating newNotification');
    }
  };

export {
    GET_ALL_NOTIFICATION_OPERATIONS,
    POST_NEW_NOTIFICATION_OPERATION,
    EDIT_NOTIFICATION_OPERATION,
    REMOVE_NOTIFICATION_OPERATION,
    GET_ALL_SALESMEN,
    GET_ALL_NOTIFICATIONS,
    GET_NOTIFICATION_OPERATIONS_FOR_DROPDOWN,
    POST_NEW_NOTIFICATION
   };
 