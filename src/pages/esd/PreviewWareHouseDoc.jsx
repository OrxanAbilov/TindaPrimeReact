import { useParams } from "react-router-dom";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Fragment, useEffect, useRef, useState } from "react";
import { GET_WAREHOUSE_DEMAND_DOCUMENT_BY_ID } from "../../features/esd/services/api";
import { getStatusLabel, getStatusSeverity } from "../../helper/Status";
import { Tag } from "primereact/tag";
import Loading from "../../components/Loading";
import Error from "../../components/Error";
import { Toast } from "primereact/toast";
import { useDispatch } from "react-redux";
import {
  setContent,
  setHeader,
  showModal,
} from "../../components/modal/modalSlice";
import ApproveModalContent from "../../features/esd/components/ApproveModalContent";
import RejectModalContent from "../../features/esd/components/RejectModalContent";
import CancelModalContent from "../../features/esd/components/CancelModalContent";
import OperationHistory from "./OperationHistory";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
export default function PreviewDoc() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const toast = useRef(null);
  const dispatch = useDispatch();
  const { id } = useParams();

  const [data, setData] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [activeTab, setActiveTab] = useState("first");

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const res = await GET_WAREHOUSE_DEMAND_DOCUMENT_BY_ID(id);
      setData(res.data);
      setError(false);
    } catch (error) {
      console.log(error);
      setError(true);
    } finally {
      setIsLoading(false);
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

  const showApprovemodal = () => {
    dispatch(showModal(true));
    dispatch(setHeader("Təsdiq et"));
    dispatch(
      setContent(<ApproveModalContent docId={data.id} setRefresh={setRefresh} />)
    );
  };

  const showRejectemodal = () => {
    dispatch(showModal(true));
    dispatch(setHeader("İmtina et"));
    dispatch(
      setContent(<RejectModalContent docId={data.id} setRefresh={setRefresh} />)
    );
  };
  const showCancelemodal = () => {
    dispatch(showModal(true));
    dispatch(setHeader("Ləğv et"));
    dispatch(
      setContent(<CancelModalContent docId={data.id} setRefresh={setRefresh} />)
    );
  };

  return (
    <Wrapper>
      <Toast ref={toast} />
      <TabButtons>
        <Button
          label="Sənəd Təfərrüatları"
          onClick={() => setActiveTab("first")}
          className={activeTab === "first" ? "active" : ""}
        />
        <Button
          label="Əməliyyat Tarixçəsi"
          onClick={() => setActiveTab("second")}
          className={activeTab === "second" ? "active" : ""}
        />
      </TabButtons>
      {activeTab === "first" && (
        <Fragment>
          {data && !error && !isLoading ? (
            <Fragment>
              <HeaderWrapper>
                <Button
                  onClick={() => navigate(-1)}
                  label="Geri qayıt"
                  icon="pi pi-angle-left"
                  text
                  style={{ width: "130px" }}
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
                  <TitleInfo>Sənəd tipi:</TitleInfo>
                  <Desc>{data.docTypeName}</Desc>
                </InfoGroup>

                <InfoGroup>
                  <TitleInfo>Status:</TitleInfo>
                  <Desc>{statusBodyTemplate(data.status)}</Desc>
                </InfoGroup>

                <InfoGroup>
                  <TitleInfo>Seri/Sira:</TitleInfo>
                  <Desc>{data.seri} / {data.sira}</Desc>
                </InfoGroup>

                <InfoGroup>
                  <TitleInfo>Kim üçün / Kim açıb:</TitleInfo>
                  <Desc>{data?.kimUcun} / {data?.kimAcib}</Desc>
                </InfoGroup>

                <InfoGroup>
                  <TitleInfo>Məsuliyyət Mərkəzi:</TitleInfo>
                  <Desc>{data.mesMer}</Desc>
                </InfoGroup>

                <InfoGroup>
                  <TitleInfo>Anbar:</TitleInfo>
                  <Desc>{data.anbar}</Desc>
                </InfoGroup>

                {/* <InfoGroup>
                  <TitleInfo>Layihə:</TitleInfo>
                  <Desc>{data.projectCode}</Desc>
                </InfoGroup> */}
              </Information>
              <br/>
              <br/>

              <DataTable
                  //globalFilter={globalFilter}
                  //paginator
                  //rows={10}
                  value={data.demandLines}
                  selectionMode="row"
                  //header={header}
                  //onSelectionChange={(e) => navigate(`/esd/doc/${e.value.id}`)}
                  dataKey="docId"
                  //metaKeySelection={true}
                  emptyMessage="Mal sətri tapılmadı."
                >
                  <Column showFilterMenu field="cardType" header="Cins" sortable></Column>
                  <Column showFilterMenu field="itemCode" header="Mal Kodu" sortable></Column>
                  <Column showFilterMenu field="itemName" header="Mal Adı" sortable></Column>
                  <Column showFilterMenu field="amount" header="Miqdar" sortable></Column>
                  <Column showFilterMenu field="teslimMiqdar" header="Təslim Miqdar" sortable></Column>
                  <Column showFilterMenu field="aktivDepo" header="Aktiv Depo" sortable></Column>
                  <Column showFilterMenu field="umumiDepo" header="Ümumi Depo" sortable></Column>
                  <Column showFilterMenu field="sonAlis" header="Son Alış" sortable></Column>
                  <Column showFilterMenu field="projectCode" header="Layihə" sortable></Column>
                  {/* <Column field="docDate" header="Sənəd Tarixi" body={(rowData) => new Date(rowData.docDate).toLocaleDateString()} sortable></Column> */}
                  <Column field="description" header="Açıqlama" sortable></Column>
                </DataTable>
                  <br />
                  <br />
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
          ) : !data && error && !isLoading ? (
            <Error />
          ):(<Loading />)}
        </Fragment>
      )}
      {activeTab === "second" && (
        <OperationHistory />
      )}
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

  &:nth-of-type(12) {
    grid-column-start: 1;
    grid-column-end: 3;
  }
  &:nth-of-type(13) {
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