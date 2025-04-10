import { Link } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap';

export default function Home() {
  return (
    <Container className="text-center mt-5">
      <h1 className="mb-4">Welcome to the API System</h1>
      <div className="d-flex justify-content-center gap-3">
        <Button as={Link} to="/login" variant="primary" size="lg">
          Login
        </Button>
        <Button as={Link} to="/register" variant="success" size="lg">
          Register
        </Button>
      </div>
    </Container>
  );
}