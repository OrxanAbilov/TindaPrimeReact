import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { GET_ALL_OUTGOING_DOCUMENTS } from "../../features/esd/outgoing/services/api";
import { useDispatch, useSelector } from "react-redux";
import {
  setData,
  setError,
  setIsLoading,
} from "../../features/esd/outgoing/outGoingSlice";
import { getStatusLabel, getStatusSeverity } from "../../helper/Status";
import { InputText } from "primereact/inputtext";
import Loading from "../../components/Loading";
import Error from "../../components/Error";
import styled from "styled-components";

export default function OutGoing() {
  const dispatch = useDispatch();
  const { data, error, isLoading } = useSelector((state) => state.outGoingSlice);
  const [globalFilter, setGlobalFilter] = useState("");
const navigate = useNavigate()
  const fetchData = async () => {
    try {
      dispatch(setIsLoading(true));
      const res = await GET_ALL_OUTGOING_DOCUMENTS();
      dispatch(setData(res.data));
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
      <Button
        icon="pi pi-plus-circle"
        raised
        label="Yeni sənəd əlavə et"
        severity="success"
        onClick={()=>navigate("/dashboard/doc/new")}
      />
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
      <h2>Göndərilənlər</h2>
      {!error && !isLoading && data ? (
        <DataTable
          globalFilter={globalFilter}
          paginator
          rows={10}
          value={data}
          selectionMode="single"
          header={header}
          onSelectionChange={(e) => navigate(`/dashboard/doc/${e.value.id}`)}
          dataKey="id"
          metaKeySelection={true}
          tableStyle={{ width: "calc(100vW - 370px)" }}
          emptyMessage="Sənəd tapılmadı."
        >
          <Column
            showFilterMenu
            field="docNo"
            header="Sənəd Nömrəsi"
            sortable
          ></Column>
          <Column field="docDate" header="Sənəd Tarixi" sortable></Column>
          <Column field="docTypeName" header="Sənəd Növü" sortable></Column>
          <Column field="senderName" header="Göndərən" sortable></Column>
          <Column
            sortable
            field="status"
            header="Status"
            body={statusBodyTemplate}
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