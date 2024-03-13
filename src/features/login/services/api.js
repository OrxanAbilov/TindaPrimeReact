import instance from '../../../api/agent'

const AUTH_LOGIN = async (data)=>{
const res = await instance.post("Auth/login",data)
return res
}

export {AUTH_LOGIN}