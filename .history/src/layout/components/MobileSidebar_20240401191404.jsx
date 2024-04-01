import { useRef } from "react";

import { Ripple } from "primereact/Ripple";
import { StyleClass } from "primereact/StyleClass";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import Logo from "../../assets/images/Logo2.png";
import { Button } from "primereact/button";

export default function MobileSidebar() {
 
  return (
    <MobileWrapper>
      <Header>
        <img src={Logo} alt="Logo" width={40} />
      <Button icon="pi pi-times" rounded text  aria-label="Cancel" />

      </Header>
    </MobileWrapper>
  );
}

const Header = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 50px;
  padding: 12px;
`;

const MobileWrapper = styled.div`
  width: 90%;
  height: 100vh;
  overflow: auto;
  z-index: 99999;
  position: absolute;
  top: 0;
  left: 0;
  background-color: #fff;
  border-right: 1px solid #ededed;
  display: none;
  @media (max-width:992px){
  display:flex;
}

`;
