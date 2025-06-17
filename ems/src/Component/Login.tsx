import React, { useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import leftImage from "../assets/login-image.jpg";
import "../CSS/Login.css";

const Login: React.FC = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
    role: "ROLE_PATIENT", // Default role
  });
  const [response, setResponse] = useState("");
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation state
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setCredentials({ ...credentials, [event.target.name]: event.target.value });

    // Clear errors for the field being updated
    setErrors({ ...errors, [event.target.name]: "" });
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { email: "", password: "" };

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!credentials.email.trim()) {
      newErrors.email = "Email is required.";
      isValid = false;
    } else if (!emailRegex.test(credentials.email)) {
      newErrors.email = "Please enter a valid email address.";
      isValid = false;
    }

    // Password validation
    if (!credentials.password.trim()) {
      newErrors.password = "Password is required.";
      isValid = false;
    } else if (credentials.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setResponse("");

    // Validate the form before submitting
    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }
    // wait for promise to resolve
    try {
      const res = await fetch("http://localhost:8060/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials), // Send credentials as JSON
      });

      if (res.ok) {
        const data = await res.json();
        const { token, role, patientId, email } = data;

        // Store token, patientId, and email in localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("patientId", patientId);
        localStorage.setItem("email", email);
        setResponse(
          `Welcome, ${
            role === "ROLE_DOCTOR" ? "Doctor" : "Patient"
          }! Redirecting...`
        );

        // Redirect based on role
        setTimeout(() => {
          if (role === "ROLE_DOCTOR") {
            navigate("/doctorscheduledashboard");
          } else {
            navigate("/patient");
          }
        }, 1500);
      } else {
        // const errorData = await res.text();
        setResponse("Login failed. Please check your credentials.");
      }
    } catch (error) {
      setResponse("Login failed. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUpRedirect = () => {
    navigate("/signup");
  };
  // alert should have success or failure
  const alertVariant = response.toLowerCase().includes("welcome")
    ? "success"
    : "danger";

  return (
    <div className="login-page">
      <div className="login-image-container">
        <img src={leftImage} alt="Login" className="login-image" />
      </div>

      <div className="login-container">
        <h2 className="login-title">Welcome Back!</h2>
        <p className="login-subtitle">Login to access your HMS dashboard.</p>

        {response && (
          <Alert variant={alertVariant} className="login-alert">
            {response}
          </Alert>
        )}

        <Form onSubmit={handleFormSubmit} className="login-form">
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="Enter your email"
              value={credentials.email}
              onChange={handleInputChange}
              isInvalid={!!errors.email}
              required
            />
            <Form.Control.Feedback type="invalid">
              {errors.email}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Enter your password"
              value={credentials.password}
              onChange={handleInputChange}
              isInvalid={!!errors.password}
              required
            />
            <Form.Control.Feedback type="invalid">
              {errors.password}
            </Form.Control.Feedback>
          </Form.Group>

          {/* <Form.Group className="mb-3">
            <Form.Label>Role</Form.Label>
            <Form.Select
              name="role"
              value={credentials.role}
              onChange={handleInputChange}
              required
            >
              <option value="ROLE_PATIENT">Patient</option>
              <option value="ROLE_DOCTOR">Doctor</option>
            </Form.Select>
          </Form.Group> */}

          <Button
            variant="primary"
            type="submit"
            className="w-100 login-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Logging In..." : "Login"}
          </Button>
          <div className="text-center mt-3">
            <Button
              variant="link"
              onClick={handleSignUpRedirect}
              className="signup-link"
            >
              Don't have an account? <span className="fw-bold">Sign Up</span>
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Login;
