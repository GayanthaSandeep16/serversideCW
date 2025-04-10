import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Navbar as BootstrapNavbar, Nav, Container, Button } from 'react-bootstrap';

export default function AppNavbar() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const checkAuthState = () => {
    const userId = localStorage.getItem("userId");
    const role = localStorage.getItem("role");
    setIsAuthenticated(!!userId);
    setIsAdmin(role === "admin");
  };

  useEffect(() => checkAuthState(), []);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:3000/auth/logout", {}, { withCredentials: true });
      localStorage.clear();
      setIsAuthenticated(false);
      setIsAdmin(false);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <BootstrapNavbar bg="dark" variant="dark" expand="lg">
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/">API System</BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {!isAuthenticated ? (
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/register">Register</Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
                {isAdmin && <Nav.Link as={Link} to="/admin">Admin</Nav.Link>}
                <Button variant="outline-danger" onClick={handleLogout} className="ms-2">
                  Logout
                </Button>
              </>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
}