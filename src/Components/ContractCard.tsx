import acceptContract from "@/API/acceptContract";
import { IContract } from "@/Types/types";
import convertBooleanToYesOrNo from "@/utils/convertBooleanToYesOrNo";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Card, Button, ListGroup, Col, Container, Row } from 'react-bootstrap';
import toast from "react-hot-toast";
import ReactTimeAgo from "react-time-ago";
import formatString from '../utils/formatString';

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

  return (
    <Card className="contract-card">
      <Card.Body>
        <Card.Title>{contract.factionSymbol}-{(contract.id.slice(0, 3)).toUpperCase()}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">{contract.type}</Card.Subtitle>
      </Card.Body>
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
              <Button>
                Details
              </Button>
            </Col>
          </Row>
        </Container>
      </Card.Footer>
    </Card>
  )
}