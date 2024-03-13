"use client";
import { useState } from "react";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import { Password } from "primereact/password";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserData } from "../loginSlice";
import { AUTH_LOGIN } from "../services/api";
import { useToast } from "../../../context/ToastContext";
import Logo from '../../../assets/images/logo.svg'


const Login = () => {
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading,setLoading] = useState(false)
  const [checked, setChecked] = useState(false);
  const {showToast} = useToast()

  const containerClassName = classNames(
    "surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden",
    { "p-input-filled": true }
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault()


 try {
    setLoading(true)
    const res = await AUTH_LOGIN({password,username})
    const { data, exception } = res.data
    localStorage.setItem('token',data.token)
    if(!exception){
        localStorage.setItem("token",data.token)
    dispatch(setUserData(res.data))
    navigate("/dashboard");
    showToast("success","Uğurlu əməliyyat!","Daxil olundu!",3000)
    }

 } catch (error) {
    console.log(error)
    showToast("error","Xəta",error.response.data.Exception[0])
 }finally{
    setLoading(false)
 }
    



   
  };

  return (
    <form 
    onSubmit={handleLogin}
    
    >
    <div className={containerClassName}>
      <div className="flex flex-column align-items-center justify-content-center">
        <div
          style={{
            borderRadius: "56px",
            padding: "0.3rem",
            background:
              "linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)",
          }}
        >
          <div
            className="w-full surface-card py-8 px-5 sm:px-8"
            style={{ borderRadius: "53px" }}
          >
            <div className="text-center mb-5">
              
              <img src={Logo} alt="Logo" width={40} />

            </div>

            <div>
              <label
                htmlFor="usernameTinda"
                className="block text-900 text-xl font-medium mb-2"
              >
                İstifadəçi adı
              </label>
              <InputText
                id="usernameTinda"
                type="text"
                placeholder="Daxil edin"
                className="w-full md:w-30rem mb-5"
                style={{ padding: "1rem" }}
                onChange={(e) => setUsername(e.target.value)}

              />

              <label
                htmlFor="passwordTinda"
                className="block text-900 font-medium text-xl mb-2"
              >
                Şifrə
              </label>
              <Password
                promptLabel="Şifrə"
                weakLabel="Çox sadədir"
                mediumLabel="Orta çətinlikdədir"
                strongLabel="Güclü şifrədir"
                inputId="passwordTinda"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Daxil edin"
                className="w-full mb-5"
                inputClassName="w-full p-3 md:w-30rem"
              />

              <div className="flex align-items-center justify-content-between mb-5 gap-5">
                <div className="flex align-items-center">
                  <Checkbox
                    inputId="rememberme1"
                    checked={checked}
                    onChange={(e) => setChecked(e.checked ?? false)}
                    className="mr-2"
                    disabled
                   />
                  <label htmlFor="rememberme1">Yadda saxla</label>
                </div>
                <a
                  className="font-medium no-underline ml-2 text-right cursor-pointer"
                  style={{ color: "var(--primary-color)",pointerEvents:"none" }}
                >
                  Şifrəni unutdum
                </a>
              </div>
              <Button
                label="Daxil ol"
                className="w-full p-3 text-xl"
                loading={loading}
                type="submit"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    </form>
  );
};

export default Login;
