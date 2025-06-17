import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form, Table, Alert, Modal } from "react-bootstrap"; // Added Modal
import { jwtDecode } from "jwt-decode";
import "../CSS/BookAppointment.css";

interface TimeSlot {
  timeSlot: string;
  isBlocked: boolean;
}

interface DoctorSchedule {
  doctorId: string;
  doctorName: string;
  specialization: string;
  date: string;
  availableTimeSlots: TimeSlot[];
}

const BookAppointment: React.FC = () => {
  const [doctorSchedules, setDoctorSchedules] = useState<DoctorSchedule[]>([]);
  const [selectedDoctorSchedule, setSelectedDoctorSchedule] =
    useState<DoctorSchedule | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");
  const [response, setResponse] = useState<string>(""); // State for success/error messages
  const [showBookingModal, setShowBookingModal] = useState<boolean>(false); // State for booking modal
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false); // State to control success modal visibility
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const [patientEmail, setPatientEmail] = useState<string>("");

  // Decode the JWT token to extract the patient email
  useEffect(() => {
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        if (decodedToken && decodedToken.sub) {
          setPatientEmail(decodedToken.sub);
        } else {
          setResponse("Failed to extract patient email from token.");
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        setResponse("Invalid token. Please log in again.");
        localStorage.clear();
        navigate("/login");
      }
    } else {
      setResponse("Token is missing. Please log in again.");
      navigate("/login");
    }
  }, [token, navigate]);

  // Fetch doctor schedules
  const fetchDoctorSchedules = async () => {
    try {
      const res = await fetch(
        "http://localhost:8060/api/hospital/doctors/get",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.ok) {
        const data = await res.json();
        setDoctorSchedules(data);
      } else {
        setResponse("Failed to fetch doctor schedules");
      }
    } catch (error) {
      console.error(error);
      setResponse("Error fetching doctor schedules");
    }
  };

  useEffect(() => {
    fetchDoctorSchedules();
  }, []);

  const handleSelectDoctor = (schedule: DoctorSchedule) => {
    setSelectedDoctorSchedule(schedule);
    setSelectedTimeSlot(""); // Reset selected time slot
    setShowBookingModal(true); // Show the booking modal
  };

  const handleCloseBookingModal = () => {
    setShowBookingModal(false);
    setSelectedDoctorSchedule(null);
    setSelectedTimeSlot("");
  };

  const handleCancelAppointment = async (appointmentId: string) => {
    try {
      const res = await fetch(
        `http://localhost:8060/api/hospital/appointments/cancel?appointmentId=${appointmentId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        setResponse("Appointment canceled successfully.");
        fetchDoctorSchedules(); // Refresh schedules to unblock the time slot
      } else {
        const errorText = await res.text();
        console.error("Error canceling appointment:", errorText);
        setResponse("Failed to cancel appointment: " + errorText);
      }
    } catch (error) {
      console.error("Error:", error);
      setResponse("Error canceling appointment.");
    }
  };

  // Handle booking an appointment
  const handleBookAppointment = async () => {
    if (
      !selectedDoctorSchedule?.doctorId ||
      !selectedDoctorSchedule?.date ||
      !selectedTimeSlot
    ) {
      setResponse("Please select a doctor and a time slot.");
      return;
    }

    const appointmentData = {
      doctor: {
        doctorId: selectedDoctorSchedule.doctorId,
        date: selectedDoctorSchedule.date,
      },
      appointmentTime: selectedTimeSlot,
      status: "SCHEDULED",
    };

    try {
      const res = await fetch(
        `http://localhost:8060/api/hospital/appointments/book?email=${patientEmail}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(appointmentData),
        }
      );

      if (res.ok) {
        setResponse("Appointment booked successfully!");
        setShowSuccessModal(true); // Show the success modal
        setShowBookingModal(false); // Close the booking modal

        // Update the time slot as booked
        const updateRes = await fetch(
          `http://localhost:8060/api/hospital/doctors/update-time-slot?doctorId=${selectedDoctorSchedule.doctorId}&date=${selectedDoctorSchedule.date}&timeSlot=${selectedTimeSlot}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (updateRes.ok) {
          fetchDoctorSchedules(); // Refresh schedules
        } else {
          const errorText = await updateRes.text();
          console.error("Error updating time slot:", errorText);
          setResponse("Failed to update time slot in the database.");
        }
      } else {
        const errorText = await res.text();
        console.error("Error Response:", errorText);
        setResponse("Failed to book appointment: " + errorText);
      }
    } catch (error) {
      console.error("Error:", error);
      setResponse("Error booking appointment");
    }
  };

  return (
    <div className="book-appointment-page">
      <div className="container my-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="page-title">Book an Appointment</h1>
          <div>
            <Button
              variant="secondary"
              className="me-2 nav-button"
              onClick={() => navigate(-1)}
            >
              Back
            </Button>
            <Button
              variant="primary"
              className="nav-button"
              onClick={() => navigate("/")}
            >
              Home
            </Button>
          </div>
        </div>

        {/* Error/Response Message */}
        {response && (
          <Alert
            variant={response.includes("successfully") ? "success" : "danger"}
            className="response-alert"
          >
            {response}
          </Alert>
        )}

        {/* Doctor Schedule Table */}
        <div className="table-container">
          <h3>Available Doctors and Time Slots</h3>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Doctor ID</th>
                <th>Doctor Name</th>
                <th>Specialization</th>
                <th>Date</th>
                <th>Available Time Slots</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {doctorSchedules.map((schedule) => (
                <tr key={`${schedule.doctorId}-${schedule.date}`}>
                  <td>{schedule.doctorId}</td>
                  <td>{schedule.doctorName}</td>
                  <td>{schedule.specialization}</td>
                  <td>{schedule.date}</td>
                  <td>
                    <div className="time-slots-group">
                      {schedule.availableTimeSlots.map((slot, index) => (
                        <span
                          key={index}
                          className={`time-slot ${
                            slot.isBlocked ? "booked" : "available"
                          }`}
                        >
                          {slot.timeSlot} {slot.isBlocked && "(Booked)"}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <Button
                      variant="outline-primary"
                      onClick={() => handleSelectDoctor(schedule)}
                      disabled={schedule.availableTimeSlots.every(
                        (slot) => slot.isBlocked
                      )}
                      className="select-button"
                    >
                      Select
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>

      {/* Booking Modal */}
      <Modal
        show={showBookingModal}
        onHide={handleCloseBookingModal}
        centered
        className="booking-modal"
      >
        <Modal.Header closeButton className="modal-header-style">
          <Modal.Title className="modal-title-style">
            Book Appointment
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body-style">
          {selectedDoctorSchedule && (
            <div>
              <h4>
                Doctor: {selectedDoctorSchedule.doctorName} (
                {selectedDoctorSchedule.specialization})
              </h4>
              <p>Date: {selectedDoctorSchedule.date}</p>
              <Form.Group className="mb-3">
                <Form.Label className="form-label-style">
                  Select Time Slot
                </Form.Label>
                <Form.Control
                  as="select"
                  value={selectedTimeSlot}
                  onChange={(e) => setSelectedTimeSlot(e.target.value)}
                  className="form-control-style"
                >
                  <option value="">Select a time slot</option>
                  {selectedDoctorSchedule?.availableTimeSlots
                    .filter((slot) => !slot.isBlocked) // Only show unblocked time slots
                    .map((slot, index) => (
                      <option key={index} value={slot.timeSlot}>
                        {slot.timeSlot}
                      </option>
                    ))}
                </Form.Control>
              </Form.Group>
              <Button
                variant="success"
                onClick={handleBookAppointment}
                disabled={!selectedTimeSlot}
                className="book-button"
              >
                Book Now
              </Button>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="modal-footer-style">
          <Button
            variant="secondary"
            onClick={handleCloseBookingModal}
            className="close-button"
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Success Modal */}
      <Modal
        show={showSuccessModal}
        onHide={() => setShowSuccessModal(false)}
        centered
        className="success-modal"
      >
        <Modal.Header closeButton className="modal-header-style-success">
          <Modal.Title className="modal-title-style-success">
            Appointment Booked!
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body-style-success">
          <p>Your appointment has been scheduled successfully.</p>
        </Modal.Body>
        <Modal.Footer className="modal-footer-style-success">
          <Button
            variant="primary"
            onClick={() => setShowSuccessModal(false)}
            className="ok-button"
          >
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default BookAppointment;
