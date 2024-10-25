import { useContext, useEffect, useReducer} from "react";
import axios from "axios";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/esm/Card";
import { Helmet } from "react-helmet-async";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import StoreCard from "../components/StoreCard";
import { OfferTemplateone } from "../components/Offers";
import { Link } from "react-router-dom";
import { Store } from "../Store";
import ShopsBar from "../components/ShopsBar";


const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, featuredProducts: action.payload, loading: false };
    case "SIGN_IN":
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "OFFERS_FETCH_REQUEST":
        return { ...state, loading: true };
    case "OFFERS_FETCH_SUCCESS":
        return { ...state, offers: action.payload, loading: false };
    case "OFFERS_FETCH_FAIL":
        return { ...state, loading: false, error: action.payload };
    case "SHOPS_FETCH_REQUEST":
        return { ...state, loading: true };
    case "SHOPS_FETCH_SUCCESS":
        return { ...state, shops: action.payload, loading: false };
    case "SHOPS_FETCH_FAIL":
        return { ...state, loading: false, error: action.payload };
    case "FETCH_CATEGORIES":
        return { ...state, loading: true };
    case "CATEGORIES_SUCCESS":
        return { ...state, categories: action.payload, loading: false };
    case "CATEGORIES_FAIL":
        return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function HomeScreen() {

  const [{ loading, error, offers, featuredProducts, shops}, dispatch] = useReducer(reducer, {
    categories:[],
    featuredProducts:[],
    shops:[],
    offers:[],
    loading: true,
    error: "",
  });


  const {state} = useContext(Store)
  const {userInfo} = state

  
  // const [products, setProducts] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const result = await axios.get('https://api.ugyard.com/api/products/featured')
        dispatch({ type: "FETCH_SUCCESS", payload: result.data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: err.message });
      }
      ///FETCH_SHOPS
      dispatch({type: 'SHOPS_FETCH_REQUEST'})
      try{
        const {data} = await axios.get('https://api.ugyard.com/api/shops')
        dispatch({type: 'SHOPS_FETCH_SUCCESS', payload: data})
      }catch(error){
        dispatch({type: 'SHOPS_FETCH_FAIL', payload: error.message})
      }

      ///FETCH_OFFERS
      dispatch({type: 'OFFERS_FETCH_REQUEST'})
      try{
        const {data} = await axios.get('https://api.ugyard.com/api/offers')
        dispatch({type: 'OFFERS_FETCH_SUCCESS', payload: data})
      }catch(error){
        dispatch({type: 'OFFERS_FETCH_FAIL', payload: error.message})
      }

      // setProducts(result.data);
    };
    fetchData();
  }, [userInfo]);



  return (
    <div>
      <Helmet>
        <title>
          UG YARD | BUY | SELL 0NLINE-UGANDA
        </title>
      </Helmet>
      <ShopsBar/>
      <h1 className="p-2">OUR TOP PICKS</h1>
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <div className="featured">
            {Array.isArray(featuredProducts) && featuredProducts.map((product) => (
              <Col key={product.slug} className="p-1 m-1 border"xs={4} md={4} lg={3} style={{width: "300px"}}>
                <Link to={`/product/${product.slug}`}>
                <Card.Img src={product.image} alt={product.name} 
                  style={{maxHeight: "200px", height: "200px", objectFit:"scale-down"}}/>
                </Link>
              </Col>
            ))}
          </div>
        )}

    {loading ? (
      <LoadingBox />
    ) : error ? (
      <MessageBox variant='danger'>{error}</MessageBox>
    ) : ( Array.isArray(offers) && offers.map((offer)=>(
          <OfferTemplateone key={offer._id} offer={offer}/>
        ))
    )}
  
      <h1 className="mt-2">Featured Stores</h1>    
      {loading ? (
        <LoadingBox/>
      ): error ? (
        <MessageBox>No Stores</MessageBox>
      ): (
        <Row className="justify-content-center">
          {Array.isArray(shops) && shops.map((shop)=> (
            <Col xs={12} md={3}key={shop._id}>
            <StoreCard shop={shop}/>
            </Col>
          ))}
        </Row>
      )}  
    </div>
  );
}
export default HomeScreen;
