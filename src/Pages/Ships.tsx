import fetchShips from "@/API/fetchShips";
import fetchWaypoint from "@/API/fetchWaypoint";
import InfoBar from "@/Components/InfoBar";
import { IShip, IWayPoint } from "@/Types/types";
import { logInDev } from "@/utils/logInDev";
import { useEffect, useState } from "react"
import { Accordion, Badge, Button, ButtonGroup } from "react-bootstrap";
import formatString from '@/utils/formatString';
import WaypointModal from "@/Components/ShipyardModal";

export default function Ships() {
  const [isLoading, setIsLoading] = useState(true);
  const [ships, setShips] = useState<IShip[]>([]);
  const [waypoints, setWaypoints] = useState<{ [key: string]: IWayPoint }>({});
  const [showModal, setShowModal] = useState(false);
  const [viewSystem, setViewSystem] = useState<IWayPoint>({} as IWayPoint);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    (async () => {
      const ships = await fetchShips();
      logInDev(ships);
      setShips(ships)
    })();
  }, [refresh]);

  useEffect(() => {
    (async () => {
      if (ships.length) {
        for (const ship of ships) {
          const result = await fetchWaypoint(ship.nav.waypointSymbol, ship.nav.systemSymbol);
          setWaypoints((prev) => ({ ...prev, [ship.symbol]: result }));
        }
        setIsLoading(false);
      }
    })();
  }, [ships]);

  function handleModal(waypoint: IWayPoint) {
    setViewSystem(waypoint);
    setShowModal(true);
  }

  if (isLoading) {
    return <p>Loading...</p>
  }

  return (
    <>
      <Accordion

        className="my-ships-accordion"
        defaultActiveKey="0" style={{ width: "80vw" }}>

        {ships.map((ship, index) => (
          <Accordion.Item eventKey={`${index}`}>

            <Accordion.Header>{ship.symbol}</Accordion.Header>
            <Accordion.Body className="accordion-ship-information">
              <div className="grid-span-4">{ship.frame.description}</div>
              <div className="grid-span-4">Status: {ship.nav.status}</div>
              <div className="grid-span-4">Type: {ship.frame.name}</div>
              <div>Crew:</div>
              <InfoBar reverseTint={true} current={ship.crew.current} full={ship.crew.capacity} />
              <div>Fuel:</div>
              <InfoBar current={ship.fuel.current} full={ship.fuel.capacity} />
            </Accordion.Body>

            <Accordion.Body>
              <h5>Location - {ship.nav.waypointSymbol} - {formatString(waypoints[ship.symbol].type)}</h5>
              <div className="ship-location-information">
                <ButtonGroup className="ship-location-actions">
                  {waypoints[ship.symbol].traits.some(some => some.symbol === "SHIPYARD")
                    && (<Button size="sm" onClick={() => { handleModal(waypoints[ship.symbol]) }}>View ships</Button>)}

                  {waypoints[ship.symbol].traits.some(some => some.symbol === "MARKETPLACE")
                    && (<Button size="sm" disabled onClick={() => { handleModal(waypoints[ship.symbol]) }}>View market</Button>)}
                </ButtonGroup>


                {waypoints[ship.symbol].traits.length &&
                  <div className="waypoint-pills">
                    {waypoints[ship.symbol].traits.map((trait) => {
                      return (<Badge bg="secondary" key={waypoints[ship.symbol].symbol + trait.name}>{trait.name}</Badge>)
                    })}
                  </div>
                }
              </div>
            </Accordion.Body>
          </Accordion.Item>

        ))};
      </Accordion>
      <WaypointModal show={showModal} setRefresh={setRefresh} setShow={setShowModal} system={viewSystem.systemSymbol} waypoint={viewSystem} />
    </>
  )
}