import { useParams } from "react-router-dom";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Fragment, useEffect, useRef, useState } from "react";
import { GET_PROCUEMENT_DOCDETAIL_BY_ID } from "../../features/procurement/services/api";
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
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import ProcurementSuggestions from "./ProcurementSuggestions";
import SuggestionNewDialog from "./components/SuggestionNewDialog";

export default function ProcurementDetail() {
  const navigate = useNavigate();
  const { data, error, isLoading } = useSelector((state) => state.procurementDetailSlice);
  const toast = useRef(null);
  const dispatch = useDispatch();
  const { id } = useParams();
  const [visible, setVisible] = useState(false);
  const [refresh, setRefresh] = useState(false);
  
  const fetchData = async () => {
    try {
      dispatch(setIsLoading(true));
      const res = await GET_PROCUEMENT_DOCDETAIL_BY_ID(id);
      dispatch(setData(res.data));
      dispatch(setError(false));
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
      <Fragment>
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

            </Information>

            <br />
            <br />

            <TitleInfo>Malların Siyahısı:</TitleInfo>
            <br />
            <DataTable
              value={data.procurementLines}
              selectionMode="row"
              dataKey="procurementId"
              emptyMessage="Mal sətri tapılmadı."
            >
              {/* <Column showFilterMenu field="rowNo" header="Sıra" sortable></Column> */}
              <Column showFilterMenu field="itemCode" header="Mal Kodu" sortable></Column>
              <Column showFilterMenu field="itemName" header="Mal Adı" sortable></Column>
              <Column showFilterMenu field="erpId" header="Erp-Id" sortable></Column>
              {/* <Column field="docDate" header="Sənəd Tarixi" body={(rowData) => new Date(rowData.docDate).toLocaleDateString()} sortable></Column> */}
              <Column field="amount" header="Miqdar" sortable></Column>
              <Column field="description" header="Açıqlama" sortable></Column>
            </DataTable>
            <br />
            <br />

            <div className="flex flex-wrap gap-2">

              <TitleSuggestion>Təkliflər:  </TitleSuggestion>
              <div style={{ flex: '1', textAlign: 'right' }}>
                <Button label="Əlavə et" severity="success" icon="pi pi-plus" onClick={() => setVisible(true)} />
              </div>
            </div>

            <Dialog header="Yeni Təklif" visible={visible} style={{ width: '60vw' }} onHide={() => setVisible(false)}>
              <SuggestionNewDialog procDetails={data}  onClose={() => setVisible(false)}/>
            </Dialog>


            <ProcurementSuggestions procurementId={data.id} />
            <Buttons>
              {data.showApproveButton && (
                <Button
                  label="Təsdiq et"
                  severity="success"
                  onClick={showApprovemodal}
                />
              )}
              {data.showCancelButton && (
                <Button
                  label="Ləğv et"
                  severity="danger"
                  onClick={showCancelemodal}
                />
              )}
              {data.showApproveButton && (
                <Button
                  label="İmtina et"
                  severity="danger"
                  onClick={showRejectemodal}
                />
              )}
            </Buttons>
          </Fragment>
        ) : !data && !error && isLoading ? (
          <Loading />
        ) : (
          <Error />
        )}
      </Fragment>

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
const TitleSuggestion = styled.p`
with: 50%;
font-weight: 600;
font-size: 20px;

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

const TabButtons = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 16px;

  .active {
    background-color: #007ad9 !important;
    color: #ffffff !important;
  }
`;