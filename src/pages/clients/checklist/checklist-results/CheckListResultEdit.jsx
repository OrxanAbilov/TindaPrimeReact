import React, { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import styled from "styled-components";
import { FaImages, FaInfoCircle } from "react-icons/fa";
import { GET_CHECKLIST_RESULT_DETAILS_BY_CHEKLIST_ID, UPDATE_CHECKLIST_OPERATION, GET_SALESMAN_FOR_COMBO } from "../../../../features/clients/services/api";
import { Checkbox } from "primereact/checkbox";
import { RadioButton } from "primereact/radiobutton";
import { Button } from "primereact/button";
import { useParams, useLocation } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import Loading from "../../../../components/Loading";
import Error from "../../../../components/Error";
import { Dropdown } from 'primereact/dropdown';
import ClientSelectionDialog from "./ClientSelectionDialog";
import { useNavigate } from 'react-router-dom';

const ChecklistResultEdit = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [selectedImages, setSelectedImages] = useState([]);
  const [imageDialogVisible, setImageDialogVisible] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [reasonDialogVisible, setReasonDialogVisible] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [data, setData] = useState(null);
  const [answers, setAnswers] = useState({});
  const [rateTypes, setRateTypes] = useState({});
  const { id } = useParams();
  const location = useLocation();
  const [clientDialogVisible, setClientDialogVisible] = useState(false);
  const [clientCode, setClientCode] = useState(
    location.state?.clienT_CODE || ""
  );
  const [salesmen, setSalesmen] = useState([]);
  const [salesCode, setSalesCode] = useState(
    location.state?.slS_CODE_RESPONSIBLE || ""
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Initial Client Code:", clientCode);
    console.log("Initial Sales Code:", salesCode);
  }, [clientCode, salesCode]);


  useEffect(() => {
    const fetchSalesmen = async () => {
      try {
        const response = await GET_SALESMAN_FOR_COMBO();
        
        if (response && response.data) {
          const formattedSalesmen = response.data.map((salesman) => ({
            label: `${salesman.slS_CODE} - ${salesman.fullName}`, 
            value: salesman.slS_CODE, 
          }));
          setSalesmen(formattedSalesmen);
        }
      } catch (error) {
        console.error('Error fetching salesmen:', error);
      }
    };
  
    fetchSalesmen();
  }, []);
  
  
  useEffect(() => {
    setLoading(true);
    setError(null);

    const rateTypeMapping = {
      1: "Tam ədəd",
      2: "Kəsr ədəd",
      3: "Tək sətirlik mətn",
      4: "Çox sətirlik mətn",
      5: "Hə/yox",
      6: "Seçmə",
      7: "Çox seçimli",
      8: "Hə/yox",
      9: "Seçmə",
      10: "Çox seçimli",
    };
    setRateTypes(rateTypeMapping);

    GET_CHECKLIST_RESULT_DETAILS_BY_CHEKLIST_ID(id)
      .then((response) => {
        setData(response.data);
        console.log(response);
        const initialAnswers = {};
        response.data.forEach((detail) => {
          if (detail.question.variants?.length > 0) {
            initialAnswers[detail.question.id] =
              detail.answer?.variants?.map((v) => v.varianT_ID) || [];
          } else {
            initialAnswers[detail.question.id] = detail.answer?.answer || "";
          }
        });
        setAnswers(initialAnswers);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching checklist result details:", error);
      });
  }, []);

  const handleClientSelect = (selectedClientCode) => {
    setClientCode(selectedClientCode);
  };

  const handleImageIconClick = (images) => {
    setSelectedImages(images);
    setImageDialogVisible(true);
  };

// Function to handle reason icon click and show the dialog with the selected reason
const handleReasonIconClick = (reason, questionId, isVariant, variantId = null) => {
  setSelectedReason(reason); // Set the selected reason in state
  setCurrentEditingQuestion({ questionId, isVariant, variantId }); // Track which question's reason is being edited
  setReasonDialogVisible(true); // Show the dialog
};

const findVariantReason = (data, questionId, variantId) => {
  const question = data.find(item => item.question.id === questionId);
  
  if (question && question.answer) {
    const variant = question.answer.variants.find(v => v.varianT_ID === variantId); 
    return variant ? variant.reason : null; 
  }
  return null; 
};

const [currentEditingQuestion, setCurrentEditingQuestion] = useState(null); 

const handleSaveReason = () => {
  const { questionId, isVariant, variantId } = currentEditingQuestion;

  setData((prevData) =>
      prevData.map((detail) => {
          if (detail.question.id === questionId) {
              if (isVariant && variantId !== null) {
                  detail.answer.variants = detail.answer.variants.map((variant) =>
                      variant.varianT_ID === variantId ? { ...variant, reason: selectedReason } : variant
                  );
              } else {
                  detail.answer.reason = selectedReason;
              }
          }
          return detail;
      })
  );

  setReasonDialogVisible(false);
};

  const handleImageDoubleClick = (image) => {
    setFullscreenImage(image);
  };

  const handleOpenEndedChange = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleVariantChange = (questionId, variantId, isMultiple) => {
    setAnswers((prev) => {
      const currentSelections = prev[questionId] || [];
  
      if (isMultiple) {
        if (currentSelections.includes(variantId)) {
          return {
            ...prev,
            [questionId]: currentSelections.filter((id) => id !== variantId),
          };
        } else {
          return { ...prev, [questionId]: [...currentSelections, variantId] };
        }
      } else {
        if (currentSelections[0] === variantId) {
          return { ...prev, [questionId]: [] };
        } else {
          return { ...prev, [questionId]: [variantId] }
        }
      }
    });
  };
  
  const handleSave = async () => {
    setLoading(true);
    setError(null);

    const formattedData = {
        id: id,
        clienT_CODE: clientCode,
        slS_CODE_RESPONSIBLE: salesCode,
        answers: data.map((detail) => {
            const answer = answers[detail.question.id];
            const isVariantQuestion = detail.question.variants?.length > 0;
            const answerType = parseInt(detail.question.answeR_TYPE_ID, 10);
            const isMultiple = [7, 10].includes(answerType);

            const answerObject = {
                id: detail.answer?.id || 0,
                reason: detail.answer?.reason || "",
                questioN_ID: detail.question.id || 0,
                operatioN_ID: id || 0,
                del_STATUS: true,
                variants: [],
                images: [],
            };

            if (!isVariantQuestion) {
                answerObject.answer = String(answer || "");

                const hasReason = detail.answer?.reason;
                const hasImages = detail.answer?.images?.length > 0;

                if (answerObject.answer || hasReason || hasImages) {
                    answerObject.del_STATUS = false; 
                }

                if (hasImages) {
                    answerObject.images = detail.answer.images.map((image) => ({
                        filename: image.filename,
                        filepath: image.filepath,
                        base64: "",
                        answeR_ID: detail.answer.id || 0,
                        answeR_VARIANT_ID: 0, 
                    }));
                }
                if (hasReason) {
                    answerObject.reason = detail.answer.reason; // Use updated reason
                }
            } else { 
                const selectedVariants = answer || [];
                const variants = detail.question.variants.map((variant) => {
                    const selectedVariant = detail.answer?.variants?.find(v => v.varianT_ID === variant.id) || {};
                    const isSelected = selectedVariants.includes(variant.id);
                    
                    return {
                        id: selectedVariant.id || 0,
                        varianT_ID: variant.id,
                        answeR_ID: detail.answer?.id || 0,
                        reason: selectedVariant.reason || "",
                        deL_STATUS: !isSelected,
                    };
                });

                answerObject.variants = variants;

                const anyVariantSelected = variants.some(variant => !variant.deL_STATUS);

                answerObject.del_STATUS = !anyVariantSelected;

                const images = variants.reduce((acc, variant) => {
                    if (selectedVariants.includes(variant.varianT_ID) && variant.variantImages) {
                        variant.variantImages.forEach((image) => {
                            acc.push({
                                filename: image.filename,
                                filepath: image.filepath,
                                base64: "", 
                                answeR_ID: detail.answer?.id || 0,
                                answeR_VARIANT_ID: variant.varianT_ID,
                            });
                        });
                    }
                    return acc;
                }, []);

                if (images.length > 0) {
                    answerObject.images = images;
                }
            }

            return answerObject;
        }),
    };

    console.log("Formatted Data:", formattedData);

    try {
      await UPDATE_CHECKLIST_OPERATION(formattedData);
      setLoading(false);
      navigate('/clients/checklist/checklist-results');
    } catch (error) {
      console.error('Error saving question group', error);
    }
};




  const renderVariants = (variants, questionId, answerType, answerVariants) => {
    const isMultipleSelection = [7, 10].includes(parseInt(answerType, 10));
    return variants.map((variant) => {
      const isSelected = answers[questionId]?.includes(variant.id);
      const answerVariant = answerVariants?.find(
        (av) => av.varianT_ID === variant.id
      );
      const hasImages = answerVariant?.variantImages?.length > 0;
      const variantImages = answerVariant?.variantImages || [];
      const hasReason = !!answerVariant?.reason;
      const reason = answerVariant?.reason || "";

      if (loading) {
        return <Loading />;
      }
    
      if (error) {
        return <Error />;
      }
    
      return (
        <VariantContainer key={variant.id} isSelected={isSelected}>
          <div
            style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
          >
            {isMultipleSelection ? (
              <Checkbox
                inputId={`variant-${variant.id}`}
                checked={isSelected}
                onChange={() =>
                  handleVariantChange(
                    questionId,
                    variant.id,
                    isMultipleSelection
                  )
                }
                className="variant-checkbox"
              />
            ) : (
              <RadioButton
                inputId={`variant-${variant.id}`}
                name={`variant-${questionId}`}
                checked={isSelected}
                onChange={() =>
                  handleVariantChange(
                    questionId,
                    variant.id,
                    isMultipleSelection
                  )
                }
                className="variant-radio"
              />
            )}
            <Label
              htmlFor={`variant-${variant.id}`}
              {...(isMultipleSelection
                ? { onChange: () => handleVariantChange(questionId, variant.id, isMultipleSelection) }
                : { onClick: () => handleVariantChange(questionId, variant.id, isMultipleSelection) }
              )}
              style={{ cursor: "pointer" }} 
            >
              {variant.variant} - {variant.varianT_POINT} bal
            </Label>
          </div>
          <PointsAndImage>
            {hasImages && (
              <ImageIcon
                onClick={(e) => {
                  e.stopPropagation();
                  handleImageIconClick(variantImages);
                }}
              />
            )}
            {hasReason && (
              <ReasonIcon
                onClick={(e) => {
                  e.stopPropagation();
                  const reason = findVariantReason(data, questionId, variant.id);
                  handleReasonIconClick(reason, questionId, true, variant.id);            
                }}
              />
            )}
          </PointsAndImage>
        </VariantContainer>
      );
    });
  };

  const renderQuestions = () =>
    data.map((detail, index) => {
      const hasVariants =
        detail.question.variants && detail.question.variants.length > 0;
      const hasAnswerImages = detail.answer?.images?.length > 0;
      const answerVariants = detail.answer?.variants || [];
      const answerType = detail.question.answeR_TYPE_ID;

      return (
        <QuestionBlock key={index}>
          <QuestionContainer>
            <div style={{ display: "flex", alignItems: "center" }}>
              <QuestionText>{detail.question.desc}</QuestionText>
            </div>
          </QuestionContainer>
          {hasVariants ? (
            renderVariants(
              detail.question.variants,
              detail.question.id,
              answerType,
              answerVariants
            )
          ) : (
            <OpenEndedContainer hasAnswer={!!detail.answer?.answer}>
              {answerType === 1 || answerType === 2 ? (
                <InputNumber
                  value={answers[detail.question.id] || null}
                  onValueChange={(e) =>
                    handleOpenEndedChange(detail.question.id, e.value)
                  }
                  placeholder="Cavab daxil edin (rəqəm)"
                  style={{ width: "100%" }}
                />
              ) : (
                <InputText
                  value={answers[detail.question.id] || ""}
                  onChange={(e) =>
                    handleOpenEndedChange(detail.question.id, e.target.value)
                  }
                  placeholder="Cavab daxil edin"
                  style={{ width: "100%" }}
                />
              )}
              {hasAnswerImages && (
                <ImageIcon
                  onClick={() => handleImageIconClick(detail.answer.images)}
                />
              )}
              {detail.answer?.reason && (
                <ReasonIcon
                onClick={() => handleReasonIconClick(detail.answer?.reason, detail.question.id, false)} // For regular answer
                />
              )}
            </OpenEndedContainer>
          )}
        </QuestionBlock>
      );
    });
    return (
        <>
          <Container>
            {loading ? ( 
              <Loading /> 
            ) : (
              <>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    justifyContent: "center",
                    marginBottom: "10px"
                  }}
                >
                  <div>
                    <label
                      style={{
                        fontWeight: "bold",
                        display: "block",
                        marginBottom: "0.5rem",
                      }}
                    >
                      Müştəri kodu
                    </label>
                    <InputText
                        value={clientCode}
                        onClick={() => setClientDialogVisible(true)} // Opens the dialog on click
                        placeholder="Müştəri kodu"
                        style={{ width: "300px" }}
                        readOnly // Prevent typing manually, only selection from dialog
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        fontWeight: "bold",
                        display: "block",
                        marginBottom: "0.5rem",
                      }}
                    >
                      Təmsilçi kodu
                    </label>
                    {/* <InputText
                      value={salesCode}
                      onChange={(e) => setSalesCode(e.target.value)}
                      placeholder="Təmsilçi kodu"
                      style={{ width: "300px" }}
                    /> */}
                          <Dropdown
                            value={salesCode}
                            options={salesmen}
                            onChange={(e) => setSalesCode(e.value)}
                            filter
                            showClear
                            placeholder="Təmsilçi kodu seçin"
                            style={{ width: '300px' }}
                        />

                  </div>
                </div>
                {data ? ( 
                  <Content>
                    {renderQuestions()}
                    <SaveButton label="Yadda saxla" icon="pi pi-save" onClick={handleSave} />
                  </Content>
                ) : (
                  <Error message="No data available." /> 
                )}
              </>
            )}
          </Container>
          <ImageDialog
            style={{ maxWidth: "95vw" }}
            visible={imageDialogVisible}
            onHide={() => setImageDialogVisible(false)}
            header="Şəkillər"
          >
            <ImageContainer>
              {selectedImages.map((image) => (
                <Image
                  key={image.id}
                  src={image.filepath}
                  alt={image.filename}
                  onDoubleClick={() => handleImageDoubleClick(image)}
                />
              ))}
            </ImageContainer>
          </ImageDialog>
          <Dialog
    style={{ width: "40vw" }}
    visible={reasonDialogVisible}
    onHide={() => setReasonDialogVisible(false)}
    header="Səbəb"
>
    <InputText style={{width: '55%'}} value={selectedReason} onChange={(e) => setSelectedReason(e.target.value)} />

    <ReasonButton label="Yadda saxla" onClick={() => handleSaveReason()} />
</Dialog>
          <Dialog
            style={{ width: "fit-content", padding: "0" }}
            visible={fullscreenImage !== null}
            onHide={() => setFullscreenImage(null)}
            maximizable
          >
            {fullscreenImage && (
              <img
                src={fullscreenImage.filepath}
                alt={fullscreenImage.filename}
                style={{ width: "100%", height: "auto", maxHeight: "90vh" }}
              />
            )}
          </Dialog>
          <ClientSelectionDialog
                visible={clientDialogVisible}
                onHide={() => setClientDialogVisible(false)}
                onSelect={handleClientSelect}
            />
        </>
      );
    };

const Container = styled.div`
  width: 80vw;
  margin: 0 auto;
  padding: 20px;
`;

const Header = styled.h2`
  text-align: center;
  margin-bottom: 20px;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
`;

const VariantContainer = styled.div`
  background-color: ${({ isSelected }) => (isSelected ? "#b3ffb3" : "white")};
  border: 1px solid gray;
  border-radius: 8px;
  padding: 10px;
  margin: 10px 0;
  display: flex;
  align-items: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  justify-content: space-between;
`;

const Label = styled.label`
  margin-left: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
`;

const PointsAndImage = styled.div`
  display: flex;
  align-items: center;
`;

const QuestionContainer = styled.div`
  display: flex;
  flex-direction: column;
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

const QuestionBlock = styled.div`
  margin-bottom: 20px;
`;

const OpenEndedContainer = styled.div`
  background-color: ${({ hasAnswer }) => (hasAnswer ? "#e6f7ff" : "#ffcccc")};
  border: 1px solid gray;
  border-radius: 8px;
  padding: 10px;
  margin: 10px 0;
  display: flex;
  align-items: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Input = styled.input`
  flex: 1;
  padding: 8px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
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
  width: auto;
  border-radius: 4px;
  object-fit: cover;
  cursor: pointer;
`;

const ImageDialog = styled(Dialog)`
  .p-dialog-content {
    padding: 0;
  }
`;

const ImageContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
`;

const SaveButton = styled(Button)`
  align-self: end;
  margin-top: 15px;
  margin-bottom: 20px;
`;

const ReasonButton = styled(Button)`
  cursor: pointer;
  align-self: end;
  margin-left: 10%;
  width: 25%;
`;

export default ChecklistResultEdit;
