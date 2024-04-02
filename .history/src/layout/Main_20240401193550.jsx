import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Content from "./components/Content";
import styled from "styled-components";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import PrivateRoute from "../routers/PrivateRoute";
import MobileSidebar from "./components/MobileSidebar";

export default function Main() {
  const location = useLocation();
  const dashboardPath = location.pathname === "/";
  const navigate = useNavigate();
  const[isShowMobileMenu,setIsShowMobileMenu] = useState(false)
  

 

  useEffect(() => {
    if (dashboardPath) {
      navigate("/dashboard");
    }
  }, []);

  return (
    <PrivateRoute>
      <Wrapper>
        <Sidebar />
        {isShowMobileMenu && <MobileSidebar  setIsShowMobileMenu={setIsShowMobileMenu} /> } 
        <HeaderAndContentWrapper>
          <Header />
          <Content>
            <Outlet />
          </Content>
        </HeaderAndContentWrapper>
      </Wrapper>
    </PrivateRoute>
  );
}

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  height: 100%;
  margin: 0;
  padding: 0;
`;

const HeaderAndContentWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;
