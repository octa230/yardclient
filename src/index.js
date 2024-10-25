import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google'
import { HelmetProvider } from 'react-helmet-async';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { StoreProvider } from './Store';
import LoadingBox from './components/LoadingBox';



const root = createRoot(document.getElementById('root'));

const Main = () => {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const getCategories = async () => {
      const storedCategories = localStorage.getItem('yardCategories');

      if (storedCategories) {
        setCategories(JSON.parse(storedCategories));
        setLoading(false);
      } else {
        try {
          const { data } = await axios.get('/api/category');
          localStorage.setItem('yardCategories', JSON.stringify(data));
          setCategories(data);
        } catch (error) {
          console.error('Error fetching categories:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    getCategories();
  }, []);

  if (loading) {
    return <LoadingBox/>; // You can customize this loading state
  }

  return (
    <StoreProvider>
      <HelmetProvider>
        <GoogleOAuthProvider clientId="298088274300-bgakunqf5tgofo393k5clg179hd7uj3l.apps.googleusercontent.com">
          <App categories={categories} />
        </GoogleOAuthProvider>
      </HelmetProvider>
    </StoreProvider>
  );
};

root.render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
);

// Performance measuring
reportWebVitals();
