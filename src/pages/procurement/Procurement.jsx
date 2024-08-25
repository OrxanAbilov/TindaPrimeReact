import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { GET_ALL_PROCUREMENTS } from "../../features/procurement/services/api";
import {
  setData,
  setError,
  setIsLoading
} from "../../features/procurement/procurementSlice";
import { getStatusLabel, getStatusSeverity } from "../../helper/Status";
import { InputText } from "primereact/inputtext";
import Loading from "../../components/Loading";
import Error from "../../components/Error";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";

export default function Procurement() {
  const dispatch = useDispatch();

  const { data, error, isLoading } = useSelector((state) => state.procurementSlice);
  const [globalFilter, setGlobalFilter] = useState("");
const navigate = useNavigate()
  const fetchData = async () => {
    try {
      dispatch(setIsLoading(true));
      const res = await GET_ALL_PROCUREMENTS();
      dispatch(setData(res.data));
      Console.Log(res.data);
    } catch (error) {
      dispatch(setError(error.response));
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
  }, []);

  const header = (
    <div className="flex flex-wrap align-items-center justify-content-between gap-2">
      <div className="p-input-icon-left">
        <i className="pi pi-search"></i>
        <InputText
          type="search"
          onInput={(e) => setGlobalFilter(e.target.value)}
          placeholder="Axtar"
        />
      </div>
    </div>
  );

  const statusBodyTemplate = (product) => {
    return (
      <Tag
        value={getStatusLabel(product.status)}
        severity={getStatusSeverity(product.status)}
      ></Tag>
    );
  };

  return (
    <Wrapper>
      <h2>Satınalma</h2>
      {!error && !isLoading && data ? (
        <DataTable
          globalFilter={globalFilter}
          paginator
          rows={10}
          value={data}
          selectionMode="single"
          header={header}
          onSelectionChange={(e) => {
            navigate(`/procurement/docs/detail/${e.value.id}`);}}
          dataKey="id"
          metaKeySelection={true}
          emptyMessage="Sənəd tapılmadı."
          
        >
          <Column
            showFilterMenu
            field="docNo"
            header="Sənəd Nömrəsi"
            sortable
          ></Column>
          <Column field="docDate" header="Sənəd Tarixi" body={(rowData) => new Date(rowData.docDate).toLocaleDateString()} sortable></Column>
          <Column field="openedBy" header="Kim Açıb" sortable></Column>
          <Column field="description" header="Açıqlama" sortable></Column>
          <Column field="assignedWorker" header="Təhkim edilən" sortable></Column>
          <Column
            sortable
            field="status"
            header="Status"
            body={statusBodyTemplate}
            style={{width:"150px"}}
          ></Column>
        </DataTable>
      ) : !error && isLoading ? (
        <Loading />
      ) : (
        <Error />
      )}

      <Outlet />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`