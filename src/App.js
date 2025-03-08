import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API_BASE_URL = "https://localhost:44316/api/Truck";

const App = () => {
  const [trucks, setTrucks] = useState([]);
  const [truckName, setTruckName] = useState("");
  const [licencePlate, setLicencePlate] = useState("");
  const [ownerId, setOwnerId] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedTruckId, setSelectedTruckId] = useState(null);

  useEffect(() => {
    fetchTrucks();
  }, []);

  const fetchTrucks = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/GetAllTrucks`);
      setTrucks(response.data);
    } catch (error) {
      console.error("Error fetching trucks:", error);
    }
  };

  const createTruck = async () => {
    if (!truckName || !licencePlate || !ownerId) {
      alert("Please fill in all fields");
      return;
    }
    try {
      await axios.post(`${API_BASE_URL}/CreateTruck`, {
        truckName,
        licencePlate,
        ownerId: Number(ownerId),
      });
      fetchTrucks();
      setTruckName("");
      setLicencePlate("");
      setOwnerId("");
    } catch (error) {
      console.error("Error creating truck:", error);
    }
  };

  const confirmDeleteTruck = (truckId) => {
    setSelectedTruckId(truckId);
    setShowModal(true);
  };

  const deleteTruck = async () => {
    if (!selectedTruckId) return;
    try {
      await axios.put(`${API_BASE_URL}/Delete/${selectedTruckId}`);
      fetchTrucks();
      setShowModal(false);
      setSelectedTruckId(null);
    } catch (error) {
      console.error("Error deleting truck:", error);
    }
  };

  return (
    <div className="container">
      <h1>Truck Management</h1>
      <div className="form">
        <input
          type="text"
          placeholder="Truck Name"
          value={truckName}
          onChange={(e) => setTruckName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Licence Plate"
          value={licencePlate}
          onChange={(e) => setLicencePlate(e.target.value)}
        />
        <input
          type="number"
          placeholder="Owner ID"
          value={ownerId}
          onChange={(e) => setOwnerId(e.target.value)}
        />
        <button className="add-button" onClick={createTruck}>Add Truck</button>
      </div>
      <table className="truck-table">
        <thead>
          <tr>
            <th>Truck Name</th>
            <th>Licence Plate</th>
            <th>Owner ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {trucks.map((truck) => (
            <tr key={truck.truckId}>
              <td>{truck.truckName}</td>
              <td>{truck.licencePlate}</td>
              <td>{truck.ownerId}</td>
              <td>
                <button className="delete-button" onClick={() => confirmDeleteTruck(truck.truckId)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <h2 className="modal-title">Delete Truck</h2>
            <p className="modal-message">Are you sure that you want to delete this truck?</p>
            <div className="modal-buttons">
              <button className="confirm-button" onClick={deleteTruck}>Yes, Delete</button>
              <button className="cancel-button" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
