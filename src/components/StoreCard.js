import React from 'react'
import Card from 'react-bootstrap/esm/Card'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

export default function StoreCard(props) {
const navigate = useNavigate()
const {shop} = props


  return shop.slug && (
    <Card className='store-card p-2 m-1' key={shop._id} onClick={()=> navigate(`/shop/${shop.slug}`)}>
      <div className=' p-1 d-flex justify-content-between align-items-center'>
      <img src={shop.logo} className='img-thumbnail rounded-circle' alt={`${shop.name}-logo`}   
        style={{ width: '50px', height: '50px', objectFit:"scale-down"}}/>
      
      <Card.Text>{shop.name.toUpperCase()}</Card.Text>

      <i
        className='fas fa-share align-self-end p-1'
          onClick={(e) => {
            e.stopPropagation();
                  const shopUrl = `https://ugyard.com/shop/${shop.slug}`
                  const textContent = `
                  Check out ${shop.name} Store: 
                  ${shopUrl}`
                
                navigator.clipboard.writeText(textContent).then(()=>{
                  toast.success('Copied');
                });
            }}
          />
      </div>
      <Card.Text className='p-1 text-muted'>{shop.industry} - {shop.country}</Card.Text>
    </Card>
  )
}
