import React from 'react';
import Card from 'react-bootstrap/esm/Card';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import { useNavigate } from 'react-router-dom'

export const OfferTemplateone = (props) => {
  const { offer } = props;
  const navigate = useNavigate()
  switch (offer.type) {
    case 'a':
      return (
        <div className="mt-2 p-2">
          <h1>{offer.title.toUpperCase()}</h1>
        <div className='horizontal-scroll'>
            {offer.listings?.map((listing, index) => (
              <div key={index} className="horizontal-item img">
                <Card.Img src={listing.Photo} alt={listing.category.name}
                  onClick={()=> navigate(`/search?subcategory=${encodeURIComponent(listing.subcategory)}`)} 
                />
                <Card.Text className='text-center'>{listing.percentage}</Card.Text>
              </div>
            ))}
            </div>
        </div>
      );

    case 'b':
      return (
      <Row className='p-1'>
        <h1>{offer.title.toUpperCase()}</h1>
        {offer.listings?.map((listing, index) => (
          <Col key={index} className='p-1 d-flex flex-column justify-content-between' xs={6} md={3}>
              <Card.Img className='img-rounded h-100% object-fit-contain'
                src={listing.Photo}
                
                alt={listing.category.name}
                onClick={() => navigate(`/search?subcategory=${encodeURIComponent(listing.subcategory)}`)}
              />
            <Card.Text style={{fontWeight: "800", marginTop: 'auto'}}>
              <h5>{listing.percentage}</h5>
            </Card.Text>
          </Col>
        ))}
      </Row>
      );
    default:
      return (
        <Row className="my-1">
          {offer.listings?.map((listing, index) => (
            <Card.Img src={listing.Photo} alt={listing.category} key={index}/>
          ))}
        </Row>
      );
  }
};
