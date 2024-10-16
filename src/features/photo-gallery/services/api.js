import instance from "../../../api/agent";

const GET_ALL_GALLERY_PHOTOS = async (allFilters) => {
  const { start, pageSize, filters } = allFilters;
  
  const res = await instance.post('PhotoGalleries/GetWithPagination', {
    start,
    pageSize,
    draw: filters.draw || 0,
    filters: filters || []
  });
  
  return res.data;
};

const GET_PHOTO_DETAIL = async (docType, id) => {
  const res = await instance.post('PhotoGalleries/GetDetail', {
    doC_TYPE: docType,  
    id: id
  });

  return res.data;
};

const POST_NEW_TASK_BY_IMAGE = async (postData) => {
  try {
    const res = await instance.post('Tasks', postData);
    return res.data;
  } catch (error) {
    console.error('Error creating Task', error);
    throw new Error('Error creating Task');
  }
};

export {
  GET_ALL_GALLERY_PHOTOS,
  GET_PHOTO_DETAIL,
  POST_NEW_TASK_BY_IMAGE
  };
