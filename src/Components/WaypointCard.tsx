import { IWayPoint } from "@/Types/types";
import { Card, Button, Badge } from "react-bootstrap";

export default function WaypointCard({ waypoint }
  : { waypoint: IWayPoint }) {

  return (
    <Card>
      <Card.Header>{waypoint.symbol}</Card.Header>
      <Card.Body>
        <Card.Title>{waypoint.type}</Card.Title>
        <Button variant={waypoint.type !== "ORBITAL_STATION" ? "secondary" : "primary"}
          disabled={true}>{waypoint.type !== "ORBITAL_STATION" ? "View details" : "View ships" }</Button>
      </Card.Body>
      <Card.Footer>
        {waypoint.traits.length &&
          <div className="waypoint-pills">
            {waypoint.traits.map((trait) => {
              return (<Badge bg="secondary" key={waypoint.symbol + trait.name}>{trait.name}</Badge>)
            })}
          </div>
        }
      </Card.Footer>
    </Card>
  )
}