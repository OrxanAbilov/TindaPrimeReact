import { Avatar } from "primereact/avatar";
import { Menu } from "primereact/menu";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { singOutSuccess } from "../../features/login/loginSlice";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../context/ToastContext";

export default function Header() {
  const { userData } = useSelector((state) => state.loginSlice);
  const menuRight = useRef(null);
  const dispatch = useDispatch()
  const navigate =useNavigate()
  const {showToast} = useToast()

  const items = [
    {
      label: "Çıxış",
      icon: "pi pi-sign-out",
      command: () => {
        showToast("success","Uğurlu əməliyyat!","Çıxış edildi")
        setTimeout(()=>{
          localStorage.removeItem("token")
          dispatch(singOutSuccess())
          navigate("/")
        },1000)
    }
    },
  ];
  return (
    <HeaderWrapper>
      <UserName> {userData && `${userData.name} ${userData.surname}`}</UserName>
      <Menu
        model={items}
        popup
        ref={menuRight}
        id="popup_menu_right"
        popupAlignment="right"
      />

      <Avatar
        icon="pi pi-user"
        size="normal"
        shape="circle"
        style={{ backgroundColor: "#2196F3", color: "#ffffff" }}
        onClick={(event) => menuRight.current.toggle(event)}
      />
    </HeaderWrapper>
  );
}

const HeaderWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 16px;
  gap: 16px;
  border-bottom: 1px solid #dee2e6;
  height: 60px;
`;

const UserName = styled.span`
  font-size: 16px;
  color: #000;
  font-weight: 500;
`;
