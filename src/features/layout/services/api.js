import instance from "../../../api/agent"

const GET_USER_MENUS = async ()=>{
const res = await instance.get("Menus/GetUserMenuForReact")
return res.data
}


export {GET_USER_MENUS}