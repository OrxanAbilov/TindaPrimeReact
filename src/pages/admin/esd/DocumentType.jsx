import {  useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { GET_DOC_TYPES } from "../../../features/admin/esd/documentType/services/api"
import { useDispatch, useSelector } from "react-redux";
import {
  setData,
  setError,
  setIsLoading,
} from "../../../features/admin/esd/documentType/documentTypeSlice";
import { InputText } from "primereact/inputtext";
import Loading from "../../../components/Loading";
import Error from "../../../components/Error";
import styled from "styled-components";
import { Button } from "primereact/button";

export default function DocumentType() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const { data, error, isLoading } = useSelector((state) => state.documentTypeSlice);
  const [globalFilter, setGlobalFilter] = useState("");
  const fetchData = async () => {
    try {
      dispatch(setIsLoading(true));
      const res = await GET_DOC_TYPES();
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
    <div className="flex flex-wrap align-items-center justify-content-flex-end gap-2">
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



  const editTemplate = (rowData) => {
    return <Button type="button"  icon="pi pi-file-edit" onClick={()=>navigate(`/dashboard/doc/edit/${rowData.id}`)}  />;
};

  return (
    <Wrapper>
    <h2>Sənəd tipi</h2>
      {!error && !isLoading && data ? (
        <DataTable
          globalFilter={globalFilter}
          paginator
          rows={10}
          value={data}
          selectionMode="single"
          selection={selectedProduct}
          header={header}
          onSelectionChange={(e) => setSelectedProduct(e.value)}
          dataKey="id"
          metaKeySelection={true}
          tableStyle={{ width: "calc(100vW - 370px)" }}
          emptyMessage="Sənəd tapılmadı."
          >
          <Column field="id" header="İd" sortable></Column>
          <Column
            showFilterMenu
            field="name"
            header="Sənəd adı"
            sortable
          ></Column>
          <Column field="description" header="Sənəd açıqlaması" sortable></Column>
          <Column style={{ flex: '0 0 4rem' }} body={editTemplate}></Column>

    
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