import { UserContext } from "@/Contexts/UserContext";
import { useContext } from "react";
import { Navbar, Container, NavDropdown, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

export function Navigation() {
  const { user } = useContext(UserContext);

  return (
    <Navbar bg="dark">
      <Container>
        <Navbar.Brand href="#home">
          <h1 className="nav-brand">STQS</h1>
        </Navbar.Brand>
        <Navbar.Toggle />

        <Nav.Link as={Link} to="/agents">Agents</Nav.Link>
        <Nav.Link as={Link} to="/contracts">Contracts</Nav.Link>
        <Nav.Link as={Link} to="/navigation">Navigation</Nav.Link>

        <Navbar.Collapse className="justify-content-end">
          {user && <NavDropdown title={user?.symbol} className="nav-user-info">
              <NavDropdown.Item href="#action/3.2">
                Switch agent
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                Agent information
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Delete agent
              </NavDropdown.Item>
            </NavDropdown>}

        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}