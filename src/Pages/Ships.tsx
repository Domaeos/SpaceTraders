import fetchShips from "@/API/fetchShips";
import fetchWaypoint from "@/API/fetchWaypoint";
import InfoBar from "@/Components/InfoBar";
import { IShip, IWayPoint } from "@/Types/types";
import { logInDev } from "@/utils/logInDev";
import { useEffect, useState } from "react"
import { Accordion, Badge, Button, ButtonGroup, Dropdown, ProgressBar } from "react-bootstrap";
import formatString from '@/utils/formatString';
import WaypointModal from "@/Components/ShipyardModal";
import fetchAllWaypoints from "@/API/fetchAllWaypoints";
import setOrbit from "@/API/setOrbit";
import toast from "react-hot-toast";
import shipNavigation from "@/API/shipNavigation";
import ReactTimeAgo from "react-time-ago";
import setDock from "@/API/setDock";
import refuelShip from "@/API/refuelShip";
import extract from "@/API/extract";

export default function Ships() {
  const [isLoading, setIsLoading] = useState(true);
  const [ships, setShips] = useState<IShip[]>([]);
  const [waypoints, setWaypoints] = useState<{ [key: string]: IWayPoint }>({});
  const [showModal, setShowModal] = useState(false);
  const [viewSystem, setViewSystem] = useState<IWayPoint>({} as IWayPoint);
  const [refresh, setRefresh] = useState(false);
  const [navigationWaypoints, setNavigationWaypoints] = useState<{ [key: string]: IWayPoint[] }>({});
  const [time, setTime] = useState(Date.now());

  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    if (initialLoad) setIsLoading(true);

    (async () => {
      const shipsResult = await fetchShips();
      await getShipNavigation(shipsResult);
      setShips(shipsResult);

      if (initialLoad) {
        setIsLoading(false);
        setInitialLoad(false);
      }
    })();
  }, [refresh]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(() => {
        return new Date().getTime();
      });
    }, 500);

    return () => clearInterval(interval);
  }, [ships]);


  async function getShipNavigation(ships: IShip[]): Promise<void> {
    for (const ship of ships) {

      const result = await fetchWaypoint(ship.nav.waypointSymbol, ship.nav.systemSymbol);
      setWaypoints((prev) => ({ ...prev, [ship.symbol]: result }));

      if (!navigationWaypoints[ship.nav.systemSymbol]) {
        const navigationResult = await fetchAllWaypoints(ship.nav.systemSymbol);
        setNavigationWaypoints((prev) => {
          return { ...prev, [ship.nav.systemSymbol]: navigationResult }
        });
      }
    }
  }

  function handleModal(waypoint: IWayPoint) {
    setViewSystem(waypoint);
    setShowModal(true);
  }

  function handleError(code: number) {
    logInDev(`Error code: ${code}`);
    switch (code) {
      case 4203:
        toast.error("Not enough fuel");
        break;
      default:
        toast.error("Something went wrong");
    }
  }

  async function handleShipNav(ship: IShip, newWayPoint: string) {
    logInDev(`Setting ${ship.symbol} to navigate to ${newWayPoint}`);

    const result = await shipNavigation(ship.symbol, newWayPoint);

    if (result.code === 200) {

      toast.success("Ship is now navigating");
      setRefresh(refresh => !refresh);

    } else {

      handleError(result.code);

    }
  }

  async function handleDock(ship: IShip) {
    logInDev("Docking ship");
    const result = await setDock(ship.symbol);

    if (result.code === 200) {

      toast.success("Ship successfully docked");
      setRefresh(refresh => !refresh);

    } else {
      handleError(result.code);
    }
  }

  function checkExpired(timeToCheck: string) {
    const timeToCheckEpoch = new Date(timeToCheck).getTime();
    return timeToCheckEpoch > time;
  }

  async function handleRefuel(ship: IShip) {
    logInDev("Refuelling ship");
    const result = await refuelShip(ship.symbol);

    if (result.code === 200) {

      toast.success("Ship successfully refuelled");
      setRefresh(refresh => !refresh);

    } else {
      handleError(result.code);
    }
  }

  async function handleExtraction(ship: IShip) {
    logInDev("Extracting began");
    const result = await extract(ship.symbol);
    if (result.code === 200) {

      toast.success("Extraction began");
      setRefresh(refresh => !refresh);

    } else {
      handleError(result.code);
    }
  }

  async function handleOrbit(ship: IShip) {
    const loadingToast = toast.loading("Setting ship to orbit");
    const result = await setOrbit(ship.symbol);
    toast.dismiss(loadingToast);

    result.code === 200 ? toast.success("Ship is now in orbit") : handleError(result.code);
    setRefresh(refresh => !refresh);
  }

  if (isLoading) {
    return <p>Loading...</p>
  }

  return (
    <>
      <Accordion

        className="my-ships-accordion"
        defaultActiveKey="0" style={{ width: "80vw" }}>

        {ships.length && ships.map((ship, index) => (
          <Accordion.Item eventKey={`${index}`} key={index}>

            <Accordion.Header>{ship.symbol}</Accordion.Header>
            <Accordion.Body className="accordion-ship-information">
              <div className="grid-span-4">{ship.frame.description}</div>
              <div className="grid-span-4">Status: {formatString(ship.nav.status)}</div>
              <div className="grid-span-4">Type: {formatString(ship.frame.name)}</div>
              {ship.cooldown.expiration && new Date(ship.cooldown.expiration).getTime() > time &&
                <>
                  <div className="grid-span-4">Cooldown over:  <ReactTimeAgo className="grid-span-4" date={new Date(ship.cooldown.expiration)} /></div>
                </>
              }
              <div>Crew:</div>
              <InfoBar reverseTint={true} current={ship.crew.current} full={ship.crew.capacity} />
              <div>Fuel:</div>
              <InfoBar current={ship.fuel.current} full={ship.fuel.capacity} />
            </Accordion.Body>

            <Accordion.Body className="accordion-cargo-information">
              <h5 className="grid-span-8">Cargo: {ship.cargo.units}/{ship.cargo.capacity}</h5>
              {ship.cargo.inventory.length ? ship.cargo.inventory.map(item => {
                return (
                  <>
                    <div className="align-text-right">
                      {item.name}
                    </div>
                    <div className="align-text-left bolden text-sm">{item.units}
                    </div>
                  </>
                )
              }) : "No cargo onboard"}
            </Accordion.Body>


            <Accordion.Body>
              <h5>{ship.nav.status === "IN_TRANSIT" ? `Navigating to` : `Location`} - {ship.nav.waypointSymbol} - {formatString(waypoints[ship.symbol].type)}</h5>
              <div className="ship-location-information">
                {ship.nav.status !== "IN_TRANSIT" ||
                  (ship.nav.status === "IN_TRANSIT" && new Date(ship.nav!.route!.arrival).getTime() < time) ? (
                  <ButtonGroup className="ship-location-actions">
                    {waypoints[ship.symbol].traits.some(some => some.symbol === "SHIPYARD")
                      && (
                        <Button size="sm"
                          disabled={ship.nav.status !== "DOCKED"}
                          onClick={() => { handleModal(waypoints[ship.symbol]) }}>View ships
                        </Button>)}

                    {waypoints[ship.symbol].traits.some(some => some.symbol === "MARKETPLACE")
                      && (<Button size="sm" disabled onClick={() => { handleModal(waypoints[ship.symbol]) }}>View market</Button>)}

                    {
                      ship.nav.status === "IN_ORBIT" ?
                        <>
                          <Button onClick={() => handleDock(ship)}>Dock</Button>
                          {ship.frame.name === "Drone" &&
                            <Button
                              disabled={checkExpired(ship.cooldown.expiration ?? "1")}
                              size="sm"
                              onClick={() => { handleExtraction(ship) }}>
                              Extract resources
                            </Button>}
                        </>
                        :
                        <>
                          <Button size="sm" onClick={() => { handleOrbit(ship) }}>Orbit</Button>
                          <Button size="sm" onClick={() => { handleRefuel(ship) }}>Refuel</Button>
                        </>
                    }
                  </ButtonGroup>
                ) : ship.nav.flightMode && ship.nav?.route && (
                  <>
                    <div className="grid-span-4">Flight mode: {formatString(ship.nav!.flightMode)}</div>
                    <div className="grid-span-4">Arriving:  <ReactTimeAgo date={new Date(ship.nav.route.arrival)} /></div>
                    <div className="grid-span-4">Departed:  <ReactTimeAgo date={new Date(ship.nav.route.departureTime)} /></div>
                    <ProgressBar
                      className="grid-span-4"
                      animated
                      now={((time - new Date(ship.nav.route.departureTime).getTime()) / (new Date(ship.nav.route.arrival).getTime() - new Date(ship.nav.route.departureTime).getTime())) * 100}
                    />
                  </>
                )}

                {
                  ship.nav.status === "IN_ORBIT" &&
                  <div className="ship-actions">
                    <Dropdown style={{ display: "inline" }}>
                      <Dropdown.Toggle variant="primary" id="dropdown-navigation">
                        Navigation
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        {navigationWaypoints[ship.nav.systemSymbol].map((waypoint) => {

                          if (waypoint.symbol === ship.nav.waypointSymbol) return "";

                          return (<Dropdown.Item key={waypoint.symbol} onClick={() => { handleShipNav(ship, waypoint.symbol) }}>
                            {waypoint.symbol} - {formatString(waypoint.type)}
                          </Dropdown.Item>)
                        })}
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                }

                {ship.nav.status !== "IN_TRANSIT" && waypoints[ship.symbol].traits.length &&
                  <div className="waypoint-pills">
                    {waypoints[ship.symbol].traits.map((trait) => {
                      return (<Badge bg="secondary" key={waypoints[ship.symbol].symbol + trait.name}>{trait.name}</Badge>)
                    })}
                  </div>
                }
              </div>
            </Accordion.Body>
          </Accordion.Item>

        ))}
      </Accordion>
      <WaypointModal show={showModal} setRefresh={setRefresh} setShow={setShowModal} system={viewSystem.systemSymbol} waypoint={viewSystem} />
    </>
  )
}