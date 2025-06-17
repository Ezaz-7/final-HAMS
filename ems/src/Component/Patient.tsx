import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import "../CSS/Patient.css";

const Patient: React.FC = () => {
  const navigate = useNavigate();

  const [newPatient, setNewPatient] = useState({
    name: "",
    email: "",
    dateOfBirth: "",
    contactDetails: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    dateOfBirth: "",
    contactDetails: "",
  });

  const [responseMessage, setResponseMessage] = useState<string | null>(null); // State for success/error messages

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewPatient({ ...newPatient, [name]: value });

    // Clear the error for the field being updated
    setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { name: "", email: "", dateOfBirth: "", contactDetails: "" };

    // Name validation
    if (!newPatient.name.trim()) {
      newErrors.name = "Name is required.";
      isValid = false;
    } else if (newPatient.name.length < 3) {
      newErrors.name = "Name must be at least 3 characters long.";
      isValid = false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!newPatient.email.trim()) {
      newErrors.email = "Email is required.";
      isValid = false;
    } else if (!emailRegex.test(newPatient.email)) {
      newErrors.email = "Please enter a valid email address.";
      isValid = false;
    }

    // Date of Birth validation
    if (!newPatient.dateOfBirth) {
      newErrors.dateOfBirth = "Date of Birth is required.";
      isValid = false;
    }

    // Contact Details validation
    const contactRegex = /^[0-9]{10}$/;
    if (!newPatient.contactDetails.trim()) {
      newErrors.contactDetails = "Contact number is required.";
      isValid = false;
    } else if (!contactRegex.test(newPatient.contactDetails)) {
      newErrors.contactDetails = "Contact number must be 10 digits.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleBackClick = () => {
    navigate(-1); // Navigate to the previous page
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const response = await fetch("http://localhost:8060/api/hospital/patients/save", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newPatient),
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Patient saved successfully:", data);
          setResponseMessage("Patient details saved successfully!");
          setNewPatient({
            name: "",
            email: "",
            dateOfBirth: "",
            contactDetails: "",
          }); // Reset the form
        } else {
          const errorText = await response.text();
          console.error("Error saving patient:", errorText);
          setResponseMessage("Failed to save patient details. Please try again.");
        }
      } catch (error) {
        console.error("Error:", error);
        setResponseMessage("An error occurred while saving patient details.");
      }
    }
  };

  return (
    <div className="patient-page">
      <Container className="form-container">
        {/* Navigation Buttons */}
        <div className="navigation-buttons">
          <Button variant="secondary" className="back-button" onClick={handleBackClick}>
            Back
          </Button>
        </div>

        <Row className="justify-content-center">
          <Col md={8} lg={7}>
            <div className="form-wrapper">
              <h1 className="form-title text-center mb-4">Enter Patient Details</h1>

              {/* Response Message */}
              {responseMessage && (
                <Alert
                  variant={responseMessage.includes("successfully") ? "success" : "danger"}
                  className="text-center mb-3"
                >
                  {responseMessage}
                </Alert>
              )}

              <Form onSubmit={handleSubmit} className="patient-form">
                {/* Name Field */}
                <Form.Group className="mb-3">
                  <Form.Label className="form-label">Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    placeholder="Enter patient's name"
                    value={newPatient.name}
                    onChange={handleInputChange}
                    isInvalid={!!errors.name}
                    className="form-input"
                    required
                  />
                  <Form.Control.Feedback type="invalid" className="error-message">
                    {errors.name}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Email Field */}
                <Form.Group className="mb-3">
                  <Form.Label className="form-label">Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Enter patient's email"
                    value={newPatient.email}
                    onChange={handleInputChange}
                    isInvalid={!!errors.email}
                    className="form-input"
                    required
                  />
                  <Form.Control.Feedback type="invalid" className="error-message">
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Date of Birth Field */}
                <Form.Group className="mb-3">
                  <Form.Label className="form-label">Date of Birth</Form.Label>
                  <Form.Control
                    type="date"
                    name="dateOfBirth"
                    value={newPatient.dateOfBirth}
                    onChange={handleInputChange}
                    isInvalid={!!errors.dateOfBirth}
                    className="form-input"
                    required
                  />
                  <Form.Control.Feedback type="invalid" className="error-message">
                    {errors.dateOfBirth}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Contact Details Field */}
                <Form.Group className="mb-3">
                  <Form.Label className="form-label">Contact Details</Form.Label>
                  <Form.Control
                    type="text"
                    name="contactDetails"
                    placeholder="Enter patient's contact number"
                    value={newPatient.contactDetails}
                    onChange={handleInputChange}
                    isInvalid={!!errors.contactDetails}
                    className="form-input"
                    required
                  />
                  <Form.Control.Feedback type="invalid" className="error-message">
                    {errors.contactDetails}
                  </Form.Control.Feedback>
                </Form.Group>

                <div className="text-center">
                  <Button variant="primary" type="submit" className="submit-button">
                    Submit
                  </Button>
                </div>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Patient;