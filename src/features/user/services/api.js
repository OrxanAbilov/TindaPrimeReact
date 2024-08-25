import instance from "../../../api/agent"

const CHANGE_PASSWORD = async (data) => {
  const res = await instance.put(
    `Users/ChangePassword`,data
  );
  return res.data;
};

export { 
  CHANGE_PASSWORD
}