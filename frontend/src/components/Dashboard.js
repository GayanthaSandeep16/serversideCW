import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Container, 
  Card, 
  Button, 
  Form, 
  Row, 
  Col, 
  Alert, 
  ListGroup,
  Badge,
  InputGroup,
  FormSelect
} from 'react-bootstrap';

export default function Dashboard() {
  const [apiKeys, setApiKeys] = useState([]);
  const [countryName, setCountryName] = useState('');
  const [countryData, setCountryData] = useState(null);
  const [selectedApiKey, setSelectedApiKey] = useState('');
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
      const response = await axios.get('http://localhost:3000/auth/my-api-keys', {
        withCredentials: true,
      });
      setApiKeys(response.data.filter((key) => key.isActive));
    } catch (err) {
      setError('Failed to fetch API keys: ' + (err.response?.data?.error || err.message));
    }
  };

  const generateApiKey = async () => {
    try {
      await axios.post('http://localhost:3000/auth/generate-key', {}, {
        withCredentials: true,
      });
      fetchApiKeys();
    } catch (err) {
      setError('Failed to generate API key: ' + (err.response?.data?.error || err.message));
    }
  };

  const revokeApiKey = async (id) => {
    try {
      await axios.post(`http://localhost:3000/auth/revoke-key/${id}`, {}, {
        withCredentials: true,
      });
      fetchApiKeys();
    } catch (err) {
      setError('Failed to revoke API key: ' + (err.response?.data?.error || err.message));
    }
  };

  const fetchCountryData = async (e) => {
    e.preventDefault();
    if (!selectedApiKey) {
      setError('Please select an API key.');
      return;
    }
    try {
      const response = await axios.get(`http://localhost:3000/api/country/${countryName}`, {
        headers: { Authorization: selectedApiKey },
      });
      setCountryData(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch country data: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <Container className="mt-4">
      <Card className="shadow">
        <Card.Header className="bg-primary text-white">
          <h2 className="mb-0">User Dashboard</h2>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}

          {/* API Key Management Section */}
          <Card className="mb-4">
            <Card.Header>API Key Management</Card.Header>
            <Card.Body>
              <Button variant="success" onClick={generateApiKey} className="mb-3">
                Generate New API Key
              </Button>
              
              {apiKeys.length > 0 ? (
                <ListGroup>
                  {apiKeys.map((key) => (
                    <ListGroup.Item key={key.id} className="d-flex justify-content-between align-items-center">
                      <div>
                        <code>{key.apiKey}</code>
                        <Badge bg={key.isActive ? 'success' : 'danger'} className="ms-2">
                          {key.isActive ? 'Active' : 'Revoked'}
                        </Badge>
                      </div>
                      {key.isActive && (
                        <Button 
                          variant="outline-danger" 
                          size="sm" 
                          onClick={() => revokeApiKey(key.id)}
                        >
                          Revoke
                        </Button>
                      )}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <p className="text-muted">No API keys generated yet.</p>
              )}
            </Card.Body>
          </Card>

          {/* Country Data Fetch Section */}
          <Card className="mb-4">
            <Card.Header>Fetch Country Data</Card.Header>
            <Card.Body>
              <Form onSubmit={fetchCountryData}>
                <Row className="g-3">
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Select API Key</Form.Label>
                      <FormSelect
                        value={selectedApiKey}
                        onChange={(e) => setSelectedApiKey(e.target.value)}
                        required
                      >
                        <option value="">Select an API Key</option>
                        {apiKeys
                          .filter((key) => key.isActive)
                          .map((key) => (
                            <option key={key.id} value={key.apiKey}>
                              {key.apiKey.substring(0, 8)}... (Last Used: {key.ApiKeyUsage?.lastUsed
                                ? new Date(key.ApiKeyUsage.lastUsed).toLocaleString()
                                : 'Never'})
                            </option>
                          ))}
                      </FormSelect>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Country Name</Form.Label>
                      <InputGroup>
                        <Form.Control
                          type="text"
                          placeholder="Enter country name (e.g., France)"
                          value={countryName}
                          onChange={(e) => setCountryName(e.target.value)}
                          required
                        />
                      </InputGroup>
                    </Form.Group>
                  </Col>
                  <Col md={2} className="d-flex align-items-end">
                    <Button 
                      variant="primary" 
                      type="submit" 
                      className="w-100"
                      disabled={!selectedApiKey}
                    >
                      Fetch Data
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>

          {/* Country Data Display */}
          {countryData && (
            <Card>
              <Card.Header>Country Information</Card.Header>
              <Card.Body>
                <Row>
                  <Col md={8}>
                    <h3>{countryData.name}</h3>
                    <Row className="mt-3">
                      <Col md={6}>
                        <p><strong>Currency:</strong> {countryData.currency.name} ({countryData.currency.symbol})</p>
                        <p><strong>Capital:</strong> {countryData.capital}</p>
                      </Col>
                      <Col md={6}>
                        <p><strong>Languages:</strong> {countryData.languages.join(', ')}</p>
                      </Col>
                    </Row>
                  </Col>
                  <Col md={4} className="text-center">
                    <img
                      src={countryData.flag}
                      alt={`${countryData.name} flag`}
                      style={{ maxWidth: '150px', border: '1px solid #ddd' }}
                    />
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          )}
        </Card.Body>
        <Card.Footer className="text-end">
          <Button variant="danger" onClick={handleLogout}>
            Logout
          </Button>
        </Card.Footer>
      </Card>
    </Container>
  );
}