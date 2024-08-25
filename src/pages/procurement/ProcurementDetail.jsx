import { useParams } from "react-router-dom";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Fragment, useEffect, useRef, useState } from "react";
import { 
  GET_PROCUEMENT_DOCDETAIL_BY_ID,
  SEND_TO_APPROVE_PROCUREMENT,
  GET_PROCUREMENT_WORKERS,
  ASSIGN_WORKER_TO_PROCUREMENT_DOCUMENT,
  CANCEL_PROCUREMENT,
  REACTIVATE_PROCUREMENT
      } from "../../features/procurement/services/api";
import { getStatusLabel, getStatusSeverity } from "../../helper/Status";
import { Tag } from "primereact/tag";
import {
  setData,
  setError,
  setIsLoading,
} from "../../features/procurement/procurementDetails/procurementDetailSlice";
import Loading from "../../components/Loading";
import Error from "../../components/Error";
import { Toast } from "primereact/toast";
import { useDispatch, useSelector } from "react-redux";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import ProcurementSuggestions from "./ProcurementSuggestions";
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { useToast } from "../../context/ToastContext";
import { Dropdown } from "primereact/dropdown";
import { setRef } from "@mui/material";


export default function ProcurementDetail() {
  const navigate = useNavigate();
  const { data, error, isLoading } = useSelector((state) => state.procurementDetailSlice);
  const toast = useRef(null);
  const { showToast } = useToast()
  const dispatch = useDispatch();
  const { id } = useParams();
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [workerDropdownOptions, setWorkerDropdownOptions] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const fetchData = async () => {
    try {
      dispatch(setError(false));
      dispatch(setIsLoading(true));
      const res = await GET_PROCUEMENT_DOCDETAIL_BY_ID(id);
      dispatch(setData(res.data));
      setSelectedWorker(res.data.assignedWorker);
      const resWorker = await GET_PROCUREMENT_WORKERS();
      setWorkerDropdownOptions(resWorker.data);      

    } catch (error) {
      dispatch(setError(true));
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      fetchData();
    }
    return () => {
      mounted = false;
    };
  }, [refresh]);

  const showSendToApprovemodal = (id) => {
    console.log(id);
    confirmDialog({
      message: 'Satınalma Sifarişi yaradılsın və təstiqə göndərilsin?',
      header: 'Təstiqə göndər',
      icon: 'pi pi-exclamation-triangle',
      defaultFocus: 'sendToApprove',
      accept: () => sendToApprove(id),
      acceptLabel: "Göndər",
      rejectLabel: "Ləğv et"
    });
  };

  const showReactivateDocumentmodal = (id) => {
    console.log(id);
    confirmDialog({
      message: 'Satınalma sənədi yenidən aktiv edilsin?',
      header: 'Bəli',
      icon: 'pi pi-exclamation-triangle',
      defaultFocus: 'reactivateDocument',
      accept: () => reactivateDocument(id),
      acceptLabel: "Bəli",
      rejectLabel: "Xeyr"
    });
  };

  const showCancelDocumentmodal = (id) => {
    console.log(id);
    confirmDialog({
      message: 'Satınalma ləğv ediləcək və bu sənəd üçün proses dayanacaq. Ləğv etmək istəyirsiniz?',
      header: 'Ləğv et',
      icon: 'pi pi-exclamation-triangle',
      defaultFocus: 'reject',
      accept: () => cancelDocument(id),
      acceptLabel: "Ləğv Et",
      rejectLabel: "Geri",
      acceptClassName: 'p-button-danger',
    });
  };
  const cancelDocument = async (id) => {
    try {
       const responseData = await CANCEL_PROCUREMENT(id);
       showToast('success', 'Uğurlu əməliyyat', 'Sənəd Ləğv edildi', 3000);
      setRefresh(true);
    } catch (error) {
      // Handle error
      toast.current.show({ severity: 'error', summary: 'Xəta baş verdi', detail: error.response.data.Exception[0], life: 3000 });
      // Optionally, you can show an error message to the user
    }
  };

  const reactivateDocument = async (id) => {
    try {
       const responseData = await REACTIVATE_PROCUREMENT(id);
       showToast('success', 'Uğurlu əməliyyat', 'Sənəd aktiv edildi', 3000);
      setRefresh(true);
    } catch (error) {
      // Handle error
      toast.current.show({ severity: 'error', summary: 'Xəta baş verdi', detail: error.response.data.Exception[0], life: 3000 });
      // Optionally, you can show an error message to the user
    }
  };

  const sendToApprove = async (id) => {
    try {
      const responseData = await SEND_TO_APPROVE_PROCUREMENT(id);
      showToast('success', 'Uğurlu əməliyyat', 'Sifariş Təstiqə göndərildi', 3000);
      setRefresh(true);
    } catch (error) {
      // Handle error
      toast.current.show({ severity: 'error', summary: 'Xəta baş verdi', detail: error.response.data.Exception[0], life: 3000 });
      // Optionally, you can show an error message to the user
    }
  };


  const changeAssignedWorker = async (workerId) => {
    try {
      setSelectedWorker(workerId);

      const responseData = await ASSIGN_WORKER_TO_PROCUREMENT_DOCUMENT(workerId,id);
      showToast('success', 'Uğurlu əməliyyat', 'Satınalma sənədi seçilən əməkdaşa təhkim edildi', 3000);
      // setRefresh(true);
    } catch (error) {
      // Handle error
      toast.current.show({ severity: 'error', summary: 'Xəta baş verdi', detail: error.response.data.Exception[0], life: 3000 });
      // Optionally, you can show an error message to the user
    }
  };


  const statusBodyTemplate = (status) => {
    return (
      <Tag
        value={getStatusLabel(status)}
        severity={getStatusSeverity(status)}
      ></Tag>
    );
  };



  return (
    <Wrapper>
      <Toast ref={toast} />
        {data && !error && !isLoading ? (
          <Fragment>
            <HeaderWrapper>
              <TitleInfo>Satınalma Sənədi</TitleInfo>
              <Button
                onClick={() => navigate(-1)}
                label="Geri qayıt"
                icon="pi pi-angle-left"
                text
                style={{ width: "140px" }}
              />
            </HeaderWrapper>

            <Information>
              <InfoGroup>
                <TitleInfo>Sənəd nömrəsi:</TitleInfo>
                <Desc>{data.docNo}</Desc>
              </InfoGroup>

              <InfoGroup>
                <TitleInfo>Sənəd tarixi:</TitleInfo>
                <Desc>
                  {new Date(data.docDate).toLocaleDateString()}
                </Desc>
              </InfoGroup>
              <InfoGroup>
                <TitleInfo>Açıqlama:</TitleInfo>
                <Desc>{data.description}</Desc>
              </InfoGroup>

              <InfoGroup>
                <TitleInfo>Status:</TitleInfo>
                <Desc>{statusBodyTemplate(data.status)}</Desc>
              </InfoGroup>

              <InfoGroup>
                <TitleInfo>Təhkim edilən:</TitleInfo>
                <Desc><Dropdown
                        value={selectedWorker}
                        options={workerDropdownOptions}
                        onChange={(e) => changeAssignedWorker(e.value)}
                        placeholder="Əməkdaş seçin"
                        optionLabel="fullName"
                        optionValue="id"
                        disabled={!data.enableAssignmentDropdown}
                        style={{ width: '250px' }}
                        filter
                        className="w-full md:w-14rem"
                    /></Desc>
              </InfoGroup>

            </Information>

            <br />
            <br />

            <TitleInfo>Malların Siyahısı:</TitleInfo>
            <br />
              <Card 
                className="fuad"
              
              >
              <DataTable
                value={data.procurementLines}
                selectionMode="row"
                dataKey="procurementId"
                emptyMessage="Mal sətri tapılmadı."
          
              >
                <Column showFilterMenu field="cardType" header="Tip" sortable></Column>
                <Column showFilterMenu field="itemCode" header="Mal Kodu" sortable></Column>
                <Column showFilterMenu field="itemName" header="Mal Adı" sortable></Column>
                <Column showFilterMenu field="demandAmount" header="Tələb Miqdarı" sortable></Column>
                <Column showFilterMenu field="projectCode" header="Layihə Kodu" sortable></Column>
                <Column field="amount" header="Miqdar" sortable></Column>
                <Column field="itemUnit" header="Vahid" sortable></Column>
                <Column showFilterMenu field="aktivDepo" header="Aktiv Depo" sortable></Column>
                <Column showFilterMenu field="umumiDepo" header="Ümumi Depo" sortable></Column>
                <Column showFilterMenu field="sonAlis" header="Son Alış" sortable></Column>
                <Column field="description" header="Açıqlama" sortable></Column>
              </DataTable>
              </Card>
            <br />
            <br />
            <Card>
            <ProcurementSuggestions procurement={data} />
            </Card>
            <ConfirmDialog />
            <Buttons>
              {data.showSendToApproveButton && (
                <Button
                  label="Təsdiqə Göndər"
                  severity="success"
                  onClick={() => showSendToApprovemodal(data.id)}
                />
              )}
              {data.showCancelButton && (
                <Button
                  label="Ləğv et"
                  severity="danger"
                  onClick={() => showCancelDocumentmodal(data.id)}
                />
              )}
              {data.showReactivateButton && (
                <Button
                  label="Aktiv Et"
                  severity="success"
                  onClick={() => showReactivateDocumentmodal(data.id)}
                />
              )}
            </Buttons>
            </Fragment>
          ) : !data && error && !isLoading ? (
            <Error />
          ):(<Loading />)}
    </Wrapper>
  );
}

const Buttons = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 32px;
`;
const Information = styled.div`
  width: 100%;
  display: grid;
  margin-top: 32px;
  margin-left: 14px;
  gap: 24px;
  grid-template-columns: 1fr 1fr;
`;

const Desc = styled.div`
  width: 100%;
  font-size: 14px;
  color: #3b3a3a;
`;

const TitleInfo = styled.div`
  width: 100%;
  font-weight: 500;
  font-size: 18px;
`;


const InfoGroup = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 6px;

  &:nth-of-type(6) {
    grid-column-start: 1;
    grid-column-end: 3;
  }
  &:nth-of-type(7) {
    grid-column-start: 1;
    grid-column-end: 3;
  }
`;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const HeaderWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const Card = styled.div`
  width: 100%;
  margin-top: 32px;
  & >.p-datatable{
    width:calc(100%) !important;
    @media (max-width:992px){
    width:100% !important;
  }
  }

  
 

`;