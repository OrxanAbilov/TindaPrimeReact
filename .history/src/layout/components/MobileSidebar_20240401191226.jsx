import { useRef } from "react";

import { Ripple } from "primereact/Ripple";
import { StyleClass } from "primereact/StyleClass";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import Logo from "../../assets/images/Logo2.png";
import { useSelector } from "react-redux";
import { Button } from "@mui/material";

export default function MobileSidebar() {
 
  return (
    <MobileWrapper>
      <Header>
      <Button icon="pi pi-times" rounded text severity="danger" aria-label="Cancel" />

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
  z-index: 99999;
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

`;
