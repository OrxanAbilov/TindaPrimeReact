import { Avatar } from "primereact/avatar";
import { Menu } from "primereact/menu";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { singOutSuccess } from "../../features/login/loginSlice";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../context/ToastContext";
import { Button } from "primereact/button";

export default function Header({ setIsShowMobileMenu }) {
  const { userData } = useSelector((state) => state.loginSlice);
  const menuRight = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const items = [
    {
      label: "Çıxış",
      icon: "pi pi-sign-out",
      command: () => {
        showToast("success", "Uğurlu əməliyyat!", "Çıxış edildi");
        setTimeout(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("data");
          dispatch(singOutSuccess());
          navigate("/");
        }, 1000);
      },
    },
  ];
  return (
    <HeaderWrapper>
      <Button
        icon="pi pi-align-justify"
        rounded
        text
        aria-label="Close"
        size="large"
        onClick={() => setIsShowMobileMenu(true)}
      />

<User>
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
        style={{ backgroundColor: "#339967", color: "#ffffff" }}
        onClick={(event) => menuRight.current.toggle(event)}
      />
      </User>
    </HeaderWrapper>
  );
}

const User = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
`

const HeaderWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  border-bottom: 1px solid #dee2e6;
  height: 60px;
  button{
    
  }
  @media (max-width:992px) {
    
  }
`;

const UserName = styled.span`
  font-size: 16px;
  color: #000;
  font-weight: 500;
`;
