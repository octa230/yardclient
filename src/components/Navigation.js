// Navigation.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';


const Navigation=(props)=> {
  const [activeCategory, setActiveCategory] = useState(null);
  const { categories } = props;
  //const { categories } = state;
  


  

  const handleCategoryClick = (categoryName) => {
    setActiveCategory(categoryName === activeCategory ? null : categoryName);
  };

  return ( 
    <div className='navigation-container'>
      <div className='categories-scroll'>
        <div className='categories-container'>
          {Array.isArray(categories) && categories.map((category) => (
            <div
              key={category.name}
              className={`category-tab ${category.name === activeCategory ? 'active' : ''}`}
              onClick={() => handleCategoryClick(category.name)}
            >
              {category.name}
            </div>
          ))}
        </div>
      </div>
      <div className='subcategories-scroll'>
        {Array.isArray(categories) && categories
          .filter((category) => category.name === activeCategory)
          .map((category) => (
            <div key={category._id} className='subcategory-container'>
              {Array.isArray(category?.subcategories) && category.subcategories?.map((sub) => (
                <Link
                  key={sub}
                  to={{
                    pathname: '/search',
                    search: `?categoryName=${encodeURIComponent(category.name)}&subcategory=${encodeURIComponent(sub)}`,
                  }}
                  className='p-3'
                >
                  {sub}
                </Link>
              ))}
            </div>
          ))}
      </div>
    </div>
  );
}

export default Navigation