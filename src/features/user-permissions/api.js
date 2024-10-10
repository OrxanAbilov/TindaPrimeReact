import instance from "../../api/agent";

const GET_USER_PERMISSIONS = async (permissionsData) => {
    try {
        const res = await instance.post('UserPermissions/GetUserPermissionStatus', permissionsData);
        return res.data;  // Return the response data
      } catch (error) {
        console.error('Error fetching user permission status', error);
        throw new Error('Error fetching user permission status');
    }    
};

export {
    GET_USER_PERMISSIONS
};
 