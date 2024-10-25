import React from 'react'
import Col from 'react-bootstrap/esm/Col'
import Row from 'react-bootstrap/esm/Row'
import { Link } from 'react-router-dom'

const ShopsBar = () => {
    const data = [
        {category: 'SuperMarkets', image: "/images/shop-categories/supermarkets-uganda.png"},
        {category: 'Baby', image: "/images/shop-categories/babycare-and-toys-stores.png"},
        {category: 'Water And Beverage', image: "/images/shop-categories/water-and-beverage-stores.png"},
        {category: 'Bakery', image: "/images/shop-categories/bakery-and-cake-stores.jpeg"},
        {category: 'Butchery and Seafood', image: "/images/shop-categories/butchery-and-seafood.png"},
        {category: 'Electronics', image: "/images/shop-categories/electronics-stores.png"},
        {category: 'Fitness and Nutrition', image: "/images/shop-categories/fitness-and-nutrition-stores.png"},
        {category: 'Flowers and Gifts', image: "/images/shop-categories/flower-and-gift-shops.jpeg"},
        {category: 'Fruits and Vegetables', image: "/images/shop-categories/fruits-and-vegetables-stores.png"},
        {category: 'Home And Kitchen', image: "/images/shop-categories/home-and-kitchen-stores.png"},
        {category: 'Organic Shops', image: "/images/shop-categories/organic-shops-stores.png"},
        {category: 'Perfumes and Scents', image: "/images/shop-categories/perfume-and-scent-stores.jpeg"},
        {category: 'Pets Supplies', image: "/images/shop-categories/pets-and-petfood-stores.png"},
        {category: 'Pharmacies', image: "/images/shop-categories/pharmacies-off-the-counter-meds.png"},
        {category: 'Ugandan Food', image: "/images/shop-categories/resturants-and-fastfood-stores.png"},
        {category: 'Grocery', image: "/images/shop-categories/spicies-and-ingridient-stores.png"},
        {category: 'Staionery And Party Supplies', image: "/images/shop-categories/stationery-and-party-supplies-stores.png"},
        {category: 'Butchery and Seafood', image: "/images/shop-categories/butchery-and-seafood.png"},

    ]
  return (
    <Row className='mb-2'>
    <h1 className='text-muted m-md-3'>LARGEST ONLINE MARKET IN UGANDA</h1>
      {data.map((item, index)=> (
        <Col key={index} xs={4} lg={2} className='d-flex flex-column align-items-center justify-content-center p-1 border'>
        <h6 className='text-center text-bold'>{item.category}</h6>
        <Link to={{
            pathname:'/shops',
            search: `?category=${encodeURIComponent(item.category)}`
        }}>
        <img
          src={item.image}
          className='img-fluid img-thumbnail rounded-circle'
          alt={item.category}
          style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'scale-down' }}
        />
        </Link>
      </Col>
      ))}
    </Row>
  )
}

export default ShopsBar
