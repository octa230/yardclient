import React, { useContext } from 'react'
import Card from 'react-bootstrap/esm/Card'
import { useNavigate } from 'react-router-dom'
import { Store } from '../Store'
import { toast } from 'react-toastify'

export default function StoreCard(props) {
const navigate = useNavigate()

const {state} = useContext(Store)
const {userInfo} = state

const routingFunc =(url)=> {
    if(!userInfo){
        navigate('/signin')
        toast.warning('Login To View')
    }else{
        navigate(url)
    }
}
const {shop} = props
  return (
    <Card onClick={()=> routingFunc(`/shop/${shop.slug}`)} className='store-card my-1'>
      <div className=' p-1 d-flex justify-content-between align-items-center'>
      <img src={shop.logo} className='img-thumbnail rounded-circle' alt={`${shop.name}-logo`}   
        style={{ width: '50px', height: '50px' }}/>
      
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
