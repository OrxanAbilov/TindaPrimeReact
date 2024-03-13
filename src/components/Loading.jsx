import { ProgressSpinner } from "primereact/progressspinner";
import styled from "styled-components";

export default function Loading() {
  return (
    <Wrapper>
      <ProgressSpinner />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
