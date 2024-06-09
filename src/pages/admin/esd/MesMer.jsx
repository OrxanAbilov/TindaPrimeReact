import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { GER_MESMER_LIST,DELETE_MESMER } from "../../../features/admin/esd/MesMer/services/api"
import { useDispatch, useSelector } from "react-redux";
import {
  setData,
  setError,
  setIsLoading,
} from "../../../features/admin/esd/MesMer/mesMerSlice";
import { InputText } from "primereact/inputtext";
import Loading from "../../../components/Loading";
import Error from "../../../components/Error";
import styled from "styled-components";
import { Button } from "primereact/button";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { setRef } from "@mui/material";
import { useToast } from "../../../context/ToastContext";

export default function MesMer() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const { data, error, isLoading } = useSelector((state) => state.mesMerSlice);
  const [globalFilter, setGlobalFilter] = useState("");
  const [refresh, setRefresh] = useState(false);
  const { showToast } = useToast()

  const fetchData = async () => {
    try {
      dispatch(setIsLoading(true));
      const res = await GER_MESMER_LIST();
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
      setRefresh(false);
    };
  }, [refresh]);

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

  const confirmDelete = (id) => {

    confirmDialog({
        message: 'Məsuliyyət mərkəzini silmək istədiyinizə əminsiniz?',
        header: 'Məlumatın Silinməsi',
        icon: 'pi pi-info-circle',
        defaultFocus: 'handleDelete',
        acceptClassName: 'p-button-danger',
        accept: () => handleDelete(id),
        acceptLabel: "Sil",
        rejectLabel: "Ləğv et"
    });
};

const handleDelete = async (id) => {
  try {
      const responseData = await DELETE_MESMER(id);
      showToast('success', 'Uğurlu əməliyyat', 'Təklif uğurla silindi', 3000);
      setRefresh(true);
  } catch (error) {
      // Handle error
      showToast('error', 'Xəta baş verdi', error.response.data.Exception[0], 3000);
      //toast.current.show({ severity: 'error', summary: 'Xəta baş verdi', detail: error.response.data.Exception[0], life: 3000 });
      // Optionally, you can show an error message to the user
  }

};



  const editTemplate = (rowData) => {
    return <Button type="button" icon="pi pi-file-edit" onClick={() => navigate(`/admin/esd/mesmer/edit/${rowData.id}`)} />;
  };

  const deleteTemplate = (rowData) => {
    return <Button icon="pi pi-trash" className="p-button-danger p-button-text" onClick={() => confirmDelete(rowData.id)} />;
  };

  return (
    <Wrapper>
      <ConfirmDialog />
      <HeaderButton>
      <h2>Məsuliyyət mərkəzləri</h2>
      <Button
        icon="pi pi-plus-circle"
        raised
        label="Əlavə et"
        severity="success"
        onClick={()=>navigate("/admin/esd/mesmer/add/")}
      />
      </HeaderButton>
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
          emptyMessage="Məsuliyyət mərkəzi yoxdur"
        >
          <Column field="id" header="İd" sortable></Column>
          <Column
            showFilterMenu
            field="code"
            header="Kodu"
            sortable
          ></Column>
          <Column field="name" header="Adı" sortable></Column>
          <Column style={{ flex: '0 0 4rem' }} body={editTemplate}></Column>
          <Column style={{ flex: '0 0 4rem' }} body={deleteTemplate}></Column>


        </DataTable>
      ) : error && !isLoading ? (
        <Error />
      ) : (
        <Loading />
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

const HeaderButton = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;