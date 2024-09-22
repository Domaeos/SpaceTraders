import Placeholder from 'react-bootstrap/Placeholder';
import { memo, useMemo } from 'react';
import { Card } from 'react-bootstrap';

interface WaypointPlaceholderProps {
  amount: number;
}

const WaypointPlaceholder: React.FC<WaypointPlaceholderProps> = ({ amount }) => {
  const placeholders = useMemo(() => {
    return new Array(amount).fill(null);
  }, [amount]);

  return (
    <>
      {placeholders.map((_, i) => (
        <Card key={i}>
          <Card.Body>
            <Placeholder as={Card.Title} animation="wave">
              <Placeholder xs={6} />
            </Placeholder>
            <Placeholder as={Card.Text} animation="wave">
              <Placeholder xs={7} /> <Placeholder xs={4} /> <Placeholder xs={4} />{' '}
              <Placeholder xs={6} /> <Placeholder xs={8} />
            </Placeholder>
            <Placeholder as={Card.Text} animation="glow">
              <Placeholder.Button variant="primary" xs={2} />
            </Placeholder>
            <Placeholder as={Card.Footer} animation='wave'>
              <Placeholder xs={2} className="w-20" bg="dark" />{' '}
              <Placeholder xs={2} className="w-20" bg="dark" />{' '}
              <Placeholder xs={2} className="w-20" bg="dark" />{' '}
              <Placeholder xs={2} className="w-20" bg="dark" />
            </Placeholder>
          </Card.Body>
        </Card>
      ))};
    </>
  );
};

export default memo(WaypointPlaceholder);