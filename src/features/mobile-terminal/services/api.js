import instance from "../../../api/agent";

const GET_ALL_JOBS = async (filters) => {
    const { start, pageSize, order, orderColumn, searchList } = filters;
    
    const res = await instance.post('Jobs/GetWithPagination', {
      start,
      pageSize,
      draw: filters.draw || 0,
      order: order || 'asc',
      orderColumn: orderColumn || 'id',
      searchList: searchList || []
    });
    
    return res.data;
  };

  
const POST_NEW_JOB = async (newJobData) => {
    try {
      const res = await instance.post('Jobs', newJobData);
      return res.data;
    } catch (error) {
      console.error('Error creating Job', error);
      throw new Error('Error creating Job');
    }
  };
  
  const EDIT_JOB = async (newJobData) => {
    try {
      const res = await instance.put('Jobs', newJobData);
      return res.data;
    } catch (error) {
      console.error('Error editing Job', error);
      throw new Error('Error editing Job');
    }
  };
  
  const REMOVE_JOB = async (jobId) => {
    try {
      const res = await instance.delete(`Jobs/${jobId}`);
      return res.data;
    } catch (error) {
      console.error('Error deleting Job', error);
      throw new Error('Error deleting Job');
    }
  };

  const GET_ALL_JOB_HEADERS = async (filters) => {
    const { start, pageSize, order, orderColumn, searchList } = filters;
    
    const res = await instance.post('JobHeaders/GetWithPagination', {
      start,
      pageSize,
      draw: filters.draw || 0,
      order: order || 'asc',
      orderColumn: orderColumn || 'id',
      searchList: searchList || []
    });
    
    return res.data;
  };

  const GET_JOB_HEADER_DETAILS = async (id) => {
    const res = await instance.get(
        `JobHeaders/${id}`
      );
      return res.data;
    };

    const GET_JOBS = async () => {
      const res = await instance.get(
          `Jobs`
        );
        return res.data;
    };
    
    const POST_NEW_JOB_HEADER = async (newJobData) => {
      try {
        const res = await instance.post('JobHeaders', newJobData);
        return res.data;
      } catch (error) {
        console.error('Error creating Job', error);
        throw new Error('Error creating Job');
      }
    };
    
    const EDIT_JOB_HEADER = async (newJobData) => {
      try {
        const res = await instance.put('JobHeaders', newJobData);
        return res.data;
      } catch (error) {
        console.error('Error editing Job', error);
        throw new Error('Error editing Job');
      }
    };
  
    
export {
    GET_ALL_JOBS,
    POST_NEW_JOB,
    EDIT_JOB,
    REMOVE_JOB,
    GET_ALL_JOB_HEADERS,
    GET_JOB_HEADER_DETAILS,
    GET_JOBS,
    POST_NEW_JOB_HEADER,
    EDIT_JOB_HEADER
 };
 