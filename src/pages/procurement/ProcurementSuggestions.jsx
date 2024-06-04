import { Button } from "primereact/button";
import styled from "styled-components";
import { Fragment, useEffect, useRef, useState } from "react";
import { GET_ALL_SUGESTION_BY_PROCUREMENT_ID, DELETE_PROCUREMENT_SUGGESTION, DOWNLOAD_SUGGESTION_FILE_BY_ID, SELECT_SUGGESTION } from "../../features/procurement/services/api";
import Loading from "../../components/Loading";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import 'primeicons/primeicons.css';
import { Card } from "primereact/card";
import { Toast } from "primereact/toast";
import { Accordion, AccordionTab } from "primereact/accordion";
import React from "react";
import { useToast } from "../../context/ToastContext";
import { Dialog } from "primereact/dialog";
import SuggestionNewDialog from "./components/SuggestionNewDialog";
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { InputSwitch } from "primereact/inputswitch";



export default function ProcurementSuggestions({ procurement }) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);
    const toast = useRef(null);
    //const { id } = useParams();
    const [data, setData] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const { showToast } = useToast()
    const [visible, setVisible] = useState(false);
    const fetchData = async () => {
        try {
            setIsLoading(true);
            const res = await GET_ALL_SUGESTION_BY_PROCUREMENT_ID(procurement.id);
            const sortedData = res.data.sort((a, b) => a.isDeleted - b.isDeleted); // Sort by total in ascending order
            setData(sortedData);
            setError(false);
        } catch (error) {
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
            setRefresh(false);
        };
    }, [refresh]);

    const downloadFile = async (id, fileName) => {
        const responseFileData = await DOWNLOAD_SUGGESTION_FILE_BY_ID(id);
        const link = document.createElement('a');
        link.href = `data:application/octet-stream;base64,${responseFileData.data}`;
        link.download = fileName;
        link.click();
    };

    const selectSuggestion = async (suggestionId, isSelected) => {
        try {
            const responseData = await SELECT_SUGGESTION(suggestionId, isSelected);
            isSelected ? (
                showToast('success', 'Uğurlu əməliyyat', 'Təklif seçilmiş təyin edildi', 3000)
            )
                :
                (
                    showToast('success', 'Uğurlu əməliyyat', 'Təklif seçilməmiş təyin edildi', 3000));
            setRefresh(true);
        } catch (error) {
            // Handle error
            toast.current.show({ severity: 'error', summary: 'Xəta baş verdi', detail: error.response.data.Exception[0], life: 3000 });
            // Optionally, you can show an error message to the user
        }
    }

    const confirmDelete = (id) => {

        confirmDialog({
            message: 'Təklifi silmək istədiyinizə əminsiniz?',
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
            const responseData = await DELETE_PROCUREMENT_SUGGESTION(id);
            showToast('success', 'Uğurlu əməliyyat', 'Təklif uğurla silindi', 3000);
            setRefresh(true);
        } catch (error) {
            // Handle error
            toast.current.show({ severity: 'error', summary: 'Xəta baş verdi', detail: error.response.data.Exception[0], life: 3000 });
            // Optionally, you can show an error message to the user
        }

    };

    const createDynamicTabs = () => {
        return data.map((suggestion, i) => {
            const total = suggestion.total;
            const headerData = suggestion.clientCode + "-" + suggestion.clientName + "   | Məbləğ:" + suggestion.total + " " + suggestion.curr;
            return (
                <AccordionTab
                    style={{ background: "#339967 !important" }}
                    header={
                        suggestion.isSelected ? (
                            <CustomAccordionHeader>
                                <span className="font-bold white-space-nowrap">{headerData}</span>

                            </CustomAccordionHeader>) : (
                            <HeaderWrapper>
                                <span className="font-bold white-space-nowrap">{headerData}</span>

                            </HeaderWrapper>
                        )
                    } key={headerData}
                >
                    <Card>
                        {procurement.status === 6 ? (<></>) : (
                            <DeleteButton>
                                <InputSwitch checked={suggestion.isSelected} onChange={(e) => selectSuggestion(suggestion.id, e.value)} />
                                <ConfirmDialog />
                                <Button icon="pi pi-trash" className="p-button-danger p-button-text" onClick={() => confirmDelete(suggestion.id)} />
                            </DeleteButton>
                        )}
                        <Information>
                            <InfoGroup>
                                <TitleInfo>Kodu:</TitleInfo>
                                <Desc>{suggestion.clientCode}</Desc>
                            </InfoGroup>

                            <InfoGroup>
                                <TitleInfo>Adı:</TitleInfo>
                                <Desc>{suggestion.clientName}</Desc>
                            </InfoGroup>
                            <InfoGroup>
                                <TitleInfo>Məbləğ:</TitleInfo>
                                <Desc>{suggestion.total + " " + suggestion.curr}</Desc>
                            </InfoGroup>

                            <InfoGroup>
                                <TitleInfo>Fayllar:</TitleInfo>
                                {data[i]?.files?.length > 0 ? (
                                    data[i]?.files.map((file) => (
                                        <Button
                                            key={file.id}
                                            label={file.fileName}
                                            severity="secondary"
                                            outlined
                                            size="small"
                                            style={{ width: '350px' }}
                                            icon="pi pi-arrow-circle-down"
                                            iconPos="left"
                                            onClick={() => downloadFile(file.id, file.fileName)}
                                        />
                                    ))
                                ) : (
                                    <Desc>--</Desc>
                                )}
                            </InfoGroup>

                        </Information>

                        <br />

                        <DataTable
                            value={suggestion.items}
                            selectionMode="row"
                            dataKey="suggestion"
                            //metaKeySelection={true}
                            emptyMessage="Mal sətri tapılmadı.">
                            <Column showFilterMenu field="cardType" header="Tip" sortable></Column>
                            <Column showFilterMenu field="itemCode" header="Mal Kodu" sortable></Column>
                            <Column showFilterMenu field="itemName" header="Mal Adı" sortable></Column>
                            {/* <Column showFilterMenu field="erpId" header="Erp-Id" sortable></Column> */}
                            <Column showFilterMenu field="sonAlis" header="Son alış" sortable></Column>
                            <Column field="suggestedAmount" header="Tələb miqdarı" sortable></Column>
                            <Column field="amount" header="Təklif miqdarı" sortable></Column>
                            <Column field="price" header="Qiymət" sortable></Column>
                            <Column field="curr" header="Valyuta" sortable></Column>
                            <Column
                                field="isIncludeVat"
                                header="ƏDV"
                                body={(rowData) => rowData.isIncludeVat ? 'Daxil' : 'Xaric'}
                                sortable
                            ></Column>
                            <Column field="total" header="Toplam" sortable></Column>
                        </DataTable>
                    </Card>
                </AccordionTab>
            );
        });
    };


    return (<>
        <br />
        <Toast ref={toast} />
        <div className="flex flex-wrap gap-2">

            <TitleSuggestion>Təkliflər:  </TitleSuggestion>
            {procurement.status === 6 ? (<></>) : (
            <div style={{ flex: '1', textAlign: 'right' }}>
                <Button label="Əlavə et" severity="success" icon="pi pi-plus" onClick={() => setVisible(true)} />
            </div>
            )}
        </div>
        <Dialog header="Yeni Təklif" visible={visible} maximizable style={{ width: '80vw' }} onHide={() => setVisible(false)}>
            <SuggestionNewDialog procDetails={procurement} onClose={() => setVisible(false)} setRefresh={setRefresh} />
        </Dialog>
        <Fragment>
            {data && !error && !isLoading && data.length > 0 ? (
                <div className="card">
                    <Accordion>{createDynamicTabs()}</Accordion>
                    <br />
                    <br />


                </div>



            ) : !data && !error && isLoading ? (
                <Loading />
            ) : (
                <>
                    <p>Heç Bir Təklif Yoxdur</p>
                    <br />
                    <br />
                </>
            )}
        </Fragment>
    </>
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

const CustomAccordionHeader = styled(HeaderWrapper)`
  background-color: #339967;
  color: white;
  padding: 10px;
  border-radius: 4px;
`;


const DeleteButton = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;
