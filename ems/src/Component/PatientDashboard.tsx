import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Container, Row, Col, Modal, Dropdown } from "react-bootstrap";
import { FaBell, FaUser, FaCalendarAlt, FaPlusSquare, FaNotesMedical } from "react-icons/fa"; // Import icons
import { jwtDecode } from "jwt-decode"; // Import jwt-decode for decoding JWT token
import "../CSS/PatientDashboard.css";

const PatientDashboard: React.FC = () => {
  const navigate = useNavigate();

  // Retrieve email from JWT token stored in localStorage
  const token = localStorage.getItem("token");
  const email = token ? (jwtDecode(token) as { sub: string }).sub : null;
  console.log(email);
  // State for notifications
  const [notifications, setNotifications] = useState<any[]>([]);

  // Fetch notifications for the patient
  const fetchNotifications = async () => {
    if (!email) return;

    try {
      // Use the correct backend endpoint to fetch notifications by patient email
      const res = await fetch(`http://localhost:8060/api/hospital/notifications/patient?email=${email}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        const data = await res.json();
        console.log("Fetched notifications:", data); // Debugging log

        // Filter notifications that start with "Hi"
        const filteredNotifications = data.filter((notification: any) =>
          notification.message?.startsWith("Dear")
        );
        console.log("Filtered notifications:", filteredNotifications); // Debugging log
        setNotifications(filteredNotifications);
      } else {
        const errorText = await res.text();
        console.error("Failed to fetch notifications:", errorText);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  // Fetch notifications on component mount
  useEffect(() => {
    fetchNotifications();
  }, [email]);

  // State for modal
  const [showModal, setShowModal] = React.useState(false);

  const handleModalClose = () => setShowModal(false);
  const handleModalShow = () => setShowModal(true);

  // Handlers for navigation
  const handleHomeClick = () => {
    navigate("/"); // Redirect to homepage
  };

  const handleBackClick = () => {
    navigate(-1); // Navigate to the previous page
  };

  const handlePatientDetailsClick = () => {
    navigate("/add-patient"); // Redirect to Add Patient Details page
  };

  const handleViewAppointmentClick = () => {
    navigate(`/viewappointments?email=${email}`); // Redirect to View Appointments page
  };

  const handleBookAppointmentClick = () => {
    navigate(`/bookappointment?email=${email}`); // Redirect to Book Appointment page
  };

  const handleTreatmentDetailsClick = () => {
    navigate(`/treatmentdetails?email=${email}`); // Redirect to Treatment Details page
  };

  const handleLogout = () => {
    // Clear localStorage and redirect to login page
    localStorage.removeItem("token"); // Remove the token entirely
    navigate("/", { replace: true }); // Redirect to the login page and replace history
  };

  return (
    <div className="patient-dashboard">
      <Container className="dashboard-container">
        {/* Top Navigation */}
        <div className="top-navigation">
          <div className="left-buttons">
            <Button variant="secondary" onClick={handleBackClick} className="nav-button">
              Back
            </Button>
            <Button variant="primary" onClick={handleHomeClick} className="nav-button ms-2">
              Home
            </Button>
          </div>
          <div className="right-icons">
            <Dropdown className="notification-dropdown">
              <Dropdown.Toggle variant="light" id="dropdown-notification" className="notification-toggle">
                <FaBell size={20} className="notification-bell-icon" />
                {notifications.length > 0 && (
                  <span className="notification-badge">{notifications.length}</span>
                )}
              </Dropdown.Toggle>
              <Dropdown.Menu className="notification-menu">
                {notifications.length > 0 ? (
                  notifications.map((notification, index) => (
                    <Dropdown.Item key={index} className="notification-item">
                      {notification.message}
                    </Dropdown.Item>
                  ))
                ) : (
                  <Dropdown.Item className="notification-item">No notifications</Dropdown.Item>
                )}
              </Dropdown.Menu>
            </Dropdown>
            <Button variant="danger" onClick={handleLogout} className="logout-button">
              Logout
            </Button>
          </div>
        </div>

        {/* Dashboard Header */}
        <div className="dashboard-header">
          <h1 className="dashboard-title">Your Health Hub</h1>
          <p className="dashboard-subtitle">Effortlessly manage your healthcare needs.</p>
        </div>

        {/* Dashboard Cards */}
        <Row className="dashboard-cards-row">
          <Col md={6} className="mb-4">
            <Card className="dashboard-card interactive-card" onClick={handlePatientDetailsClick}>
              <div className="card-image-wrapper">
                <img
                  src="/images/Patientdetails.png"
                  alt="Patient Details"
                  className="card-image"
                />
              </div>
              <div className="card-icon-wrapper">
                <FaUser size={40} className="card-icon user-icon" />
              </div>
              <Card.Body className="card-body">
                <Card.Title className="card-title">Patient Details</Card.Title>
                <Card.Text className="card-text">View and update your personal information.</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} className="mb-4">
            <Card className="dashboard-card interactive-card" onClick={handleViewAppointmentClick}>
              <div className="card-image-wrapper">
                <img
                  src="/images/Viewappointment.jfif"
                  alt="View Appointments"
                  className="card-image"
                />
              </div>
              <div className="card-icon-wrapper">
                <FaCalendarAlt size={40} className="card-icon calendar-icon" />
              </div>
              <Card.Body className="card-body">
                <Card.Title className="card-title">View Appointments</Card.Title>
                <Card.Text className="card-text">Check your upcoming and past appointments.</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} className="mb-4">
            <Card className="dashboard-card interactive-card" onClick={handleBookAppointmentClick}>
              <div className="card-image-wrapper">
                <img
                  src="/images/Bookappointment.jfif"
                  alt="Book Appointment"
                  className="card-image"
                />
              </div>
              <div className="card-icon-wrapper">
                <FaPlusSquare size={40} className="card-icon book-icon" />
              </div>
              <Card.Body className="card-body">
                <Card.Title className="card-title">Book Appointment</Card.Title>
                <Card.Text className="card-text">Schedule a new consultation with a specialist.</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} className="mb-4">
            <Card className="dashboard-card interactive-card" onClick={handleTreatmentDetailsClick}>
              <div className="card-image-wrapper">
                <img
                  src="/images/Treatmentdetails.jpg"
                  alt="Treatment Details"
                  className="card-image"
                />
              </div>
              <div className="card-icon-wrapper">
                <FaNotesMedical size={40} className="card-icon treatment-icon" />
              </div>
              <Card.Body className="card-body">
                <Card.Title className="card-title">Treatment Details</Card.Title>
                <Card.Text className="card-text">Review your treatment plans and medical history.</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Help Section */}
        <div className="help-section text-center mt-5">
          <Button variant="info" onClick={handleModalShow} className="help-button">
            Need Assistance?
          </Button>
        </div>

        {/* Help Modal */}
        <Modal show={showModal} onHide={handleModalClose} centered>
          <Modal.Header closeButton className="modal-header-style">
            <Modal.Title className="modal-title-style">How Can We Help You?</Modal.Title>
          </Modal.Header>
          <Modal.Body className="modal-body-style">
            <p>
              If you have any questions or need assistance, please contact our support team at{" "}
              <strong className="support-email">support@hms.com</strong>.
            </p>
            <p>You can also reach us by phone at <strong className="support-phone">+1-800-123-4567</strong>.</p>
          </Modal.Body>
          <Modal.Footer className="modal-footer-style">
            <Button variant="secondary" onClick={handleModalClose} className="modal-close-button">
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};

export default PatientDashboard;
