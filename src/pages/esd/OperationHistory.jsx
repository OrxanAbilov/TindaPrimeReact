import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { GET_OPERATION_HISTORY_BY_DOC_ID } from '../../features/esd/services/api';
import { useParams } from "react-router-dom";
import { getStatusLabel, getStatusSeverity } from "../../helper/Status";
import Loading from "../../components/Loading"; 
import Error from "../../components/Error";
import styled from "styled-components";

const OperationHistory = () => {
  const [operationHistory, setOperationHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    const fetchOperationHistory = async () => {
      setIsLoading(true);
      try {
        const res = await GET_OPERATION_HISTORY_BY_DOC_ID(id);
        if (res.statusCode === 200) {
          setOperationHistory(res.data);
          setError(false);
        } else {
          setError(true);
        }
      } catch (error) {
        console.error('Error fetching operation history:', error);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOperationHistory();
  }, [id]);

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
      {isLoading ? (
        <Loading />
      ) : error ? (
        <Error />
      ) : (
        <DataTable
          value={operationHistory}
          emptyMessage="Əməliyyat tapılmadı."
        >
          <Column field="fullName" header="Ad Soyad" sortable></Column>
          <Column field="operationDate" header="Sənəd Tarixi" sortable></Column>
          <Column field="reasonNote" header="Səbəb" sortable></Column>
          <Column field="status" header="Status" body={(rowData) => statusBodyTemplate(rowData.status)} sortable></Column>
        </DataTable>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;
export default OperationHistory;
