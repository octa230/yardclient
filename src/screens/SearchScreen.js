// SearchScreen.js
import React, { useEffect, useReducer } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { getError } from '../utils';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Product from '../components/Product';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      console.log(action.payload.products)
      return { ...state, products: action.payload.products, 
        countProducts: action.payload.countProducts, loading: false 
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function SearchScreen() {
  const navigate = useNavigate();
  const { search } = useLocation();


  const sp = new URLSearchParams(search);
  const categoryName = sp.get('categoryName') || '';
  const subcategory = sp.get('subcategory') || '';
  const searchQuery = sp.get('searchQuery') || '';
  const price = sp.get('price') || '';
  const rating = sp.get('rating') || '';
  const order = sp.get('order') || '';

  const [{ loading, error, products, countProducts }, dispatch] = useReducer(reducer, {
    loading: true,
    products:[],
    error: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const { data } = await axios.get(
          `https://api.ugyard.com/api/products/q?searchQuery=${searchQuery}&categoryName=${categoryName}&subcategory=${subcategory}&price=${price}&rating=${rating}&order=${order}`
        );
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (error) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(error) });
      }
    };
    fetchData();
  }, [categoryName, subcategory, searchQuery, price, rating, order]);

  const getFilterUrl = (filter, skipPathname = false) => {
    const filterCategory = filter.categoryName || categoryName;
    const filterSubcategory = filter.subcategory || subcategory;
    const filterQuery = filter.searchQuery || searchQuery;
    const filterPrice = filter.price || price;
    const filterRating = filter.rating || rating;
    const sortOrder = filter.order || order;

    const searchParams = new URLSearchParams();
    searchParams.append('categoryName', filterCategory);
    searchParams.append('subcategory', filterSubcategory);
    searchParams.append('searchQuery', filterQuery);
    searchParams.append('price', filterPrice);
    searchParams.append('rating', filterRating);
    searchParams.append('order', sortOrder);

    return `${skipPathname ? '' : '/search?'}${searchParams.toString()}`;
  };

  return (
    <div>
      <Helmet>
        <title>Search Products</title>
      </Helmet>
        {loading ? (
          <LoadingBox></LoadingBox>
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <>
            <Row className="justify-content-between p-0">
              <Col md={4} xs={12}>
                <div>
                  {countProducts === 0 ? 'No' : products.length}: Results
                  {searchQuery !== '' && ' : ' + searchQuery}
                </div>
              </Col>
              <Col className="text-end p-1">
                Sort by{' '}
                <select
                  value={order}
                  onChange={(e) => {
                    navigate(getFilterUrl({ order: e.target.value }));
                  }}
                >
                  <option value="newest">Newest Arrivals</option>
                  <option value="lowest">Price: Low to High</option>
                  <option value="highest">Price: High to Low</option>
                  <option value="toprated">Avg. Customer Reviews</option>
                </select>
              </Col>
            </Row>
            {products.length === 0 && (
              <MessageBox>No Product Found</MessageBox>
            )}
            <Row className='justify-content-center'>
              {products.map((product) => (
                <Col xs={12} md={2} className="my-1 px-2" key={product._id}>
                  <Product product={product.product}></Product>
                </Col>
              ))}
            </Row>
          </>
        )}
    </div>
  );
}
