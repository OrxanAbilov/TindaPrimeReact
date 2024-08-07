import React, { useEffect, useState, useRef } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { BiDownArrowAlt, BiPlus, BiX } from 'react-icons/bi';
import './AddEditDialog.css'; // Create a separate CSS file for styling
import PropTypes from 'prop-types';
import {
    GET_QUESTION_BY_ID,
    GET_QUESTION_GROUPS_FOR_DROPDOWN,
    GET_RATE_TYPES,
    GET_CHECKLIST_ANSWER_TYPE_BY_ID,
    GET_CHECKLIST_PERMISSION_BY_ID,
    GET_CHECKLIST_QUESTION_VARIANTS_BY_QUESTION_ID,
    GET_CHECKLIST_QUESTION_IMAGE_BY_QUESTION_ID
} from '../../../../features/clients/services/api';
import Variants from './Variants';

const AddEditDialog = ({ visible, onHide, newQuestion, setNewQuestion, onSave, header, variant, setVariant, showVariants, images, setImages, setShowVariants }) => {
    const [questionGroups, setQuestionGroups] = useState([]);
    const [rateTypes, setRateTypes] = useState([]);
    const [answerTypes, setAnswerTypes] = useState([]);
    const [imagePermissions, setImagePermissions] = useState([]);
    const [reasonPermissions, setReasonPermissions] = useState([]);
    const [viewImageIndex, setViewImageIndex] = useState(null); // State to track the index of the image being viewed

    const [validationErrors, setValidationErrors] = useState({});

    const fileInputRef = useRef(null);

    const statusOptions = [
        { label: 'Aktiv', value: true },
        { label: 'Passiv', value: false }
    ];

    useEffect(() => {
        if (newQuestion.id) {
            fetchVariants(newQuestion.id);
        }
    }, [newQuestion.id]);


    const fetchVariants = async (questionId) => {
        try {
            const data = await GET_CHECKLIST_QUESTION_VARIANTS_BY_QUESTION_ID(questionId);
            setVariant(data.data);
        } catch (error) {
            console.error('Error fetching variants:', error);
        }
    };

    const toggleVariants = async () => {
        setShowVariants(!showVariants);
        if ((newQuestion.answeR_TYPE_ID == 5 || newQuestion.answeR_TYPE_ID == 9 || newQuestion.answeR_TYPE_ID == 10 || newQuestion.answeR_TYPE_ID == 8) && newQuestion.id !== 0) {
            if (!showVariants) {
                fetchVariants(newQuestion.id); // Fetch variants when toggling showVariants
            }
        }
    };

    useEffect(() => {
        fetchQuestionGroups();
        fetchRateTypes();
        fetchImagePermissions();
        fetchReasonPermissions();
    }, []);

    useEffect(() => {
        if (newQuestion.id) {
            fetchQuestionDetails(newQuestion.id);
        }
    }, [newQuestion.id]);

    useEffect(() => {
        if (newQuestion.ratE_TYPE_ID) {
            fetchAnswerTypes(newQuestion.ratE_TYPE_ID);
        }
    }, [newQuestion.ratE_TYPE_ID]);

    useEffect(() => {
        if (newQuestion.ratE_TYPE_ID !== 1) {
            setNewQuestion(prevState => ({
                ...prevState,
                questioN_POINT: null
            }));
        }
    }, [newQuestion.ratE_TYPE_ID]);

    useEffect(() => {
        if (newQuestion.ratE_TYPE_ID !== 1) {
            setNewQuestion(prevState => ({
                ...prevState,
                answeR_REASON_PERMISSION_ID: null
            }));
        }
    }, [newQuestion.ratE_TYPE_ID]);

    useEffect(() => {
        if (newQuestion.answeR_IMG_PERMISSION_ID !== 1) {
            setNewQuestion(prevState => ({
                ...prevState,
                answeR_IMG_COUNT: null
            }));
        }
    }, [newQuestion.answeR_IMG_PERMISSION_ID]);



    const fetchQuestionGroups = async () => {
        try {
            const data = await GET_QUESTION_GROUPS_FOR_DROPDOWN();
            setQuestionGroups(data.data);
        } catch (error) {
            console.error('Error fetching question groups:', error);
        }
    };

    const fetchRateTypes = async () => {
        try {
            const data = await GET_RATE_TYPES();
            setRateTypes(data.data);
        } catch (error) {
            console.error('Error fetching rate types:', error);
        }
    };

    const fetchAnswerTypes = async (rateTypeId) => {
        try {
            const data = await GET_CHECKLIST_ANSWER_TYPE_BY_ID(rateTypeId);
            setAnswerTypes(data.data);
        } catch (error) {
            console.error('Error fetching answer types:', error);
        }
    };

    const fetchImagePermissions = async () => {
        try {
            const data = await GET_CHECKLIST_PERMISSION_BY_ID(1); //  1 image permissions
            setImagePermissions(data.data.filter(permission => permission.type === 1));
        } catch (error) {
            console.error('Error fetching image permissions:', error);
        }
    };

    const fetchReasonPermissions = async () => {
        try {
            const data = await GET_CHECKLIST_PERMISSION_BY_ID(2); //  2  reason permissions
            setReasonPermissions(data.data.filter(permission => permission.type === 2));
        } catch (error) {
            console.error('Error fetching reason permissions:', error);
        }
    };

    const fetchQuestionDetails = async (id) => {
        try {
            const data = await GET_QUESTION_BY_ID(id);
            const questionData = data.data;
            setNewQuestion({
                ...questionData,
                questioN_GROUP_NAME: questionData.questioN_GROUP_NAME || '',
                questioN_GROUP_ID: questionData.questioN_GROUP_ID || '',
                ratE_TYPE: questionData.ratE_TYPE || '',
                ratE_TYPE_ID: questionData.ratE_TYPE_ID || ''
            });
        } catch (error) {
            console.error('Error fetching question details:', error);
        }
    };

    const handleImageUpload = (event) => {
        const files = event.target.files;
        if (files) {
            Array.from(files).forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64String = reader.result.split(',')[1];
                    const newImage = {
                        filename: file.name,
                        filepath: file.name,
                        base64: base64String,
                        questioN_ID: newQuestion.id || 0
                    };
                    setImages(prevImages => [...prevImages, newImage]);
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const handlePlusClick = () => {
        fileInputRef.current.click();
    };

    const handleImageDelete = (index) => {
        const updatedImages = [...images];
        updatedImages.splice(index, 1);
        setImages(updatedImages);
    };

    const fetchImageAsBase64 = async (filePath) => {
        try {
            console.log('Fetching image from:', filePath); // Log file path
            const response = await fetch(filePath);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const blob = await response.blob();
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result.split(',')[1]);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
        } catch (error) {
            console.error('Error fetching image as base64:', error);
            return '';
        }
    };

    useEffect(() => {
        async function fetchImages() {
            if (newQuestion.id) {
                try {
                    const data = await GET_CHECKLIST_QUESTION_IMAGE_BY_QUESTION_ID(newQuestion.id);
                    const imagesWithBase64 = await Promise.all(data.data.map(async (image) => {
                        const base64String = await fetchImageAsBase64(image.filepath);
                        return {
                            ...image,
                            base64: base64String,
                            filepath: image.filepath
                        };
                    }));
                    setImages(imagesWithBase64);
                } catch (error) {
                    console.error('Error fetching images:', error);
                }
            }
        }
        fetchImages();
    }, [newQuestion.id]);


    const handleImageDoubleClick = (index) => {
        setViewImageIndex(index);
    };

    // Function to close the full-size image view
    const handleCloseFullSizeImage = () => {
        setViewImageIndex(null);
    };

    const validateFields = () => {
        let errors = {};
    
        if (!newQuestion.question) errors.question = '* Ad tələb olunur';
        if (!newQuestion.questioN_GROUP_ID) errors.questioN_GROUP_ID = '* Sual qrupu tələb olunur';
        if (!newQuestion.desc) errors.desc = '* Açıqlama tələb olunur';
        if (newQuestion.status === undefined || newQuestion.status === null) errors.status = '* Status tələb olunur';
        if (!newQuestion.ratE_TYPE_ID) errors.ratE_TYPE_ID = '* Qiymətləndirmə forması tələb olunur';
        if (!newQuestion.answeR_TYPE_ID) errors.answeR_TYPE_ID = '* Cavab tipi tələb olunur';
        if (!newQuestion.answeR_IMG_PERMISSION_ID) errors.answeR_IMG_PERMISSION_ID = '* Şəkil icazəsi tələb olunur';
        if (newQuestion.ratE_TYPE_ID === 1 && newQuestion.questioN_POINT === undefined) errors.questioN_POINT = '* Sual balı tələb olunur';
    
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSave = () => {
        if (validateFields()) {
            onSave();
        }
    };
    

    return (
        <Dialog header={header} visible={visible} style={{ width: '95vw' }} modal onHide={onHide}>
            <div className="p-fluid">
                <div className="flex" style={{ gap: '2rem' }}>
                    <div className="p-field" style={{ width: '30%' }}>
                        <label htmlFor="code">Kod</label>
                        <InputText
                            id="code"
                            value={newQuestion.code}
                            onChange={(e) => setNewQuestion({ ...newQuestion, code: e.target.value })}
                            className="p-inputtext-lg p-d-block my-2"
                            style={{ width: '100%' }}
                            required
                            disabled
                        />
                    </div>
                    <div className="p-field" style={{ width: '30%' }}>
                        <label htmlFor="question">Ad</label>
                        <InputText
                            id="question"
                            value={newQuestion.question}
                            onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                            className="p-inputtext-lg p-d-block my-2"
                            style={{ width: '100%' }}
                            required
                        />
                            {validationErrors.question && <small className="p-error">{validationErrors.question}</small>}
                    </div>
                    <div className="p-field" style={{ width: '30%' }}>
                        <label htmlFor="questioN_GROUP_ID">Sual qrupu</label>
                        <Dropdown
                            id="questioN_GROUP_NAME"
                            value={newQuestion.questioN_GROUP_ID}
                            options={questionGroups.map(group => ({
                                label: group.name,
                                value: group.id
                            }))}
                            onChange={(e) => setNewQuestion({
                                ...newQuestion,
                                questioN_GROUP_ID: e.value,
                                questioN_GROUP_NAME: questionGroups.find(group => group.id === e.value)?.name || ''
                            })}
                            placeholder="Sual qrupu seçin"
                            className="p-inputtext-lg p-d-block my-2"
                            style={{ width: '100%' }}
                            required
                        />
                            {validationErrors.questioN_GROUP_ID && <small className="p-error">{validationErrors.questioN_GROUP_ID}</small>}
                    </div>
                </div>
                <div className="flex" style={{ gap: '2rem' }}>
                    <div className="p-field" style={{ width: '62.4%' }}>
                        <label htmlFor="desc">Açıqlama</label>
                        <InputText
                            id="desc"
                            value={newQuestion.desc}
                            onChange={(e) => setNewQuestion({ ...newQuestion, desc: e.target.value })}
                            className="p-inputtext-lg p-d-block my-2"
                            style={{ width: '100%' }}
                            required
                        />
                            {validationErrors.desc && <small className="p-error">{validationErrors.desc}</small>}
                    </div>
                    <div className="p-field" style={{ width: '30%' }}>
                        <label htmlFor="status">Status</label>
                        <Dropdown
                            id="status"
                            value={newQuestion.status}
                            options={statusOptions}
                            onChange={(e) => setNewQuestion({ ...newQuestion, status: e.value })}
                            placeholder="Status seçin"
                            className="p-inputtext-lg p-d-block my-2"
                            style={{ width: '100%' }}
                            required
                        />
                            {validationErrors.status && <small className="p-error">{validationErrors.status}</small>}
                    </div>
                </div>
                <div className="flex" style={{ gap: '2rem' }}>
                    <div className="p-field" style={{ width: '30%' }}>
                        <label htmlFor="ratE_TYPE_ID">Qiymətləndirmə forması</label>
                        <Dropdown
                            id="ratE_TYPE_ID"
                            value={newQuestion.ratE_TYPE_ID}
                            options={rateTypes.map(type => ({
                                label: type.name,
                                value: type.id
                            }))}
                            onChange={(e) => setNewQuestion({
                                ...newQuestion,
                                ratE_TYPE_ID: e.value,
                                ratE_TYPE: rateTypes.find(type => type.id === e.value)?.name || ''
                            })}
                            placeholder="Qiymətləndirmə tipi seçin"
                            className="p-inputtext-lg p-d-block my-2"
                            style={{ width: '100%' }}
                            required
                        />
                            {validationErrors.ratE_TYPE_ID && <small className="p-error">{validationErrors.ratE_TYPE_ID}</small>}
                    </div>
                    <div className="p-field" style={{ width: '30%' }}>
                        <label htmlFor="answeR_TYPE_ID">Cavab tipi</label>
                        <Dropdown
                            id="answeR_TYPE_ID"
                            value={newQuestion.answeR_TYPE_ID}
                            options={answerTypes.map(type => ({
                                label: type.name,
                                value: type.id
                            }))}
                            onChange={(e) => setNewQuestion({ ...newQuestion, answeR_TYPE_ID: e.value })}
                            placeholder="Cavab tipi seçin"
                            className="p-inputtext-lg p-d-block my-2"
                            style={{ width: '100%' }}
                            required
                        />
                            {validationErrors.answeR_TYPE_ID && <small className="p-error">{validationErrors.answeR_TYPE_ID}</small>}
                    </div>
                    <div className="p-field" style={{ width: '30%' }}>
                        <label htmlFor="answeR_IMG_PERMISSION_ID">Şəkil icazəsi</label>
                        <Dropdown
                            id="answeR_IMG_PERMISSION_ID"
                            value={newQuestion.answeR_IMG_PERMISSION_ID}
                            options={imagePermissions.map(permission => ({
                                label: permission.name,
                                value: permission.id
                            }))}
                            onChange={(e) => setNewQuestion({ ...newQuestion, answeR_IMG_PERMISSION_ID: e.value })}
                            placeholder="Şəkil icazəsi seçin"
                            className="p-inputtext-lg p-d-block my-2"
                            style={{ width: '100%' }}
                            required
                        />
                            {validationErrors.answeR_IMG_PERMISSION_ID && <small className="p-error">{validationErrors.answeR_IMG_PERMISSION_ID}</small>}
                    </div>
                </div>
                <div className="flex" style={{ gap: '2rem' }}>
                <div className="p-field" style={{ width: '30%' }}>
                    {newQuestion.answeR_IMG_PERMISSION_ID !== 1 && (
                        <>
                            <label htmlFor="answeR_IMG_COUNT">Şəkil sayı</label>
                            <InputText
                                type='number'
                                id="answeR_IMG_COUNT"
                                value={newQuestion.answeR_IMG_COUNT}
                                onChange={(e) => setNewQuestion({ ...newQuestion, answeR_IMG_COUNT: e.target.value })}
                                className="p-inputtext-lg p-d-block my-2"
                                style={{ width: '100%' }}
                            />
                        </>
                    )}
                </div>

                    {newQuestion.ratE_TYPE_ID === 1 && (
                        <div className="p-field" style={{ width: '30%' }}>
                            <label htmlFor="answeR_REASON_PERMISSION_ID">Səbəb icazəsi</label>
                            <Dropdown
                                id="answeR_REASON_PERMISSION_ID"
                                value={newQuestion.answeR_REASON_PERMISSION_ID}
                                options={reasonPermissions.map(permission => ({
                                    label: permission.name,
                                    value: permission.id
                                }))}
                                onChange={(e) => setNewQuestion({ ...newQuestion, answeR_REASON_PERMISSION_ID: e.value })}
                                placeholder="Səbəb icazəsi seçin"
                                className="p-inputtext-lg p-d-block my-2"
                                style={{ width: '100%' }}
                            />
                        </div>
                    )}
                    {newQuestion.ratE_TYPE_ID === 1 && (
                        <div className="p-field" style={{ width: '30%' }}>
                            <label htmlFor="questioN_POINT">Sual balı</label>
                            <InputText
                                type='number'
                                id="questioN_POINT"
                                value={newQuestion.questioN_POINT || null}
                                onChange={(e) => setNewQuestion({ ...newQuestion, questioN_POINT: e.target.value })}
                                className="p-inputtext-lg p-d-block my-2"
                                style={{ width: '100%' }}
                            />
                        </div>
                    )}
                </div>

                <div className="button-and-image-container" style={{ display: 'flex', alignItems: 'center', marginTop: '1rem', marginRight: '13%' }}>
                    {!(newQuestion.answeR_TYPE_ID === 1 || newQuestion.answeR_TYPE_ID === 2 || newQuestion.answeR_TYPE_ID === 3 || newQuestion.answeR_TYPE_ID === 4) && (
                        <Button
                            severity="secondary"
                            icon={<BiDownArrowAlt />}
                            iconPos="left"
                            label="Variantları Göstər"
                            style={{ fontSize: '16px', width: '15%', margin: '10px 18% 10px 0' }}
                            onClick={toggleVariants}
                        />
                    )}
                    <label htmlFor="image-upload-container">Şəkillər</label>
                    <div className="image-upload-container" style={{ marginLeft: '1%' }}>
                        {images.map((image, index) => (
                            <div className="image-square" key={index}>
                                <img src={image.base64 ? `data:image/png;base64,${image.base64}` : image.filepath } alt={image.filename}
                                onDoubleClick={() => handleImageDoubleClick(index)} // Handle double-click event
                                />
                                <BiX
                                    className="trash-icon"
                                    onClick={() => handleImageDelete(index)}
                                />
                            </div>
                        ))}
                        <div className="image-square">
                            <input
                                type="file"
                                ref={fileInputRef}
                                accept="image/*"
                                onChange={handleImageUpload}
                            />
                            <span className="plus-icon" onClick={handlePlusClick}>
                                <BiPlus />
                            </span>
                        </div>
                    </div>
                </div>



                {showVariants && !(newQuestion.answeR_TYPE_ID === 1 || newQuestion.answeR_TYPE_ID === 2 || newQuestion.answeR_TYPE_ID === 3 || newQuestion.answeR_TYPE_ID === 4) && (
                    <Variants
                        newQuestion={newQuestion}
                        setNewQuestion={setNewQuestion}
                        ratE_TYPE_ID={newQuestion.ratE_TYPE_ID}
                        answeR_IMG_PERMISSION_ID={newQuestion.answeR_IMG_PERMISSION_ID}
                        answeR_TYPE_ID={newQuestion.answeR_TYPE_ID}
                        data={variant}
                        setData={setVariant}
                    />
                )}

                <Dialog visible={viewImageIndex !== null} onHide={handleCloseFullSizeImage} maximizable style={{ width: 'fit-content', padding: 0 }}>
                    {images[viewImageIndex] && (
                        <img
                            // src={`data:image/jpeg;base64,${images[viewImageIndex].base64}`}
                            src={images[viewImageIndex].base64 ? `data:image/png;base64,${images[viewImageIndex].base64}` : images[viewImageIndex].filepath }
                            alt={images[viewImageIndex].filename}
                            style={{ width: '100%', height: 'auto', maxHeight: '90vh' }}
                        />
                    )}
                </Dialog>
                <div className="p-dialog-footer" style={{ marginTop: '15px', padding: '0' }}>
                    <Button label="Yadda saxla" onClick={handleSave } className="p-button-primary" />
                    <Button label="Ləğv et" onClick={onHide} className="p-button-secondary" />
                </div>
            </div>
        </Dialog>
    );
};

AddEditDialog.propTypes = {
    visible: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired,
    newQuestion: PropTypes.object.isRequired,
    setNewQuestion: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    header: PropTypes.string.isRequired
};


export default AddEditDialog;
