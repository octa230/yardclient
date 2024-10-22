import React, { useState, useReducer } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import ListGroup from 'react-bootstrap/ListGroup';
import { toast } from 'react-toastify';
import FormControl from 'react-bootstrap/FormControl';
import axios from 'axios';
import { getError } from '../utils.js';
import { useNavigate } from 'react-router-dom';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, queryResults: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

export default function SearchBox() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);

  const [{ queryResults}, dispatch] = useReducer(reducer, {
    loading: false,
    error: '',
    queryResults: [],
  });

  const handleSearch = async (setValue) => {
    setQuery(setValue);
    setShowResults(true);
  
    // Only start fetching results after at least 4 characters
    if (setValue.length < 4) {
      dispatch({ type: 'FETCH_SUCCESS', payload: [] }); // Clear results if input is less than 4 characters
      return;
    }
  
    dispatch({ type: 'FETCH_REQUEST' });
  
    try {
      const params = {
        name: setValue,
        category: setValue,
        brand: setValue
      };
  
      const { data } = await axios.get('https://api.ugyard.com/api/products/searchbar', { params });
      dispatch({ type: 'FETCH_SUCCESS', payload: data });
    } catch (error) {
      dispatch({ type: 'FETCH_FAIL', payload: error });
      toast.error(getError(error));
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    navigate(query ? `/search?searchQuery=${encodeURIComponent(query)}` : '/search');
    setQuery('');
    setShowResults(false);
  };

  const filteredItems = queryResults?.filter((x) =>
    x.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className='search-box-container'>
      <Form className='d-flex px-1' onSubmit={submitHandler}>
        <InputGroup>
          <FormControl className='searchInput'
            type='text'
            name='q'
            id='q'
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder='Search products...'
            aria-label='Search Products'
            aria-describedby='button-search'
          />
          <Button variant='light' id='button-search' 
            onClick={()=> setQuery('')}
            >
          <i className="fa fa-times-circle"></i>
          </Button>
          <Button variant='success' type='submit' id='button-search'>
            <i className='fas fa-search'></i>
          </Button>
        </InputGroup>
      </Form> 
      {showResults && query.length >= 4 && (
        <ListGroup className='search-results-list'>
          {filteredItems.map((item) => (
            <ListGroup.Item
              key={item._id}
              onClick={() => {
                navigate(`/search?searchQuery=${encodeURIComponent(item.name)}`);
                setShowResults(false);
              }}
            >
              {item.name}
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </div>
  );
}
