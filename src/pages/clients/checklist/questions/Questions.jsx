import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Paginator } from 'primereact/paginator';
import { POST_NEW_QUESTION, EDIT_QUESTION, REMOVE_QUESTION, GET_ALL_QUESTIONS } from '../../../../features/clients/services/api';
import Loading from '../../../../components/Loading';
import Error from '../../../../components/Error';
import styled from 'styled-components';
import { BiSearch, BiPencil, BiTrash, BiPlus, BiCopy } from 'react-icons/bi';
import AddEditDialog from './AddEditDialog';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';

const Questions = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalRecords, setTotalRecords] = useState(0);
    const initialData = [
        { id: 1 ,questioN_ID: 0, variant: 'Hə', answeR_REASON_PERMISSION_ID: 0, answeR_IMG_PERMISSION_ID: 0, varianT_POINT: 10 },
        { id: 2, questioN_ID: 0, variant: 'Yox', answeR_REASON_PERMISSION_ID: 0, answeR_IMG_PERMISSION_ID: 0, varianT_POINT: 10 }
    ];
    const [variant, setVariant] = useState(initialData)
    const [filters, setFilters] = useState({
        pageSize: 10,
        first: 0,
        draw: 0,
        order: 'asc',
        orderColumn: 'id',
        searchList: []
    });

    const [searchCriteria, setSearchCriteria] = useState([
        { colName: 'code' },
        { colName: 'question' },
        { colName: 'desc' },
        { colName: 'questioN_GROUP_ID' },
        { colName: 'questioN_GROUP_NAME' },
        { colName: 'ratE_TYPE' },
        { colName: 'answeR_TYPE' },
        { colName: 'status' },
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newQuestion, setNewQuestion] = useState({
        id: 0,
        code: '',
        question: '',
        desc: '',
        questioN_GROUP_NAME: '',
        questioN_GROUP_ID: 0,
        ratE_TYPE_ID: 0,
        ratE_TYPE: '',
        answeR_TYPE: '',
        answeR_TYPE_ID: 0,
        status: '',
        answeR_IMG_COUNT: 0,
        questioN_POINT: 0,
        checkListQuestionVariantPostDtos: [],
        checkListQuestionImagePostDtos: []
    });

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [showVariants, setShowVariants] = useState(false);
    const [images, setImages] = useState([]);
    const [isCopy, setIsCopy] = useState(false);


    useEffect(() => {
        fetchData();
    }, [filters]);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await GET_ALL_QUESTIONS({
                ...filters,
                start: filters.first,
                pageSize: filters.pageSize
            });
            setData(response.data.data);
            setTotalRecords(response.data.totalRecords);
        } catch (error) {
            console.error('Error fetching data', error);
            setError('Error fetching data');
        }
        setLoading(false);
    };

    const handleSearchClick = () => {
        setFilters({
            ...filters,
            searchList: searchCriteria.filter(criteria => criteria.value !== '' && criteria.value !== null && criteria.value !== undefined)
        });
    };

    const handleInputChange = (colName, value) => {
        setSearchCriteria(prevCriteria =>
            prevCriteria.map(criteria =>
                criteria.colName === colName ? { ...criteria, value } : criteria
            )
        );
    };

    const onPageChange = (event) => {
        const { first, rows } = event;
        setFilters(prevFilters => ({
            ...prevFilters,
            first: first,
            pageSize: rows
        }));
    };

    const handleEditClick = (rowData) => {
        setNewQuestion({
            id: rowData.id,
            code: rowData.code,
            question: rowData.question,
            desc: rowData.desc,
            questioN_GROUP_NAME: rowData.questioN_GROUP_NAME
        });
        setIsModalOpen(true);
    };

    const handleCopyClick = (rowData) => {
        setNewQuestion(rowData);
        setIsCopy(true);
        setIsModalOpen(true);
    };

    const handleRemoveClick = (rowData) => {
        setItemToDelete(rowData);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async (item) => {
        try {
            await REMOVE_QUESTION(item.id);
            setShowDeleteModal(false);
            fetchData();
        } catch (error) {
            alert('Bilinməyən bir xəta baş verdi', error);
        }
    };

    const openModal = () => {
        setNewQuestion({
            id: 0,
            code: '',
            question: '',
            desc: '',
            questioN_GROUP_NAME: '',
            status: true
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setIsCopy(false);  // Reset the copy state

        setNewQuestion({
            id: 0,
            code: '',
            question: '',
            desc: '',
            questioN_GROUP_NAME: '',
            status: true
        });
        if(newQuestion.id == 0){
            setVariant(initialData)
        }
        setShowVariants(false);
        setVariant(initialData);
        setImages([]);

    };

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return <Error />;
    }

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSearchClick();
        }
    };

    const renderHeader = (field, placeholder) => (
        <div>
            <div>{placeholder}</div>
            <InputContainer>
                <input
                    type="text"
                    value={searchCriteria.find(criteria => criteria.colName === field)?.value || ''}
                    onChange={(e) => handleInputChange(field, e.target.value)}
                    placeholder={placeholder}
                    style={{
                        padding: '8px',
                        fontSize: '14px',
                        boxSizing: 'border-box',
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                        display: 'flex',
                        alignItems: 'center'
                    }}
                    onKeyPress={handleKeyPress}
                />
                <SearchIcon onClick={handleSearchClick}><BiSearch size={18} /></SearchIcon>
            </InputContainer>
        </div>
    );

    const filterNewQuestion = (question) => {
        const isMatchingType = question.answeR_TYPE_ID === 1 ||
                               question.answeR_TYPE_ID === 2 ||
                               question.answeR_TYPE_ID === 3 ||
                               question.answeR_TYPE_ID === 4;
        
        return {
            // id: question.id || 0,
            id: isCopy ? 0 : question.id || 0,
            code: question.code,
            question: question.question,
            desc: question.desc,
            questioN_GROUP_ID: question.questioN_GROUP_ID || 0,
            ratE_TYPE_ID: question.ratE_TYPE_ID || 0,
            answeR_TYPE_ID: question.answeR_TYPE_ID || 0,
            answeR_IMG_PERMISSION_ID: question.answeR_IMG_PERMISSION_ID || 0,
            answeR_IMG_COUNT: question.answeR_IMG_COUNT || 0,
            questioN_POINT: question.questioN_POINT || 0,
            answeR_REASON_PERMISSION_ID: question.answeR_REASON_PERMISSION_ID || 0,
            status: question.status,
            checkListQuestionVariantPostDtos: isMatchingType ? [] : variant,
            checkListQuestionImagePostDtos: images.map(image => ({
                filename: image.filename,
                filepath: '', 
                base64: image.base64,
            })),
            };
    };

    const editButtonTemplate = (rowData) => (
        <ButtonContainer>
            <EditButton onClick={() => handleEditClick(rowData)}>
                <BiPencil size={18} />
            </EditButton>
            <CopyButton onClick={() => handleCopyClick(rowData)}>
                <BiCopy size={18} />
            </CopyButton>
            <RemoveButton onClick={() => handleRemoveClick(rowData)}>
                <BiTrash size={18} />
            </RemoveButton>
        </ButtonContainer>
    );

    const onSave = async () => {
        const filteredQuestion = filterNewQuestion(newQuestion);

        if(filteredQuestion.ratE_TYPE_ID === 2 && filteredQuestion.answeR_IMG_PERMISSION_ID !== 1){
            const hasZeroPermissionId = filteredQuestion.checkListQuestionVariantPostDtos.some(
                item => item.answeR_REASON_PERMISSION_ID === 0 || item.answeR_IMG_PERMISSION_ID === 0
            );
            
            if (hasZeroPermissionId) {
                console.error("Error: One or more elements id of 0");
                return;
            }    
        }

        for (let i = 0; i < filteredQuestion.checkListQuestionVariantPostDtos.length; i++) {
            console.log(`Element ${i}: ${filteredQuestion.checkListQuestionVariantPostDtos[i].answeR_REASON_PERMISSION_ID}`);
        }
        
        if (newQuestion.id > 0 && !isCopy) {
            const updatedData = {
                ...filteredQuestion,
                checkListQuestionVariantPostDtos: filteredQuestion?.checkListQuestionVariantPostDtos?.map(({ variant, questioN_ID, ...rest }) => ({
                    ...rest,
                    questioN_ID: newQuestion?.id
                }))
            };

            if(updatedData.ratE_TYPE_ID === 2 && updatedData.answeR_IMG_PERMISSION_ID !== 1){
                const hasZeroPermissionId = updatedData.checkListQuestionVariantPostDtos.some(
                    item => item.answeR_REASON_PERMISSION_ID === 0 || item.answeR_IMG_PERMISSION_ID === 0
                );
                
                if (hasZeroPermissionId) {
                    console.error("Error: One or more elements id of 0");
                    return;
                }    
            }
    
            try {
                console.log(updatedData, 'PUTT');
                await EDIT_QUESTION(filteredQuestion);
                closeModal();
                fetchData();
            } catch (error) {
                alert('Bilinməyən bir xəta baş verdi', error);
            }
        } else {
            try {
                console.log(filteredQuestion, 'POST');
                await POST_NEW_QUESTION(filteredQuestion);
                closeModal();
                fetchData();
            } catch (error) {
                alert('Bilinməyən bir xəta baş verdi', error);
            }
        }
    };


    return (
        <Wrapper>
            <TopBar>
                <Button onClick={openModal} severity="secondary"><BiPlus size={18} />Yeni sual</Button>
            </TopBar>
            <DataTableContainer>
                <DataTable
                    value={data}
                    rows={filters.pageSize}
                    totalRecords={totalRecords}
                    dataKey="id"
                    emptyMessage="Məlumat tapılmadı"
                    className="p-datatable-sm"
                >
                    <Column
                        field="code"
                        header={renderHeader('code', 'Kod')}
                        body={(rowData) => <Truncate>{rowData.code}</Truncate>}
                        frozen
                    />
                    <Column
                        field="question"
                        header={renderHeader('question', 'Ad')}
                        body={(rowData) => <Truncate>{rowData.question}</Truncate>}
                    />
                    <Column
                        field="desc"
                        header={renderHeader('desc', 'Açıqlama')}
                        body={(rowData) => <Truncate>{rowData.desc}</Truncate>}
                    />
                    <Column
                        field="questioN_GROUP_NAME"
                        header={renderHeader('questioN_GROUP_NAME', 'Qrup adı')}
                        body={(rowData) => <Truncate>{rowData.questioN_GROUP_NAME}</Truncate>}
                    />
                    <Column
                        field="ratE_TYPE"
                        header={renderHeader('ratE_TYPE', 'Qiymətləndirmə forması')}
                        body={(rowData) => <Truncate>{rowData.ratE_TYPE}</Truncate>}
                    />
                    <Column
                        field="answeR_TYPE"
                        header={renderHeader('answeR_TYPE', 'Cavab tipi')}
                        body={(rowData) => <Truncate>{rowData.answeR_TYPE}</Truncate>}
                    />
                    <Column
                        field="status"
                        header={renderHeader('status', 'Status')}
                        body={(rowData) => <Truncate>{rowData.status}</Truncate>}
                    />
                    <Column
                        header={'#'}
                        body={editButtonTemplate}
                        style={{ textAlign: 'center', width: '5%', right: '0', position: 'sticky', background: 'white' }}
                    />
                </DataTable>
                <Paginator
                    first={filters.first}
                    rows={filters.pageSize}
                    totalRecords={totalRecords}
                    rowsPerPageOptions={[5, 10, 20]}
                    onPageChange={onPageChange}
                />
            </DataTableContainer>
            <AddEditDialog
                visible={isModalOpen}
                onHide={closeModal}
                onSave={onSave}
                newQuestion={newQuestion}
                variant={variant}
                setVariant={setVariant}
                setNewQuestion={setNewQuestion}
                header={(newQuestion?.id == 0 || isCopy) ?  'Əlavə et' : 'Dəyişdir'}
                showVariants={showVariants}
                setShowVariants={setShowVariants}
                images={images}
                setImages={setImages}
                isCopy={isCopy}
            />
            <DeleteConfirmationModal
                visible={showDeleteModal}
                onHide={() => setShowDeleteModal(false)}
                onConfirm={handleDeleteConfirm}
                itemToDelete={itemToDelete}
            />
        </Wrapper>
    );
};

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const TopBar = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 10px;
`;

const DataTableContainer = styled.div`
  overflow-y: auto;
  width: 100%;
  max-width: 82vw;
  font-size: 12px;
`;

const InputContainer = styled.div`
  margin-top: 5px;
  display: flex;
  align-items: center;
`;

const SearchIcon = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 3px;
`;

const Truncate = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const EditButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
`;

const CopyButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
`;

export default Questions;
