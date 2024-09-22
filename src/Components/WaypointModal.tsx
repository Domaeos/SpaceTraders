import fetchShips from '@/API/fetchShips';
import { IWayPoint } from '@/Types/types';
import formatString from '@/utils/formatString';
import { logInDev } from '@/utils/logInDev';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Button, ListGroup } from 'react-bootstrap';
// import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function WaypointModal({ system, show, setShow, waypoint }:
  { system: string, show: boolean, waypoint: IWayPoint | null, setShow: Dispatch<SetStateAction<boolean>> }) {
  const [ships, setShips] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    logInDev(waypoint);
    (async () => {
      const ships = await fetchShips(system, waypoint?.symbol || "");
      logInDev(ships);
      setShips(ships);
      setIsLoading(false);
    })();
  }, [waypoint]);

  function handlePurchase(type: string) {

  }

  if (isLoading) {
    return <p>Loading</p>
  }

  return (
    <>
      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{waypoint?.symbol ?? ""} Shipyard</Modal.Title>
        </Modal.Header>
        <ListGroup variant="flush">
          {ships?.shipTypes.map((ship: any, i: number) => {
            const formatted = formatString(ship.type.replace("SHIP", ""));
            return (
              <ListGroup.Item key={i}>
                <div className='opposite-flex'>{formatted}<Button size="sm" onClick={() => handlePurchase(ship.type)}>Purchase</Button></div>
              </ListGroup.Item>
            )
          })}
        </ListGroup>
        <Modal.Footer>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default WaypointModal;