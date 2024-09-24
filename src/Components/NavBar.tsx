import { UserContext } from "@/Contexts/UserContext";
import fetchUserInfo from "@/utils/fetchUserInfo";
import { useContext, useEffect, useState } from "react";
import { Navbar, Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export function Navigation() {
  const [balance, setBalance] = useState<number>(0);
  const { user } = useContext(UserContext);
  const nav = useNavigate();

  function handleLink(url: string) {
    nav(url);
  }

  useEffect(() => {
    (async () => {
      if (user) {
        const userInfo = await fetchUserInfo();
        setBalance(userInfo.credits);
      }
    })();
  }, [user]);

  return (
    <Navbar bg="dark" expand="sm">
      <Navbar.Brand>
        <h1 className="nav-brand">STQS</h1>
      </Navbar.Brand>
      <Navbar.Toggle />

      <Navbar.Collapse id="navbar-grid">
        <Nav.Item className="can-click nav-link">
          <Nav.Link onClick={() => handleLink("/agents")}>Agents</Nav.Link>
        </Nav.Item>
        {user &&
          <>
            <Nav.Item className="can-click nav-link">
              <Nav.Link onClick={() => handleLink("/contracts")}>Contracts</Nav.Link>
            </Nav.Item>
            <Nav.Item className="can-click nav-link">
              <Nav.Link onClick={() => handleLink("/navigation")}>Navigation</Nav.Link>
            </Nav.Item>
            <Nav.Item className="can-click nav-link">
              <Nav.Link onClick={() => handleLink("/ships")}>Ships</Nav.Link>
            </Nav.Item>
          </>}
      </Navbar.Collapse>

      {user &&
        <>
          <Nav.Item className="navbar-userInfo">
            <div className="align-text-right">Agent:</div><div className="bolden">{user.symbol}</div>
            <div className="align-text-right">Balance:</div><div className="bolden">{balance}</div>
          </Nav.Item>
        </>
      }
    </Navbar >
  );
}