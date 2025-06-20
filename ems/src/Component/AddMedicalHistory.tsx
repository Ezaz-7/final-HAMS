import React, { useState, useEffect } from "react";
import { Form, Button, Alert, Table, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Import jwt-decode to decode JWT token
import "../CSS/MedicalHistory.css"; // Import the CSS file for styling
 
interface Patient {
  patientId: number;
  name: string;
  email: string;
  contactDetails: string;
}
 
const AddMedicalHistory: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [medicalHistory, setMedicalHistory] = useState({
    patientId: "",
    diagnosis: "",
    treatment: "",
    dateOfVisit: "",
  });
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const navigate = useNavigate();
 
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken: { sub: string } = jwtDecode(token);
        console.log("Decoded token:", decodedToken);
      } catch (err) {
        console.error("Failed to decode JWT token:", err);
        setError("Invalid token. Please log in again.");
        localStorage.clear();
        navigate("/");
      }
    } else {
      setError("Token is missing. Please log in again.");
      navigate("/");
    }
  }, [navigate]);
 
  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8060/api/hospital/patients/get", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
 
      if (res.ok) {
        const data = await res.json();
        setPatients(data);
      } else {
        const errorText = await res.text();
        setError(`Failed to fetch patients: ${errorText}`);
      }
    } catch (err) {
      console.error("Error fetching patients:", err);
      setError("An error occurred while fetching patients. Please try again.");
    }
  };
 
  useEffect(() => {
    fetchPatients();
  }, []);
 
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMedicalHistory({ ...medicalHistory, [name]: value });
  };
 
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setResponse(null);
    setError(null);
 
    try {
      const token = localStorage.getItem("token");
      const payload = {
        patient: { patientId: selectedPatient?.patientId },
        diagnosis: medicalHistory.diagnosis,
        treatment: medicalHistory.treatment,
        dateOfVisit: medicalHistory.dateOfVisit,
      };
 
      const res = await fetch("http://localhost:8060/api/hospital/history/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
 
      if (res.ok) {
        setResponse("Medical history added successfully!");
        setShowModal(false);
        fetchPatients();
      } else {
        const errorText = await res.text();
        setError(`Failed to add medical history: ${errorText}`);
      }
    } catch (err) {
      console.error("Error adding medical history:", err);
      setError("An error occurred while adding medical history. Please try again.");
    }
  };
 
  const handleAddMedicalHistory = (patient: Patient) => {
    setSelectedPatient(patient);
    setMedicalHistory({
      patientId: patient.patientId.toString(),
      diagnosis: "",
      treatment: "",
      dateOfVisit: "",
    });
    setShowModal(true);
  };
 
  return (
    <div className="medical-history-page">
      <div className="container my-5">
        {/* Back Button */}
        <Button className="mb-3" variant="secondary" onClick={() => navigate(-1)}>
          Back
        </Button>
 
        <h1 className="text-center mb-4">Add Medical History</h1>
 
        {response && <Alert variant="success">{response}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}
 
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Patient ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Contact Details</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr key={patient.patientId}>
                <td>{patient.patientId}</td>
                <td>{patient.name}</td>
                <td>{patient.email}</td>
                <td>{patient.contactDetails}</td>
                <td>
                  <Button variant="primary" onClick={() => handleAddMedicalHistory(patient)}>
                    Medical Details
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
 
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Add Medical History for {selectedPatient?.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Patient ID</Form.Label>
                <Form.Control
                  type="text"
                  name="patientId"
                  value={medicalHistory.patientId}
                  readOnly
                />
              </Form.Group>
 
              <Form.Group className="mb-3">
                <Form.Label>Diagnosis</Form.Label>
                <Form.Control
                  as="textarea"
                  name="diagnosis"
                  value={medicalHistory.diagnosis}
                  onChange={handleInputChange}
                  placeholder="Enter diagnosis"
                  rows={3}
                  required
                />
              </Form.Group>
 
              <Form.Group className="mb-3">
                <Form.Label>Treatment</Form.Label>
                <Form.Control
                  as="textarea"
                  name="treatment"
                  value={medicalHistory.treatment}
                  onChange={handleInputChange}
                  placeholder="Enter treatment details"
                  rows={3}
                  required
                />
              </Form.Group>
 
              <Form.Group className="mb-3">
                <Form.Label>Date of Visit</Form.Label>
                <Form.Control
                  type="datetime-local"
                  name="dateOfVisit"
                  value={medicalHistory.dateOfVisit}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
 
              <Button variant="primary" type="submit" className="w-100">
                Add Medical History
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};
 
export default AddMedicalHistory;
 