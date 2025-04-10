import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Card,
  Button,
  Alert,
  ListGroup,
  Badge
} from 'react-bootstrap';

export default function AdminDashboard() {
  const [apiKeys, setApiKeys] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('userId')) {
      navigate('/login');
      return;
    }
    fetchApiKeys();
  }, [navigate]);

  const fetchApiKeys = async () => {
    try {
      const response = await axios.get('http://localhost:3000/admin/api-keys', {
        withCredentials: true,
      });
      setApiKeys(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch API keys. Ensure you have admin privileges.');
    }
  };

  const revokeApiKey = async (id) => {
    try {
      await axios.post(`http://localhost:3000/auth/revoke-key/${id}`, {}, {
        withCredentials: true,
      });
      fetchApiKeys();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to revoke API key.');
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:3000/auth/logout', {}, { withCredentials: true });
    } catch (err) {
      console.error('Logout failed:', err);
    }
    localStorage.removeItem('userId');
    navigate('/login');
  };

  return (
    <Container className="mt-4">
      <Card className="shadow">
        <Card.Header className="bg-dark text-white d-flex justify-content-between align-items-center">
          <h2 className="mb-0">Admin Dashboard</h2>
          <div>
            <Link to="/dashboard" className="btn btn-outline-light me-2">
              User Dashboard
            </Link>
            <Button variant="danger" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}

          <ListGroup>
            {apiKeys.map((key) => (
              <ListGroup.Item key={key.id} className="mb-3">
                <div className="d-flex justify-content-between">
                  <div>
                    <h5>User: {key.User?.email || 'Unknown'}</h5>
                    <p className="mb-1">
                      <strong>API Key:</strong> <code>{key.apiKey}</code>
                    </p>
                    <p className="mb-1">
                      <strong>Status:</strong>{' '}
                      <Badge bg={key.isActive ? 'success' : 'danger'}>
                        {key.isActive ? 'Active' : 'Revoked'}
                      </Badge>
                    </p>
                    <p className="mb-1">
                      <strong>Usage Count:</strong> {key.ApiKeyUsage?.usageCount || 0}
                    </p>
                    <p className="mb-0">
                      <strong>Last Used:</strong>{' '}
                      {key.ApiKeyUsage?.lastUsed
                        ? new Date(key.ApiKeyUsage.lastUsed).toLocaleString()
                        : 'Never'}
                    </p>
                  </div>
                  {key.isActive && (
                    <Button
                      variant="outline-danger"
                      onClick={() => revokeApiKey(key.id)}
                    >
                      Revoke
                    </Button>
                  )}
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card.Body>
      </Card>
    </Container>
  );
}