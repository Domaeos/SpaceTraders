import acceptContract from "@/API/acceptContract";
import { IContract } from "@/Types/types";
import convertBooleanToYesOrNo from "@/utils/convertBooleanToYesOrNo";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Card, Button, ListGroup, Col, Container, Row } from 'react-bootstrap';
import toast from "react-hot-toast";
import ReactTimeAgo from "react-time-ago";
import formatString from '../utils/formatString';
import fullfillContract from "@/API/fulfillContract";

export function ContractCard({ contract, setRefresh }: { contract: IContract, setRefresh: Dispatch<SetStateAction<boolean>> }) {

  const [isAccepting, setIsAccepting] = useState(false);

  useEffect(() => {
    console.log(contract);
  }, [contract]);

  async function handleAccept(contract: IContract) {
    setIsAccepting(true);
    const result = await acceptContract(contract.id);
    if (result.status === 200) {
      toast.success("Contract accepted!");
      setRefresh(x => !x);
    } else {
      toast.error("Something went wrong");
    }
    setIsAccepting(false);
  }

  async function handleFulfill(contractID: string) {
    const result = await fullfillContract(contractID);
    if (result.code === 200) {
      toast.success("Contract fulfilled!");
    } else {
      toast.error("Something went wrong");
    }
  }

  const fulfilledStyle = {
    border: "1px solid #aad6a2",
    backgroundColor: "#e6f4e6"
  }

  return (
    <Card className="contract-card" style={contract.fulfilled ? fulfilledStyle : {}}>
      <Card.Body className={`${contract.fulfilled ? 'fullfilled-contract' : ""}`}>
        {contract.fulfilled && <Card.Title style={{ fontWeight: "bolder" }}>COMPLETED</Card.Title>}
        <Card.Title className="text-muted">{contract.factionSymbol}-{(contract.id.slice(0, 3)).toUpperCase()}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">{contract.type}</Card.Subtitle>
      </Card.Body>
      {!contract.fulfilled &&
        <>
          <Card.Header>
            Terms
          </Card.Header>
          <Card.Header>
            Deliver:
          </Card.Header>
          <Card.Body>
            <Card.Text>
              {contract.terms.deliver && contract.terms.deliver.map((item, index) => {
                return <div key={index}>{item.unitsRequired} {formatString(item.tradeSymbol)} to {item.destinationSymbol}</div>
              })}
            </Card.Text>
          </Card.Body>
          <Card.Header>
            Progress
          </Card.Header>
          <Card.Body>
            <Card.Text>
              {contract.terms.deliver && contract.terms.deliver.map((item, index) => {
                return <div key={index}>{item.unitsFulfilled}/{item.unitsRequired} {formatString(item.tradeSymbol)}</div>
              })}
            </Card.Text>
          </Card.Body>
          <ListGroup variant="flush">
            <ListGroup.Item>Expires: <ReactTimeAgo date={new Date(contract.expiration)} /></ListGroup.Item>
            <ListGroup.Item>Deadline: <ReactTimeAgo date={new Date(contract.deadlineToAccept)} /></ListGroup.Item>
            <ListGroup.Item>Accepted: {convertBooleanToYesOrNo(contract.accepted)}</ListGroup.Item>
            <ListGroup.Item>Fulfilled: {convertBooleanToYesOrNo(contract.fulfilled)}</ListGroup.Item>
          </ListGroup>
          <Card.Header>
            Rewards
          </Card.Header>
          <Card.Body>
            <Container>
              <Row>
                <Col>
                  On acceptance: {contract.terms.payment.onAccepted}
                </Col>
                <Col>
                  On completion: {contract.terms.payment.onFulfilled}
                </Col>
              </Row>
            </Container>
          </Card.Body>
          <Card.Footer>
            <Container>
              <Row>
                <Col className="center-content">
                  <Button
                    onClick={() => handleAccept(contract)}
                    disabled={contract.accepted || isAccepting}
                    variant={contract.accepted ? "success" : "primary"}
                  >
                    {contract.accepted ? "Accepted" : "Accept"}
                  </Button>
                </Col>
                <Col className="center-content">
                  <Button
                    onClick={() => handleFulfill(contract.id)}
                    disabled={!contract.terms.deliver?.every(x => x.unitsFulfilled === x.unitsRequired)}
                    variant="success"
                  >
                    Fulfill
                  </Button>
                </Col>
                <Col className="center-content">
                  <Button disabled>
                    Details
                  </Button>
                </Col>
              </Row>
            </Container>
          </Card.Footer>
        </>
      }
    </Card>
  )
}