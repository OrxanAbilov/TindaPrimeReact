import styled from "styled-components";

export default function Error() {
  return (
    <Wrapper>
      <ErrorTitle>Xəta</ErrorTitle>
      <ErrorDescription>Texniki prolem baş verdi. Birazdan yenidən yoxlayın</ErrorDescription>
      
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const ErrorTitle = styled.span`
color: red;
font-size:40px;
font-weight: 500;
  
`
const ErrorDescription = styled.p`
  
`