
import fetchShipyard from '@/API/fetchShipyard';
import purchaseShip from '@/API/purchaseShip';
import { IShipyard, IWayPoint } from '@/Types/types';
import formatString from '@/utils/formatString';
import { logInDev } from '@/utils/logInDev';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Button, ListGroup } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';

export default function ShipyardModal({ system, show, setShow, waypoint, setRefresh }:
  {
    system: string,
    show: boolean,
    waypoint: IWayPoint | null,
    setShow: Dispatch<SetStateAction<boolean>>,
    setRefresh: Dispatch<SetStateAction<boolean>>
  }) {
  const [ships, setShips] = useState<IShipyard | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    logInDev(waypoint);
    (async () => {
      const ships = await fetchShipyard(system, waypoint?.symbol || "");
      logInDev(ships);
      setShips(ships);
      setIsLoading(false);
    })();
  }, [waypoint]);

  async function handlePurchase(type: string) {
    const purchase = await purchaseShip(type, ships!.symbol);
    if (purchase) {
      setShow(false);
      setRefresh(x => !x);
    }
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
