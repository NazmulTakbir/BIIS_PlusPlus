import React from 'react'
import "./AdvisorProfile.css"

const AdvisorProfile = (props) => {
    const { ProfileData } = props;
    return (
        <div className='profile-container'>
            <div className='profile-card'>
                <img 
                    src='https://www.w3schools.com/howto/img_avatar.png'
                    alt='avatar'
                    className='profile-pic'
                />

                <div className='profile-data'>
                    <div className='item'>
                        <div className='heading'>Name: </div>
                        <div className='text'>{ProfileData.name}</div>
                    </div>
                                        
                    <div className='item'>
                        <div className='heading'>Teacher ID: </div>
                        <div className='text'>{ProfileData.teacher_id}</div>
                    </div>

                    <div className='item'>
                        <div className='heading'>Department ID: </div>
                        <div className='text'>{ProfileData.dept_id}</div>
                    </div>
                </div>

            </div>
        </div>
      );
};

export default AdvisorProfile