import React, { useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../CSS/Signup.css";
import right from"../assets/signup-image.jpg";

function SignUp() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "ROLE_PATIENT", // Default role
  });
  const [response, setResponse] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setUser({ ...user, [event.target.name]: event.target.value });
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // prevent default behaviour of loading the page when form is submitted
    setIsSubmitting(true);
    setResponse("");

    try {
      const res = await fetch("http://localhost:8060/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (res.ok) {
        setResponse("Account created successfully!");
        setTimeout(() => navigate("/"), 1000); // Redirect to login after 1 seconds
      } else {
        // const errorData = await res.text();
        setResponse("Sign Up failed. Please try again.");
      }
    } catch (error) {
      setResponse("Sign Up failed. Please try again later.");
    } finally {
      setIsSubmitting(false); // Reset the submitting state so can intreact again
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-image-container">
        <img src={right} alt="Signup" className="signup-image" />
       </div>
      <div className="signup-container">
        <h2 className="signup-title">Create Your Account</h2>
        <p className="signup-subtitle">Join us and manage your appointments easily.</p>

        {response && (
          <Alert variant={response.includes("successfully") ? "success" : "danger"}>{response}</Alert>
        )}

        <Form onSubmit={handleFormSubmit} className="signup-form">
          <Form.Group className="mb-3">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={user.name}
              onChange={handleInputChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="Enter your email"
              value={user.email}
              onChange={handleInputChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Enter your password"
              value={user.password}
              onChange={handleInputChange}
              required
            />
          </Form.Group>

          {/* <Form.Group className="mb-3">
            <Form.Label>Role</Form.Label>
            <Form.Select
              name="role"
              value={user.role}
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
            className="w-100"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating Account..." : "Sign Up"}
          </Button>
        </Form>

        <div className="text-center mt-3">
          <Button variant="link" onClick={() => navigate("/login")} className="login-link">
            Already have an account? <span className="fw-bold">Login</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default SignUp;