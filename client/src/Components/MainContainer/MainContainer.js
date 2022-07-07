import React from 'react'
import './MainContainer.css'
import PlaceHolder from './Placeholder/PlaceHolder'

function MainContainer() {
  return (
    <div className='main_container'>
        <div className='content'>
          <PlaceHolder />
        </div>
    </div>
  )
}

export default MainContainer