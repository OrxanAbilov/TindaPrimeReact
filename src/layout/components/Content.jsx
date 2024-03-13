import styled from "styled-components";
import { Route, Routes } from "react-router-dom";
import useRoutes from "../../routers/useRoutes";

export default function Content() {


const myRoutes = useRoutes()

  return (
    <ContentWrapper>
      <RouteWrapper>
      <Routes>
        {myRoutes.map((e,i)=><Route exact={e.exact} defaultRoute path={e.path} element={e.element} key={i} />)}
      </Routes>
      </RouteWrapper>
    </ContentWrapper>
  );
}

const ContentWrapper = styled.div`
  width: 100%;
  background-color: #ededede9;
  padding: 16px;
  height: calc(100vh - 50px);
`;

const RouteWrapper = styled.div`
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: #fff;
  display: flex;
  border-radius: 6px;
  padding: 16px;

`
