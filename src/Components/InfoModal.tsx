
import buyItems from '@/API/buyItems';
import fetchMarket from '@/API/fetchMarket';
import fetchShipyard from '@/API/fetchShipyard';
import purchaseShip from '@/API/purchaseShip';
import sellItems from '@/API/sellItems';
import { handleError } from '@/Pages/Ships';
import { IMarket, IModalSystem, IShipyard, ITradeGood } from '@/Types/types';
import formatString from '@/utils/formatString';
import { logInDev } from '@/utils/logInDev';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Accordion, Button, Form, InputGroup, ListGroup, Spinner } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import toast from 'react-hot-toast';

enum TransactionType {
  BUY = "BUY",
  SELL = "SELL"
}

export default function InfoModal({ system, show, setShow, setRefresh }:
  {
    system: IModalSystem,
    show: boolean,
    setShow: Dispatch<SetStateAction<boolean>>,
    setRefresh: Dispatch<SetStateAction<boolean>>,
  }) {

  const [ships, setShips] = useState<IShipyard | null>(null);
  const [market, setMarket] = useState<IMarket>({} as IMarket);
  const [itemsToSell, setItemsToSell] = useState<{ [key: string]: { current: number, max: number, costPer?: number } }>({});
  const [itemsToBuy, setItemsToBuy] = useState<{ [key: string]: { current: number, max: number, costPer: number } }>({});

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {

      switch (system.type) {
        case ("SHIPYARD"):
          const shipyardResult = await fetchShipyard(system.waypoint);
          logInDev(shipyardResult);
          setShips(shipyardResult);
          setIsLoading(false);
          break;
        case ("MARKETPLACE"):
          const marketResult = await fetchMarket(system.waypoint);
          logInDev(marketResult);
          setMarket(marketResult);
          break;
        default:
          break;
      }
    })();
  }, [system]);

  useEffect(() => {

    const items: { [key: string]: { current: number, max: number, costPer: number } } = {};
    if (market?.tradeGoods) {
      market.tradeGoods.map((item: any) => {
        items[item.symbol] = { current: 0, max: item.tradeVolume, costPer: item.purchasePrice };
      })
    }
    setItemsToBuy(items);
    logInDev(items);
    setIsLoading(false);

  }, [market]);

  useEffect(() => {
    const items: { [key: string]: { current: number, max: number } } = {};

    logInDev("Market tradegoods:");
    logInDev(market.tradeGoods);

    if (system.cargo) {
      system.cargo.inventory.map((item) => {
        if (market.tradeGoods && market.tradeGoods.some((x: ITradeGood) => x.symbol === item.symbol)) {
          items[item.symbol] = { current: 0, max: item.units };
        }
      })
    }

    setItemsToSell(items);

  }, [system.cargo, market]);

  async function handlePurchase(type: string) {
    const purchase = await purchaseShip(type, ships!.symbol);
    if (purchase) {
      setShow(false);
      toast.success("Ship purchased");
      setRefresh(x => !x);
      setShow(false);
    } else {
      handleError(500);
    }
  }

  if (isLoading) return <Spinner animation="border" variant="primary" />

  async function handleTransaction(e: React.FormEvent, type: TransactionType) {
    e.preventDefault();
    logInDev("Transaction type: " + type);

    let result;
    switch (type) {
      case TransactionType.SELL:
        result = await sellItems(system.shipSymbol, itemsToSell);
        logInDev("Result of selling items:");
        logInDev(result);
        if (result.code === 201) {
          toast.success("Items sold");
          setRefresh(x => !x);

          setShow(false);
        } else {
          handleError(result.code);
        }
        break;
      case TransactionType.BUY:
        result = await buyItems(system.shipSymbol, itemsToBuy);
        logInDev("Result of buying items:");
        logInDev(result);
        if (result.code === 201) {
          toast.success("Items bought");
          setShow(false);
          setRefresh(x => !x);

        } else {
          handleError(result.code);
        }
        break;
      default:
        break
    }
  }

  return (
    <>
      {system && system.type &&

        <Modal backdrop="static" show={show} onHide={() => setShow(false)}>
          <Modal.Header closeButton>
            <Modal.Title>{system.waypoint} {formatString(system.type)}</Modal.Title>
          </Modal.Header>

          {system.type === "SHIPYARD" &&
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
          }

          {system.type === "MARKETPLACE" &&
            <>
              <Accordion>

                <Accordion.Item eventKey="sell">
                  <Accordion.Header>Sell</Accordion.Header>
                  <Accordion.Body className="accordion-market-items">

                    <Form>
                      {Object.entries(itemsToSell).map(([key, value]) => {
                        return (
                          <InputGroup className="mb-2" key={key}>
                            <Form.Control aria-label={key} value={`${formatString(key)} - ${value.max} `} disabled />
                            <Form.Control
                              type="number"
                              min={0}
                              max={value.max}
                              value={value.current}
                              onChange={(e) => {
                                const newValue = Number(e.target.value);
                                setItemsToSell(prev => ({
                                  ...prev,
                                  [key]: { ...prev[key], current: newValue }
                                }))
                              }}
                              onBlur={(e) => {
                                const newValue = Math.min(Math.max(Number(e.target.value), 0), value.max);
                                setItemsToSell(prev => ({
                                  ...prev,
                                  [key]: { ...prev[key], current: newValue }
                                }))
                              }}
                            />
                          </InputGroup>
                        )
                      })}
                      {(Object.keys(itemsToSell).length) ? <Button type="submit" onClick={(e) => handleTransaction(e, TransactionType.SELL)}>Sell</Button> : ""}
                    </Form>

                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="buy">
                  <Accordion.Header>Buy</Accordion.Header>
                  <Accordion.Body>
                    <Form>
                      {Object.entries(itemsToBuy).map(([key, value]) => {
                        return (
                          <InputGroup className="mb-2" key={key}>
                            <Form.Control aria-label={key} value={formatString(key)} disabled />
                            <Form.Control
                              type="number"
                              min={0}
                              max={value.max}
                              value={value.current}
                              onChange={(e) => {
                                const newValue = Number(e.target.value);
                                setItemsToBuy(prev => ({
                                  ...prev,
                                  [key]: { ...prev[key], current: newValue }
                                }))
                              }}
                              onBlur={(e) => {
                                const newValue = Math.min(Math.max(Number(e.target.value), 0), value.max);
                                setItemsToBuy(prev => ({
                                  ...prev,
                                  [key]: { ...prev[key], current: newValue }
                                }))
                              }}
                            />
                          </InputGroup>
                        )
                      })}
                      <Button type="submit" disabled={!(Object.values(itemsToBuy).some((x: { current: number, max: number, costPer: number }) => x.current > 0))} onClick={(e) => handleTransaction(e, TransactionType.BUY)}>Buy</Button>
                    </Form>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </>
          }

          <Modal.Footer>
          </Modal.Footer>
        </Modal >
      }
    </>
  );
}
