
import { useRef } from 'react';

import { Ripple } from 'primereact/Ripple';
import { StyleClass } from 'primereact/StyleClass';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import Logo from '../../assets/images/Logo2.png';
import { useSelector } from "react-redux";

export default function MobileSidebar() {
  const btnRef2 = useRef(null);
  const btnRef3 = useRef(null);
  const btnRef4 = useRef(null);

  const { userData } = useSelector((state) => state.loginSlice);
  const userType = userData ? userData.userType : null;

  return (
    <MobileWrapper>
        <Header></Header>
    
    </MobileWrapper>
  )
}


const MobileWrapper = styled.div`
width: 90%;
height: 100vh;
overflow: auto;
z-index: 99999;
position: absolute;
top:0;
left: 0;
background-color: red;
@media (max-width:992px){
  display:flex;
}
`