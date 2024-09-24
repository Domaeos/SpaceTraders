import fetchAllWaypoints from "@/API/fetchAllWaypoints";
import getHQCoords from "@/API/getHQCoords";
import WaypointCard from "@/Components/WaypointCard";
import WaypointPlaceholder from "@/Components/WaypointPlaceholder";
import { IWayPoint } from "@/Types/types";
import getSystem from "@/utils/getSystem";
import { useEffect, useState } from "react";
import { Tabs, Tab } from "react-bootstrap";

export default function ShipNavigation() {
  const [waypoints, setWaypoints] = useState<IWayPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true)
  const [currentSystem, setCurrentSystem] = useState("");
  const [activeTab, setActiveTab] = useState('ALL');

  useEffect(() => {
    (async () => {
      const symbol = await getHQCoords();
      const system = getSystem(symbol);
      setCurrentSystem(system);
    })();
  }, []);


  useEffect(() => {
    setIsLoading(true);
    (async () => {
        if (currentSystem) {
          const systemWaypoints = await fetchAllWaypoints(currentSystem, activeTab);
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
          <WaypointCard key={waypoint.symbol} waypoint={waypoint} />
        ))}
        {isLoading && <WaypointPlaceholder amount={10} />}
      </div>
    </>
  )
}