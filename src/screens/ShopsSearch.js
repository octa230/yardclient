import React, { useEffect, useReducer } from 'react'
import { Helmet } from 'react-helmet-async'
import { getError } from '../utils';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import StoreCard from '../components/StoreCard';

const reducer = (state, action)=>{
    switch(action.type){
        case 'FETCH_SHOPS':
            return {...state, loading: true};
        case 'FETCH_SUCCESS':
            return {...state, shops: action.payload, loading: false};
        case 'FETCH_FAILED':
            return {...state, loading: false, error: action.payload};
        default:
            return state
    }
}

const ShopsSearch = () => {
    const { search } = useLocation();
    const sp = new URLSearchParams(search);
    const category = sp.get('category');

    const [{ loading, error, shops }, dispatch] = useReducer(reducer, {
        loading: true,
        shops: [],  // Initialize as empty array
        error: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                dispatch({ type: 'FETCH_SHOPS' });
                const res = await axios.get(`https://api.ugyard.com/api/shops/q?category=${encodeURIComponent(category)}`);
                //console.log(res.data);
                dispatch({ type: 'FETCH_SUCCESS', payload: res.data });
            } catch (error) {
                dispatch({ type: 'FETCH_FAILED', payload: getError(error) });
            }
        };
        fetchData();
    }, [category]);

    return loading ? (
        <LoadingBox />
    ) : error ? (
        <MessageBox>{error}</MessageBox>
    ) : (
        <div>
            <Helmet>
                <title>UGYARD - Shops - {category}</title>
            </Helmet>
            <div className="d-grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 2fr))' }}>
                {shops.length > 0 ? (
                    shops.map((shop) => (
                        <div key={shop._id}>
                            <StoreCard shop={shop} />
                        </div>
                    ))
                ) : (
                    <MessageBox variant="warning">NO {category.toLocaleUpperCase()} STORES YET</MessageBox>
                )}
            </div>
        </div>
    );
};

export default ShopsSearch
