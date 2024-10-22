import Form from 'react-bootstrap/esm/Form';
import ListGroup from 'react-bootstrap/esm/ListGroup';
import InputGroup from 'react-bootstrap/esm/InputGroup';
import { useEffect, useState } from 'react';
import Alert from 'react-bootstrap/esm/Alert';
import DeliveryDate from '../components/DeliveryDate';
import Col from 'react-bootstrap/esm/Col';
import Row from 'react-bootstrap/esm/Row';

export default function Timeslots() {

  const [selectedTimeslot, setSelectedTimeslot] = useState({
    name: '',
    time: '', // Initialize as an empty string
    fee: 0
  });
  const slots = [
    { name: 'Morning', time: '', fee: 20000 },
    { name: 'Standard', time: '', fee: 24000 },
    { name: 'Evening', time: '', fee: 30000 },
    { name: 'Night', time: '', fee: 40000 }
  ];

  useEffect(() => {
    const savedTimeslot = JSON.parse(localStorage.getItem('timeSlot'));
    if (savedTimeslot) {
      setSelectedTimeslot(savedTimeslot);
    }
  }, []);

  const handleSlotChange = (slotName, slotTime, slotFee) => {
    const newSelectedSlot = {
      name: slotName,
      time: slotTime, // Preserve the selected time
      fee: slotFee
    };
    setSelectedTimeslot(newSelectedSlot);
    localStorage.setItem('timeSlot', JSON.stringify(newSelectedSlot));
  };

  return (
    <Row>
      <Col>
        <Alert variant='dark'>Delivery Date</Alert>
        <DeliveryDate />
      </Col>

      <div className='my-2'>
        <Alert variant="dark">Delivery Time</Alert>
        <ListGroup>
          {slots.map((slot) => (
            <ListGroup.Item key={slot.name} className='d-flex'>
              <Form.Check
                type='radio'
                className='p-2'
                value={slot.name}
                id={slot.name}
                checked={selectedTimeslot.name === slot.name}
                onChange={() => handleSlotChange(slot.name, selectedTimeslot.time, slot.fee )}
              />
              <InputGroup>
                <InputGroup.Text>{slot.name}</InputGroup.Text>
                <Form.Control
                  type='text'
                  placeholder='specify time'
                  value={selectedTimeslot.name === slot.name ? selectedTimeslot.time : ''}
                  onChange={(e) => handleSlotChange(slot.name, String(e.target.value), slot.fee)}
                  disabled={selectedTimeslot.name !== slot.name}
                />
                <InputGroup.Text>{slot.fee.toLocaleString()}: UGX</InputGroup.Text>
              </InputGroup>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>
    </Row>
  );
}
