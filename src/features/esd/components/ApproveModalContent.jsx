import { Button } from "primereact/button";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { hideModal } from "../../../components/modal/modalSlice";
import { APPROVE_DOCUMENT } from "../services/api";
import { useState } from "react";
import { useToast } from "../../../context/ToastContext";
import PropTypes from 'prop-types';


ApproveModalContent.propTypes = {
    docId: PropTypes.number,
    setRefresh:PropTypes.func
  };

export default function ApproveModalContent({docId,setRefresh}) {
  const dispatch = useDispatch();
  const [isLoading,setIsLoading] = useState(false)
  const {showToast} = useToast()

const POST_DATA = async ()=>{
    try {
        setIsLoading(true)
        const res  = await  APPROVE_DOCUMENT(docId)
        showToast("success","Uğurlu əməliyyat!","Sənəd təsdiqləndi!",3000)
        dispatch(hideModal())
        setRefresh((prev)=>!prev)

    } catch (error) {
        showToast("error","Xəta",error.response.data.Exception[0])

    }finally{
        setIsLoading(false)
    }
}


  return (
    <Wrapper>
      <Text>Təsdiq etmək istədiyinizdən əminsinizmi?</Text>
      <Buttons>
        <Button
          label="Bağla"
          severity="primary"
          onClick={() => dispatch(hideModal())}
        />
        <Button label="Bəli, təsdiqlə" severity="success"  loading={isLoading} onClick={POST_DATA}/>
      </Buttons>
    </Wrapper>
  );
}

const Buttons = styled.div`
  width: 100%;
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 16px;
`;

const Text = styled.p`
  /* font-size: 18px; */
  font-weight: 500;
`;

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;
