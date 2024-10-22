import React, { useEffect, useRef } from 'react'

const TrustBox = ({ref}) => {
    ref = useRef(null)
    useEffect(()=> {
        if(window.TrustPilot){
            window.Trustpilot.loadFromElement(ref.current, true);
        }
    },[ref])
  return (
    <div className="trustpilot-widget my-2" data-locale="en-US" 
      data-template-id="56278e9abfbbba0bdcd568bc" data-businessunit-id="667a5f63b3fdbc32aa764f35" data-style-height="52px" data-style-width="100%">
      <a href="https://www.trustpilot.com/review/ugyard.com" 
      target="_blank" rel="noreferrer">Trustpilot</a>
  </div>
  )
}

export default TrustBox
