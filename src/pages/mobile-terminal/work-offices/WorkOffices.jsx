import React, { useEffect, useState, useRef } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { GET_WORK_OFFICE_LOCATIONS, POST_NEW_WORK_OFFICE, EDIT_WORK_OFFICE } from "../../../features/mobile-terminal/services/api";
import AddEditDialog from "./AddEditDialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import "./WorkOffices.css";


const containerStyle = {
  width: "82vw",
  height: "70vh",
};

const defaultCenter = {
  lat: 40.409264,
  lng: 49.867092,
};

const WorkOffices = () => {
  const [locations, setLocations] = useState([]);
  const [selectedOffice, setSelectedOffice] = useState(null);
  const [infoWindowOffice, setInfoWindowOffice] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const mapRef = useRef(null);

  const fetchLocations = async () => {
    try {
      const response = await GET_WORK_OFFICE_LOCATIONS();
      setLocations(response.data);
      setFilteredLocations(response.data);
    } catch (error) {
      console.error("Error fetching office locations:", error);
    }
  };
  
  useEffect(() => {
    fetchLocations();
  }, []);
  
  const handleMarkerClick = (office) => {
    setInfoWindowOffice(office);
      if (mapRef.current) {
      mapRef.current.panTo({ lat: office.locY, lng: office.locX });
    }
  };
  
  const handleEditClick = (office) => {
    setInfoWindowOffice(null);
    setSelectedOffice(office);
    setIsDialogOpen(true);
  };

  const handleAddNewOffice = () => {
    setSelectedOffice(null);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedOffice(null);
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter") {
      const results = locations.filter(
        (location) =>
          location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          location.code.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredLocations(results);

      if (results.length > 0) {
        const firstResult = results[0];
        setMapCenter({ lat: firstResult.locY, lng: firstResult.locX });
      }
    }
  };

  const getPixelPosition = (latLng) => {
    if (!mapRef.current) return null;

    const scale = Math.pow(2, mapRef.current.getZoom());
    const projection = mapRef.current.getProjection();
    const bounds = mapRef.current.getBounds();

    const nw = projection.fromLatLngToPoint(
      new window.google.maps.LatLng(
        bounds.getNorthEast().lat(),
        bounds.getSouthWest().lng()
      )
    );
    const point = projection.fromLatLngToPoint(latLng);

    return {
      x: (point.x - nw.x) * scale,
      y: (point.y - nw.y) * scale,
    };
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (formData.id) {
        const editResponse = await EDIT_WORK_OFFICE(formData);
        console.log("Edit Response:", editResponse);
      } else {
        const createResponse = await POST_NEW_WORK_OFFICE(formData);
        console.log("Create Response:", createResponse);
      }
  
      await fetchLocations(); 
      console.log("Locations updated successfully!");
  
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };
  
  return (
    <>
      <LoadScript googleMapsApiKey="AIzaSyBMv3wWsBb3AzIN6tqpz2-ZIF_hFbMckds">
        <div className="map-container">
          <div className="search-container">
            <InputText
              type="text"
              placeholder="Axtar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleSearchKeyPress}
              className="search-input"
            />
            <Button
              label="Yeni ofis əlavə et"
              severity="success"
              className="add-office-button"
              icon="pi pi-plus"
              onClick={handleAddNewOffice}
            />
          </div>

          <div className="map-content">
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={mapCenter}
              zoom={10}
              onLoad={(map) => (mapRef.current = map)}
            >
              {filteredLocations.map((location) => (
                <Marker
                  key={location.id}
                  position={{ lat: location.locY, lng: location.locX }}
                  title={location.name}
                  onClick={() => handleMarkerClick(location)}
                />
              ))}

              {infoWindowOffice && (
                <div
                  className="custom-info-window"
                  style={{
                    position: "absolute",
                    left: `${
                      getPixelPosition(
                        new window.google.maps.LatLng(
                          infoWindowOffice.locY,
                          infoWindowOffice.locX
                        )
                      )?.x
                    }px`,
                    top: `${
                      getPixelPosition(
                        new window.google.maps.LatLng(
                          infoWindowOffice.locY,
                          infoWindowOffice.locX
                        )
                      )?.y
                    }px`,
                    transform: "translate(-50%, -100%)",
                    backgroundColor: "white",
                    padding: "10px",
                    borderRadius: "8px",
                    boxShadow: "0px 0px 10px rgba(0,0,0,0.3)",
                    zIndex: 1000,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <h3 style={{ margin: 0 }}>{infoWindowOffice.name}</h3>
                    <Button
                      icon="pi pi-times"
                      className="p-button-rounded p-button-text"
                      style={{ marginLeft: "10px" }}
                      onClick={() => setInfoWindowOffice(null)}
                    />
                  </div>
                  <p style={{ margin: "0.2rem" }}>
                    <strong>Kod:</strong> {infoWindowOffice.code}
                  </p>
                  <p style={{ margin: "0.2rem" }}>
                    <strong>Konum X:</strong> {infoWindowOffice.locX}
                  </p>
                  <p style={{ margin: "0.2rem" }}>
                    <strong>Konum Y:</strong> {infoWindowOffice.locY}
                  </p>
                  <Button
                    label="Dəyişdir"
                    icon="pi pi-pencil"
                    onClick={() => handleEditClick(infoWindowOffice)}
                    style={{ marginTop: "10px", alignSelf: "flex-end" }}
                  />
                </div>
              )}
            </GoogleMap>
          </div>
        </div>
      </LoadScript>

      {isDialogOpen && (
        <AddEditDialog office={selectedOffice} onClose={handleDialogClose} onSubmit={handleFormSubmit}  />
      )}
    </>
  );
};

export default WorkOffices;
