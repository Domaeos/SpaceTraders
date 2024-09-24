import React, { useContext, useEffect, useState } from "react"
import fetchFactions from "@/API/fetchFactions"
import { Button, Form, Row, Col } from "react-bootstrap";
import { UserContext } from "@/Contexts/UserContext";
import { IFaction, IUser } from "@/Types/types";
import registerUser from "@/API/registerUser";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { addUserToStorage } from "@/utils/addUserToStorage"
import axiosClient from "@/API/client";
import { logInDev } from "@/utils/logInDev";
import setCurrentUserInStorage from "@/utils/setCurrentUserInStorage";

function NewGame() {
  const [factions, setFactions] = useState<IFaction[] | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [newUser, setNewUser] = useState({
    symbol: "",
    faction: "COSMIC",
  });
  const [symbolValidation, setSymbolValidation] = useState(false);
  const { setUser } = useContext(UserContext);

  useEffect(() => {

    (async () => {
      const factions = await fetchFactions();
      setFactions(factions!.data.data);
    })();

  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (newUser.symbol.length < 5 || newUser.symbol.length > 14) {
      setSymbolValidation(true);
      return;
    }
    setSubmitting(true);

    const loadingToast = toast.loading("Registering new user..");
    const result = await registerUser(newUser);
    toast.dismiss(loadingToast)

    logInDev(result);

    if (result instanceof AxiosError) {

      if (result.status === 409) {
        logInDev(newUser);
        toast.error("Agent name is taken");
      } else {
        toast.error("Oops, something went wrong!");
      }

    } else {

      const { symbol, accountId } = result.data.data.agent;
      const factionName = result.data.data.faction.name;
      const token = result.data.data.token;

      logInDev(result.data.data);

      setUser(() => {
        return { symbol, accountId, token, factionName }
      });

      addUserToStorage({ symbol, accountId, token, factionName } as IUser);
      setCurrentUserInStorage({ symbol, accountId, token, factionName } as IUser);
      axiosClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      toast.success("Agent created!")
      setNewUser({
        symbol: "",
        faction: "COSMIC"
      })
    }

    setSubmitting(false);
  }

  return (
    <Form className="register-user-form" onSubmit={handleSubmit}>
      <fieldset disabled={submitting}>

        <Form.Group as={Row} className="mb-3" controlId="formUsername">
          <Col>
            <Form.Control
              value={newUser.symbol}
              isInvalid={symbolValidation}
              onFocus={() => { setSymbolValidation(false) }}
              onChange={(e) => {
                setNewUser(x => {
                  return { ...x, symbol: e.target.value }
                });
              }}
              aria-label="Username" type="text"
              placeholder="Username" />
            {symbolValidation && (<Form.Control.Feedback type="invalid">
              Please enter a name for your character between 5 and 14 characters
            </Form.Control.Feedback>)}
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="formFaction">
          <Col>
            <Form.Select
              value={newUser.faction}
              onChange={(e) => {
                setNewUser(x => {
                  return { ...x, faction: e.target.value }
                });
              }}
              aria-label="Choose a faction">
              {factions && factions.map((faction) => {
                return (<option key={faction.symbol} value={faction.symbol}>{faction.name}</option>)
              })}
            </Form.Select>
          </Col>
        </Form.Group>

        <Form.Group>
          <Col className="text-center">
          <Button type="submit">New agent</Button>
          </Col>
        </Form.Group>
      </fieldset>

    </Form >
  )

}

export default NewGame;