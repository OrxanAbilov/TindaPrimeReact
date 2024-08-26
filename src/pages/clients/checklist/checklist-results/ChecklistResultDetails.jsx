import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import styled from 'styled-components';
import { FaImages, FaInfoCircle } from 'react-icons/fa';

const ChecklistResultDetails = ({ isOpen, data, onClose }) => {
    const [selectedImages, setSelectedImages] = useState([]);
    const [imageDialogVisible, setImageDialogVisible] = useState(false);
    const [selectedReason, setSelectedReason] = useState('');
    const [reasonDialogVisible, setReasonDialogVisible] = useState(false);
    const [fullscreenImage, setFullscreenImage] = useState(null);

    const handleImageIconClick = (images) => {
        setSelectedImages(images);
        setImageDialogVisible(true);
    };

    const handleReasonIconClick = (reason) => {
        setSelectedReason(reason);
        setReasonDialogVisible(true);
    };

    const handleImageDoubleClick = (image) => {
        setFullscreenImage(image);
    };

    const renderVariants = (variants, correctVariantIds, answerVariants) => (
        variants.map(variant => {
            const answerVariant = answerVariants?.find(av => av.varianT_ID === variant.id);
            const hasImages = answerVariant?.variantImages?.length > 0;
            const variantImages = answerVariant?.variantImages || [];
            const hasReason = !!answerVariant?.reason;
            const reason = answerVariant?.reason || '';
    
            return (
                <VariantContainer key={variant.id} isCorrect={correctVariantIds.includes(variant.id)}>
                    <VariantText>{variant.variant}</VariantText>
                    <PointsAndImage>
                        {hasImages && (
                            <ImageIcon onClick={() => handleImageIconClick(variantImages)} />
                        )}
                        {hasReason && (
                            <ReasonIcon onClick={() => handleReasonIconClick(reason)} />
                        )}
                        <h5 style={{margin: '0 0 0 1rem'}}>Bal: {variant.varianT_POINT}</h5>
                    </PointsAndImage>
                </VariantContainer>
            );
        })
    );

    const renderQuestions = () => (
        data.map((detail, index) => {
            const correctVariantIds = detail.answer?.variants?.map(v => v.varianT_ID) || [];
            const hasVariants = detail.question.variants && detail.question.variants.length > 0;
            const hasQuestionImages = detail.question.images?.length > 0;
            const hasAnswerImages = detail.answer?.images?.length > 0;
            const answerVariants = detail.answer?.variants || [];
            const hasReason = !hasVariants && detail.answer?.reason;

            return (
                <QuestionBlock key={index}>
                    <QuestionContainer>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <QuestionText>{detail.question.desc}</QuestionText>
                        </div>
                        <QuestionDetails>
                            <QuestionDetailsText>
                                <div><strong>Cavab balı:</strong> {detail.answeR_POINT}</div>
                                <div><strong>Sual balı:</strong> {detail.questioN_POINT}</div>
                                <div><strong>Faiz:</strong> {detail.questioN_PERCENTAGE}%</div>
                                {hasQuestionImages && (
                                    <ImageIcon onClick={() => handleImageIconClick(detail.question.images)} />
                                )}
                            </QuestionDetailsText>
                        </QuestionDetails>
                    </QuestionContainer>
                    {hasVariants ? (
                        renderVariants(detail.question.variants, correctVariantIds, answerVariants)
                    ) : (
                        <OpenEndedContainer hasAnswer={!!detail.answer?.answer}>
                            <VariantText>{detail.answer?.answer || 'Cavab yoxdur'}</VariantText>
                            {hasAnswerImages && (
                                <ImageIcon onClick={() => handleImageIconClick(detail.answer.images)} />
                            )}
                            {hasReason && (
                                <ReasonIcon onClick={() => handleReasonIconClick(detail.answer.reason)} />
                            )}
                        </OpenEndedContainer>
                    )}
                </QuestionBlock>
            );
        })
    );

    return (
        <>
            <Dialog style={{ width: '60vw' }} visible={isOpen} onHide={onClose} header="Nəticə detalları">
                {data ? (
                    <div>
                        {renderQuestions()}
                    </div>
                ) : (
                    <p>Loading...</p>
                )}
            </Dialog>
            <ImageDialog style={{ maxWidth: '95vw' }}  visible={imageDialogVisible} onHide={() => setImageDialogVisible(false)} header="Şəkillər">
                <ImageContainer>
                    {selectedImages.map(image => (
                        <Image
                            key={image.id}
                            src={image.filepath}
                            alt={image.filename}
                            onDoubleClick={() => handleImageDoubleClick(image)}
                        />
                    ))}
                </ImageContainer>
            </ImageDialog>
            <Dialog style={{ width: '40vw' }} visible={reasonDialogVisible} onHide={() => setReasonDialogVisible(false)} header="Səbəb">
                <p>{selectedReason}</p>
            </Dialog>
            <Dialog
                style={{ width: 'fit-content', padding: 0  }}
                visible={fullscreenImage !== null}
                onHide={() => setFullscreenImage(null)}
                maximizable
            >
                {fullscreenImage && (
                    <img
                    src={fullscreenImage.filepath}
                    alt={fullscreenImage.filename}
                    style={{ width: '100%', height: 'auto', maxHeight: '90vh' }}
                />
                )}
            </Dialog>
        </>
    );
};

// Styled components
const VariantContainer = styled.div`
    background-color: ${({ isCorrect }) => (isCorrect ? '#b3ffb3' : 'white')};
    border: 1px solid gray;
    border-radius: 8px;
    padding: 10px;
    margin: 10px 0;
    display: flex;
    align-items: center;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const PointsAndImage = styled.div`
    display: flex;
    align-items: center;
    margin-left: auto; /* Push the items to the right */
`;

const VariantText = styled.p`
    flex: 1;
    margin: 0;
    font-size: 16px;
    font-weight: 500;
`;

// Updated styled component for conditional background color
const OpenEndedContainer = styled(VariantContainer)`
    background-color: ${({ hasAnswer }) => (hasAnswer ? '#e6f7ff' : '#ffcccc')}; /* Light blue for answers, light red for no answers */
`;

const ImageIcon = styled(FaImages)`
    font-size: 24px;
    color: #007bff;
    cursor: pointer;
    margin-left: 10px;
`;

const ReasonIcon = styled(FaInfoCircle)`
    font-size: 24px;
    color: #007bff;
    cursor: pointer;
    margin-left: 10px;
`;

const Image = styled.img`
    height: 100%;
    width: auto; /* Maintain aspect ratio */
    border-radius: 4px;
    object-fit: cover; /* Ensure image maintains aspect ratio */
    cursor: pointer; /* Show pointer cursor */
`;

// const FullscreenImage = styled.img`
//     width: 100%;
//     height: 'auto';
//     maxHeight: '90vh';
// `;

const QuestionContainer = styled.div`
    display: flex;
    flex-direction: column; /* Change to column to stack items vertically */
    margin-bottom: 20px;
`;

const QuestionText = styled.h3`
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #333;
    display: flex;
    align-items: center;
`;

const QuestionDetails = styled.div`
    margin-top: 10px;
    font-size: 14px;
    color: #555;
    background: #f9f9f9;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const QuestionDetailsText = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-evenly;
`;

const QuestionBlock = styled.div`
    margin-bottom: 50px; /* Adds margin below each question block */
`;

const ImageDialog = styled(Dialog)`
    .p-dialog-content {
        padding: 0;
    }
`;

const ImageContainer = styled.div`
    display: flex;
    flex-wrap: wrap; /* Allow images to wrap to the next line */
    overflow-y: auto; /* Enable vertical scrolling if needed */
    height: 400px; /* Set a maximum height for the container */
    padding: 10px; /* Optional padding around images */
    gap: 10px; /* Space between images */
    justify-content: center; /* Center images horizontally */
    align-items: center; /* Center images vertically if needed */
`;

export default ChecklistResultDetails;
