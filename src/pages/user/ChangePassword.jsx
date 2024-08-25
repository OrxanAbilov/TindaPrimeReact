"use client";
import { useEffect, useState } from "react";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import { Password } from "primereact/password";
import { classNames } from "primereact/utils";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setData,setError,setIsLoading } from "../../features/user/userSlice";
import { CHANGE_PASSWORD } from "../../features/user/services/api";
import { useToast } from "../../context/ToastContext";
import Logo from '../../assets/images/Logo2.png'
import styled from "styled-components";


const ChangePassword = () => {
  const { data, error, isLoading } = useSelector((state) => state.procurementSlice);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);
  const { showToast } = useToast();

  const containerClassName = classNames(
    "surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden",
    { "p-input-filled": true }
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      showToast("error", "Xəta", "Yeni şifrə və təsdiq şifrəsi uyğun gəlmir.");
      return;
    }

    try {
      setIsLoading(true)
     const res = await CHANGE_PASSWORD({ currentPassword: currentPassword, newPassword: newPassword, confirmNewPassword: confirmNewPassword })
     if(res){
  
       showToast("success","Uğurlu əməliyyat!","Şifrə uğurla dəyişdirildi.",3000)
       navigate('/dashboard')
     }
     } catch (error) {
      console.log(error);
      showToast("error", "Xəta", error.response?.data?.Exception[0] || "Xəta baş verdi.");
  
     }finally{
      setIsLoading(false)
     }


    // try {
    //   setLoading(true);
    //   const res = await CHANGE_PASSWORD({ currentPassword: currentPassword, newPassword: newPassword, confirmNewPassword: confirmNewPassword });
    //   if (res) {
    //     //dispatch(setData(res.data));
    //     showToast("success", "Uğurlu əməliyyat!", "Şifrə uğurla dəyişdirildi.", 3000);
    //     navigate("/dashboard");
    //   }

    // } catch (error) {
    //   console.log(error);
    //   showToast("error", "Xəta", error.response?.data?.Exception[0] || "Xəta baş verdi.");
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    <Wrapper>
    <form onSubmit={handleChangePassword}>
      <div>
        <div className="flex flex-column align-items-center justify-content-center">
          <div
            style={{
              borderRadius: "56px",
              padding: "0.3rem",
              background:
                "linear-gradient(180deg, #339967 10%, rgba(33, 150, 243, 0) 30%)",
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
                  htmlFor="currentPassword"
                  className="block text-900 text-xl font-medium mb-2"
                >
                  Cari Şifrə
                </label>
                <Password
                  promptLabel="Şifrə"
                  inputId="currentPassword"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Daxil edin"
                  className="w-full mb-5"
                  inputClassName="w-full p-3 md:w-30rem"
                />

                <label
                  htmlFor="newPassword"
                  className="block text-900 font-medium text-xl mb-2"
                >
                  Yeni Şifrə
                </label>
                <Password
                  promptLabel="Şifrə"
                  weakLabel="Çox sadədir"
                  mediumLabel="Orta çətinlikdədir"
                  strongLabel="Güclü şifrədir"
                  inputId="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Daxil edin"
                  className="w-full mb-5"
                  inputClassName="w-full p-3 md:w-30rem"
                />

                <label
                  htmlFor="confirmNewPassword"
                  className="block text-900 font-medium text-xl mb-2"
                >
                  Yeni Şifrə Təsdiqi
                </label>
                <Password
                  promptLabel="Şifrə"
                  inputId="confirmNewPassword"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="Daxil edin"
                  className="w-full mb-5"
                  inputClassName="w-full p-3 md:w-30rem"
                />

                <div className="flex align-items-center justify-content-between mb-5 gap-5">
                  
                  
                </div>
                <Button
                  label="Şifrəni Dəyiş"
                  className="w-full p-3 text-xl"
                  loading={loading}
                  style={{ backgroundColor: "#339967" }}
                  type="submit"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
    </Wrapper>
  );
};

export default ChangePassword;


const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`