import React, { useContext, useEffect, useState } from "react"
import fetchFactions from "@/API/fetchFactions"
import { Button, Form, Row, Col } from "react-bootstrap";
import { UserContext } from "@/Contexts/UserContext";
import { IFaction, IUser } from "@/Types/types";
import registerUser from "@/API/registerUser";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { addUserToStorage } from "@/utils/addUserToStorage"
import { getUsersFromStorage } from "../utils/getUsersFromStorage";

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

    if (result instanceof AxiosError) {
      if (result.status === 409) {
        toast.error("Agent name is taken");
      } else {
        toast.error("Oops, something went wrong!");
      }
    } else {
      const { symbol, accountId } = result.data.data.agent;
      const factionName = result.data.data.faction.name;


      const token = result.data.data.token;
      console.log(factionName);

      setUser(() => {
        return { symbol, accountId, token, factionName }
      });
      addUserToStorage({ symbol, accountId, token, factionName } as IUser);
      console.log(getUsersFromStorage());
      toast.success("Agent created!")
    }

    setSubmitting(false);
  }

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <fieldset disabled={submitting}>

          <Form.Group as={Row} className="mb-3" controlId="formUsername">
            <Form.Label column sm={2}>
              Symbol
            </Form.Label>
            <Col>
              <Form.Control
                value={newUser.symbol}
                isInvalid={symbolValidation}
                onFocus={() => { setSymbolValidation(false) }}
                onChange={(e) => {
                  setNewUser(user => {
                    return { ...user, symbol: e.target.value }
                  });
                }}
                aria-label="Username" type="text"
                placeholder="Username" />
              {symbolValidation && (<Form.Control.Feedback type="invalid">
                Please enter a name for your character
              </Form.Control.Feedback>)}
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3" controlId="formFaction">
            <Form.Label column sm={2}>
              Faction
            </Form.Label>
            <Col sm={10}>
              <Form.Select
                value={newUser.faction}
                onChange={(e) => {
                  setNewUser(user => {
                    return { ...user, faction: e.target.value }
                  });
                }}
                aria-label="Choose a faction">
                {factions && factions.map((faction) => {
                  return (<option key={faction.symbol} value={faction.symbol}>{faction.name}</option>)
                })}
              </Form.Select>
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3">
            <Button type="submit">Register</Button>
          </Form.Group>
        </fieldset>

      </Form >
    </>
  )

}

export default NewGame;