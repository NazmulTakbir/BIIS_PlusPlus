import { borderLeft } from '@mui/system';
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

                   

                    <div>
                        <div className='text'>
                            <a target="_blank" class="fcc-btn" href={ProfileData.link}>Visit Website</a> 
                        </div>
                        
                    </div>

                </div>

            </div>

            <div className="contact-info-card">
                <div className="contact-header">Contact Information</div>
                <div className="contact-info">
                <div className='item'>
                        <div className='heading'>Address: </div>
                        <div className='text'>Room No : {ProfileData.room_no}</div>
                        <div className='text'>Department Of {ProfileData.dept_name}</div>
                        <div className='text'>Bangladesh University of Engineering and Technology</div>
                    </div>

                    <div className='item'>
                        <div className='heading'>Contact Info: </div>
                        <div className='text'>Office Phone : {ProfileData.office_phone}</div>
                        <div className='text'>Cell Phone : {ProfileData.cell_phone}</div>
                        <div className='text'>Email : {ProfileData.email}</div>
                        <div className='text'></div>
                    </div>
                </div>
            </div>
         </div>

        
      );
};

export default AdvisorProfile