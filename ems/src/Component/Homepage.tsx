import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import "../CSS/Homepage.css";

const Homepage: React.FC = () => {
  const [showAboutModal, setShowAboutModal] = useState(false); // about us

  const handleAboutModalOpen = () => setShowAboutModal(true);
  const handleAboutModalClose = () => setShowAboutModal(false);

  return (
    <div className="homepage">
      {/* Navbar Section */}
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-logo">
            Cognizant Hospital
          </Link>
          <ul className="navbar-links">
            <li>
              <Link to="/" className="navbar-link">
                Home
              </Link>
            </li>
            <li>
              <a href="#about" className="navbar-link" onClick={handleAboutModalOpen}>
                About Us
              </a>
            </li>
            <li>
              <a href="#services" className="navbar-link">
                Services
              </a>
            </li>
            <li>
              <a href="#testimonials" className="navbar-link">
                Testimonials
              </a>
            </li>
            <li>
              <a href="#contact" className="navbar-link">
                Contact
              </a>
            </li>
            <li>
              <Link to="/login" className="navbar-link">
                Login
              </Link>
            </li>
            <li>
              <Link to="/signup" className="navbar-link navbar-signup">
                Sign Up
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* About Us Modal */}
      <Modal show={showAboutModal} onHide={handleAboutModalClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>About Cognizant Hospital</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ textAlign: "justify", lineHeight: "1.6" }}>
            <p>
              <strong>Cognizant Hospital</strong> is a state-of-the-art healthcare facility dedicated to providing
              exceptional medical services with compassion and care. Established in 2005, our hospital has been at the
              forefront of delivering world-class healthcare solutions to patients from all walks of life.
            </p>
            <p>
              Our team of highly skilled doctors, nurses, and medical staff work tirelessly to ensure the well-being of
              our patients. With cutting-edge technology and advanced medical equipment, we offer a wide range of
              services, including emergency care, specialized treatments, diagnostics, and preventive healthcare.
            </p>
            <p>
              At Cognizant Hospital, we believe in a patient-first approach. Our mission is to create a healing
              environment where patients feel safe, cared for, and valued. We are committed to excellence in healthcare
              and strive to exceed expectations in every aspect of our service.
            </p>
            <p>
              <strong>Our Vision:</strong> To be a leader in healthcare innovation and deliver unparalleled medical
              services to our community.
            </p>
            <p>
              <strong>Our Mission:</strong> To provide compassionate, high-quality, and affordable healthcare to all.
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleAboutModalClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Welcome to Cognizant Hospital</h1>
          <p className="hero-subtitle">
            Your health is our priority. Experience world-class healthcare services with compassion and care.
          </p>
        </div>
        <div className="hero-image">
          <img src="/images/back.jfif" alt="Hospital" />
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="services-section">
        <h2 className="section-title">Our Services</h2>
        <div className="services-container">
          <div className="service-card">
            <img src="/images/Emergency.jfif" alt="Emergency Care" />
            <h3>Emergency Care</h3>
            <p>24/7 emergency services with highly trained medical staff and advanced equipment.</p>
          </div>
          <div className="service-card">
            <img src="/images/SpecialTreatments.jfif" alt="Specialized Treatments" />
            <h3>Specialized Treatments</h3>
            <p>Specialized departments for cardiology, oncology, neurology, and more.</p>
          </div>
          <div className="service-card">
            <img src="/images/Diagnosis.jfif" alt="Diagnostics" />
            <h3>Diagnostics</h3>
            <p>State-of-the-art diagnostic facilities including MRI, CT scan, and X-ray.</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="testimonials-section">
        <h2 className="section-title">What Our Patients Say</h2>
        <div className="testimonials-container">
          <div className="testimonial-card">
            <p>
              "The doctors and staff are amazing. They provided excellent care and made me feel at ease during my
              treatment."
            </p>
            <h4>- John Doe</h4>
          </div>
          <div className="testimonial-card">
            <p>
              "The facilities are top-notch, and the staff is very professional. I highly recommend this hospital."
            </p>
            <h4>- Jane Smith</h4>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-section">
        <h2 className="section-title">Contact Us</h2>
        <p>Email: contact@cognizanthospital.com</p>
        <p>Phone: +1 234 567 890</p>
        <p>Address: 123 Health Street, Wellness City</p>
      </section>
    </div>
  );
};

export default Homepage;