import fetchWaypoints from "@/API/fetchWaypoints";
import getHQCoords from "@/API/getHQCoords";
import WaypointCard from "@/Components/WaypointCard";
import WaypointModal from "@/Components/WaypointModal";
import WaypointPlaceholder from "@/Components/WaypointPlaceholder";
import { IWayPoint } from "@/Types/types";
import { logInDev } from "@/utils/logInDev";
import { useEffect, useState } from "react";
import { Tabs, Tab } from "react-bootstrap";

export default function ShipNavigation() {
  const [waypoints, setWaypoints] = useState<IWayPoint[]>([]);
  const [currentWaypoint, setCurrentWaypoint] = useState<IWayPoint | null>(null);
  const [isLoading, setIsLoading] = useState(true)
  const [currentSystem, setCurrentSystem] = useState("");
  const [activeTab, setActiveTab] = useState('ALL');

  const [showModal, setShowModal] = useState(false);

  const systemRegex = /^[^-]+-[^-]+(?=-)/;

  useEffect(() => {
    (async () => {
      const coords = await getHQCoords();
      const [system] = coords.match(systemRegex);
      logInDev(system);
      setCurrentSystem(system);
    })();
  }, []);


  useEffect(() => {
    setIsLoading(true);
    (async () => {
      if (currentSystem) {
        const systemWaypoints = await fetchWaypoints(currentSystem, activeTab);
        if (systemWaypoints?.length) {
          setWaypoints(systemWaypoints)
        };
      }
      setIsLoading(false);
    })();
  }, [currentSystem, activeTab])

  return (
    <>
      <Tabs
        activeKey={activeTab}
        id="justify-tab-example"
        className="mb-3 waypoints-tabs"
        justify
        onSelect={(k) => setActiveTab(k || 'ALL')}
      >
        <Tab eventKey="ALL" title="All" />
        <Tab eventKey="SHIPYARD" title="Shipyards" />
        <Tab eventKey="MARKETPLACE" title="Marketplaces" />
        <Tab eventKey="OUTPOST" title="Outposts" />
      </Tabs>
      <div className="waypoints-grid">
        {!isLoading && waypoints.map((waypoint) => (
          <WaypointCard waypoint={waypoint} setCurrentWaypoint={setCurrentWaypoint} setShowModal={setShowModal} />
        ))}
        {isLoading && <WaypointPlaceholder amount={10}/>}
      </div>
      <WaypointModal system={currentSystem} show={showModal} setShow={setShowModal} waypoint={currentWaypoint}/>
    </>
  )
}