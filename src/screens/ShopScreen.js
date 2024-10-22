import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import Row from 'react-bootstrap/esm/Row';
import Container from 'react-bootstrap/esm/Container';
import Col from 'react-bootstrap/esm/Col';
import { Store } from '../Store';
import LoadingBox from '../components/LoadingBox';
import Product from '../components/Product';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_SHOP':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, shop: action.payload };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload }; // Added error payload
    case 'FETCH_SHOP_PRODUCTS':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS_PRODUCTS':
      return { ...state, loading: false, products: action.payload };
    case 'FETCH_FAIL_PRODUCTS':
      return { ...state, loading: false, error: action.payload }; // Added error payload
    default:
      return state;
  }
};

export default function ShopScreen() {
  const { state } = useContext(Store);
  const { userInfo } = state;

  const { slug } = useParams();
  const navigate = useNavigate()
  const location = useLocation();

  const [{ loading, shop, products, error }, dispatch] = useReducer(
    reducer,
    {
      loading: true,
      products: [],
      shop: {},
      error: '',
    }
  );

  useEffect(() => {
    const fetchData = async () => {
      if(!userInfo){
        navigate('/signin');
      }else{
        try {
          dispatch({ type: 'FETCH_SHOP' });
          const { data } = await axios.get(`/api/shops/seller/${slug}`, {
            headers: { authorization: `Bearer ${userInfo.token}` },
          });
          dispatch({ type: 'FETCH_SUCCESS', payload: data });
          console.log(data)
          // Use the fetched shopId here to get products
          if (data?._id) {
            dispatch({ type: 'FETCH_SHOP_PRODUCTS' });
            const results = await axios.get(`/api/shops/${data._id}/products`);
            dispatch({ type: 'FETCH_SUCCESS_PRODUCTS', payload: results.data });
          }
        } catch (error) {
          dispatch({ type: 'FETCH_FAIL', payload: getError(error) });
        }
      }
    };
    fetchData();
  }, [slug, userInfo, location.pathname]);

  if (loading) return <LoadingBox />;

  if (error) return <div>Error: {error}</div>;

  return (
    <Container fluid>
      <Helmet>
        <title>{shop.name}</title>
      </Helmet>
      <div>
        <div className='d-flex justify-content-between align-items-center'>
          <div className='d-flex align-items-center'>
            <img
              src={shop.logo}
              alt={`logo ${shop.name}`}
              className='img-thumbnail rounded-circle m-1'
            />
            <h5 className='p-2'>{shop.name.toUpperCase()}</h5>
          </div>
          <small className='py-2 text-muted'>{shop.industry.toUpperCase()}</small>
          <div>
            <i
              className='fas fa-share align-self-end p-2'
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
        </div>
        <Row className='justify-content-center'>
          {products.length > 0 ? (
            products.map((product) => (
              <Col key={product._id} xs={12} md={2} className='my-1 px-2'>
                <Product product={product} />
              </Col>
            ))
          ) : (
            <Col className='text-center'>No products found.</Col>
          )}
        </Row>
      </div>
    </Container>
  );
}
