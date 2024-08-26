import React, { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Checkbox } from "primereact/checkbox";
import PropTypes from "prop-types";
import {
  GET_JOB_HEADER_DETAILS,
  GET_JOBS,
} from "../../../features/mobile-terminal/services/api";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import "./AddEditDialog.css";

const AddEditDialog = ({
  visible,
  onHide,
  newJobOrder,
  setNewJobOrder,
  onSave,
  header,
}) => {
  const [validationErrors, setValidationErrors] = useState({});
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await GET_JOBS();
        setJobs(response.data || []);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchJobs();

    if (newJobOrder.id) {
      const fetchJobHeaderDetails = async (id) => {
        try {
          const response = await GET_JOB_HEADER_DETAILS(id);
          const jobDetails = response.data;
          setNewJobOrder({
            id: jobDetails.id || "",
            code: jobDetails.code || "",
            desc: jobDetails.desc || "",
            deL_STATUS: jobDetails.deL_STATUS || false,
            relations: jobDetails.relations || [],
          });
        } catch (error) {
          console.error("Error fetching job details:", error);
        }
      };

      fetchJobHeaderDetails(newJobOrder.id);
    }
  }, [newJobOrder.id]);

  const handleInputChange = (e, field) => {
    setNewJobOrder({ ...newJobOrder, [field]: e.target.value });
  };

  const handleCheckboxChange = (e, field) => {
    setNewJobOrder({ ...newJobOrder, [field]: e.checked });
  };

  const validate = () => {
    const errors = {};
    if (!newJobOrder.code) errors.code = "* Code qeyd edin";
    if (!newJobOrder.desc) errors.desc = "* Açıqlamanı qeyd edin";
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      onSave(newJobOrder);
    }
  };

  const handleDragEnd = (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      source.droppableId === "jobs" &&
      destination.droppableId === "relations"
    ) {
      // Moving from jobs to relations
      const jobToMove = jobs.find((job) => job.code === draggableId);
      if (jobToMove) {
        setNewJobOrder((prev) => {
          // Ensure relations is always an array
          const updatedRelations = [...(prev.relations || [])];
          // Check if the job is already in the relations
          const jobAlreadyInRelations = updatedRelations.some(
            (r) => r.job.code === jobToMove.code
          );
          if (!jobAlreadyInRelations) {
            // Prompt or set default compulsory status
            const compulsoryStatus = true; // or use a default or prompt user
            updatedRelations.push({
              job: jobToMove,
              roW_NUMBER: (updatedRelations.length || 0) + 1,
              compulsorY_STATUS: compulsoryStatus,
            });
          }
          return {
            ...prev,
            relations: updatedRelations,
          };
        });

        setJobs((prevJobs) =>
          prevJobs.filter((job) => job.code !== draggableId)
        );
      }
    } else if (
      source.droppableId === "relations" &&
      destination.droppableId === "relations"
    ) {
      // Reordering within relations
      setNewJobOrder((prev) => {
        const reorderedRelations = [...(prev.relations || [])];
        const [movedItem] = reorderedRelations.splice(source.index, 1);
        reorderedRelations.splice(destination.index, 0, movedItem);

        const updatedRelations = reorderedRelations.map((relation, index) => ({
          ...relation,
          roW_NUMBER: index + 1,
        }));

        return {
          ...prev,
          relations: updatedRelations,
        };
      });
    } else if (
      source.droppableId === "relations" &&
      destination.droppableId === "jobs"
    ) {
      // Moving from relations to jobs
      const relationToMove = (newJobOrder.relations || []).find(
        (r) => r.job.code === draggableId
      );

      if (relationToMove) {
        setJobs((prevJobs) => {
          const jobAlreadyInJobs = prevJobs.some(
            (job) => job.code === relationToMove.job.code
          );
          if (!jobAlreadyInJobs) {
            return [...prevJobs, { ...relationToMove.job }];
          }
          return prevJobs;
        });

        setNewJobOrder((prev) => ({
          ...prev,
          relations: (prev.relations || []).filter(
            (r) => r.job.code !== draggableId
          ),
        }));
      }
    }
  };

  const availableJobs = (jobs || []).filter(
    (job) => !(newJobOrder.relations || []).some((r) => r.job.code === job.code)
  );

  return (
    <Dialog
      header={header}
      visible={visible}
      style={{ width: "80vw" }}
      modal
      onHide={onHide}
    >
      <div className="p-fluid dialog-container">
        <div className="form-section">
          <div className="p-field">
            <label htmlFor="code">Kod</label>
            <InputText
              id="code"
              value={newJobOrder.code}
              onChange={(e) => handleInputChange(e, "code")}
              className="p-inputtext-lg p-d-block my-2"
              required
            />
            {validationErrors.code && (
              <small className="p-error">{validationErrors.code}</small>
            )}
          </div>
          <div className="p-field">
            <label htmlFor="desc">Açıqlama</label>
            <InputText
              id="desc"
              value={newJobOrder.desc}
              onChange={(e) => handleInputChange(e, "desc")}
              className="p-inputtext-lg p-d-block my-2"
              required
            />
            {validationErrors.desc && (
              <small className="p-error">{validationErrors.desc}</small>
            )}
          </div>
          <div className="p-field-checkbox">
            <label htmlFor="deL_STATUS" style={{ marginRight: "10px" }}>
              Aktiv/Passiv
            </label>
            <Checkbox
              inputId="deL_STATUS"
              checked={newJobOrder.deL_STATUS}
              onChange={(e) => handleCheckboxChange(e, "deL_STATUS")}
            />
          </div>
        </div>
        <DragDropContext onDragEnd={handleDragEnd}>
    <div className="drag-drop-sections">
        <div className="jobs-section">
            <label>Əlavə Et</label>
            <Droppable droppableId="jobs">
                {(provided) => (
                    <ul
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={`droppable-list ${availableJobs.length === 0 ? 'empty' : ''}`}
                    >
                        {availableJobs.map((job, index) => (
                            <Draggable key={`job_${job.code}`} draggableId={job.code} index={index}>
                                {(provided) => (
                                    <li
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        className="draggable-item"
                                    >
                                        {job.code} - {job.desc}
                                    </li>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </ul>
                )}
            </Droppable>
        </div>
        <div className="relations-section">
            <label>Əməliyyatlar</label>
            <Droppable droppableId="relations">
                {(provided) => (
                    <ul
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={`droppable-list ${newJobOrder.relations?.length === 0 ? 'empty' : ''}`}
                    >
                        {(newJobOrder.relations || []).map((relation, index) => (
                            <Draggable key={`relation_${relation.job.code}`} draggableId={relation.job.code} index={index}>
                                {(provided) => (
                                    <li
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        className="draggable-item"
                                    >
                                        {relation.job.code} - {relation.job.desc} (Sıra: {relation.roW_NUMBER})
                                        <div>
                                            <Checkbox
                                                checked={relation.compulsorY_STATUS}
                                                onChange={(e) => {
                                                    setNewJobOrder(prev => {
                                                        const updatedRelations = prev.relations.map(r => 
                                                            r.job.code === relation.job.code 
                                                            ? { ...r, compulsorY_STATUS: e.checked }
                                                            : r
                                                        );
                                                        return { ...prev, relations: updatedRelations };
                                                    });
                                                }}
                                            />
                                            <label>Məcburiyyət</label>
                                        </div>
                                    </li>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </ul>
                )}
            </Droppable>
        </div>
    </div>
</DragDropContext>
      </div>
      <div
        className="p-dialog-footer"
        style={{ marginTop: "15px", padding: "0" }}
      >
        <Button
          label="Yadda saxla"
          onClick={handleSave}
          className="p-button-primary"
        />
        <Button
          label="Ləğv et"
          onClick={onHide}
          className="p-button-secondary"
        />
      </div>
    </Dialog>
  );
};

AddEditDialog.propTypes = {
  visible: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  newJobOrder: PropTypes.object.isRequired,
  setNewJobOrder: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  header: PropTypes.string.isRequired,
};

export default AddEditDialog;
