import React, { useContext, useState } from 'react'
import ListGroup from 'react-bootstrap/esm/ListGroup'
import Alert from 'react-bootstrap/esm/Alert'
import Form from 'react-bootstrap/esm/Form'
import Button from 'react-bootstrap/esm/Button'
import Card from 'react-bootstrap/esm/Card'
import Col from 'react-bootstrap/esm/Col'
import Row from 'react-bootstrap/esm/Row'
import { formatDate, round2 } from '../utils'
import { toast } from 'react-toastify'
import { Store } from '../Store'

const Trip = (props) => {
    const {trip} = props
    const [ weight, setWeight ] = useState(0)

    const {dispatch} = useContext(Store)

    const handleBooking = async(trip)=>{
        if(!trip.availableWeight > weight){
            return toast.error('REDUCE YOUR BOOKING WEIGHT')
        }else{
            trip['bookedWeight'] = weight
            trip['tripBill'] = round2 (weight * trip.weightPrice) 
            dispatch({type: "SET_USER_TRIP", payload: trip})
            localStorage.setItem('trip', JSON.stringify(trip))
        }

    }
  return (
    <Card key={trip._id} className='p-3 w-full'>
      <Card.Title>
        <Alert variant={trip.approved ? 'success' : "danger"}>{trip.approved ? 'APPROVED' : "NOT APPROVED"}</Alert>
      </Card.Title>
      <Card.Body> 
            <ListGroup.Item>
                <h5>Weight: {trip.availableWeight}(KGS)</h5>
                <h5>kg: {trip.weightPrice.toLocaleString()}@(KG)</h5>
            </ListGroup.Item>
            <Row>
                <Col>TO DXB:<br/>{formatDate(trip.arrivalDate)}</Col>
                <Col>TO K'LA:<br/>{formatDate(trip.departureDate)}</Col>
            </Row>
        <Form.Group>
            <Form.Control type='number'
                placeholder='add weight to book'
                value={weight}
                onChange={(e)=> setWeight(e.target.value)}
            />
        </Form.Group>
      </Card.Body>
      <Button disabled={!weight} onClick={()=>handleBooking(trip)}>BOOK</Button>
    </Card>
  )
}

export default Trip
