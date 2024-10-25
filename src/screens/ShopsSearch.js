import React, { useEffect, useReducer } from 'react'
import { Helmet } from 'react-helmet-async'
import { getError } from '../utils';
import { useLocation } from 'react-router-dom';
import Container from 'react-bootstrap/esm/Container';
import axios from 'axios';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import StoreCard from '../components/StoreCard';

const reducer = (state, action)=>{
    switch(action.type){
        case 'FETCH_SHOPS':
            return {...state, loading: true};
        case 'FETCH_SUCCESS':
            return {...state, data: action.payload, loading: false};
        case 'FETCH_FAILED':
            return {...state, loading: false, error: action.payload};
        default:
            return state
    }
}

const ShopsSearch = () => {

    //const [subcategory, setSubCategory] = useState('')
    const {search} = useLocation()
    const sp = new URLSearchParams(search)
    const category = sp.get('category') 


    const [{loading, error, data}, dispatch] = useReducer(reducer, {
        loading: true,
        data: null,
        error: ''
    }) 

    

    useEffect(()=> {
        const fetchData = async()=>{
            try{
            dispatch({type: 'FETCH_SHOPS'})
            const res = await axios.get(`https://api.ugyard.com/api/shops/q?category=${encodeURIComponent(category)}`)
            dispatch({type: 'FETCH_SUCCESS', payload: res.data})
            }catch(error){
                dispatch({type: "FETCH_FAILED", payload: getError(error)})
            }
        }
        fetchData()
    },[category])
  return loading ? (<LoadingBox/>) : error ?( <MessageBox>{error}</MessageBox>):
  (
    <Container>
        <Helmet>UGYARD-Shops-{category}</Helmet>
        <Row>
            {data.length > 0 ? data.map((shop)=> (
                <Col xs={12} md={4}>
                    <StoreCard shop={shop}/>
                </Col>
            )):(
                <MessageBox variant="warning" >NO {category.toLocaleUpperCase()} STORES YET</MessageBox>
            )}
        </Row>
      
    </Container>
  )
}

export default ShopsSearch
