import { useContext, useEffect, useState } from 'react';
import Badge from 'react-bootstrap/Badge';
import ListGroup from 'react-bootstrap/ListGroup';
import { IUser } from '../Types/types';
import { getUsersFromStorage } from '@/utils/getUsersFromStorage';
import { UserContext } from '@/Contexts/UserContext';
import { logInDev } from '@/utils/logInDev';
import axiosClient from '@/API/client';
import NewGame from './NewGame';
import setCurrentUserInStorage from '../utils/setCurrentUserInStorage';

export function ListAgents() {
  const [users, setUsers] = useState<IUser[]>([]);
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    setUsers(getUsersFromStorage());
  }, [user]);

  function handleChangeUser(userToSwapTo: IUser) {
    logInDev("Changing to:");
    logInDev(userToSwapTo);
    logInDev("Token: " + userToSwapTo.token);
    setUser(userToSwapTo);
    setCurrentUserInStorage(userToSwapTo);

    axiosClient.defaults.headers.common['Authorization'] = `Bearer ${userToSwapTo.token}`;
    logInDev(axiosClient.defaults.headers.common['Authorization']);

  }

  if (users.length === 0) return <></>;

  return (
    <>
      <ListGroup className='agent-list' as="ul">
        {users.map(agent => (

          <ListGroup.Item
            as="li"
            action
            className="d-flex justify-content-between align-items-start"
            disabled={user && agent.token === user.token || false}
            onClick={() => handleChangeUser(agent)}
            key={agent.accountId}
          >

            <div className="ms-2 me-auto">
              <div className="fw-bold">{agent.symbol}</div>
              {agent.factionName}
            </div>

            {user && agent.token === user.token &&
              <Badge bg="success" pill>
                Current
              </Badge>
            }
          </ListGroup.Item>
        ))}
      </ListGroup>
      <NewGame />
    </>
  )
}