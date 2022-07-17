import React from "react";
import "./Profile.css";

const Profile = (props) => {
  const { ProfileData } = props;
  return (
    <div className="profile-container">
      <div className="profile-card">
        <img src="https://www.w3schools.com/howto/img_avatar.png" alt="avatar" className="profile-pic" />

        <div className="profile-data">
          <div className="item">
            <div className="heading">Name: </div>
            <div className="text">{ProfileData.name}</div>
          </div>

          <div className="item">
            <div className="heading">Student ID: </div>
            <div className="text">{ProfileData.student_id}</div>
          </div>

          <div className="item">
            <div className="heading">Department ID: </div>
            <div className="text">{ProfileData.dept_id}</div>
          </div>

          <div className="item">
            <div className="heading">Hall ID: </div>
            <div className="text">{ProfileData.hall_id}</div>
          </div>

          <div className="item">
            <div className="heading">Level, Term: </div>
            <div className="text">
              {ProfileData.level}-{ProfileData.term}
            </div>
          </div>
        </div>
      </div>

      <div className="contact-info-card">
        <div className="contact-header">Contact Information</div>
        <div className="contact-info">
          <div className="item">
            <div className="heading">Email: </div>
            <div className="text">{ProfileData.email}</div>
          </div>

          <div className="item">
            <div className="heading">Advisor ID: </div>
            <div className="text">{ProfileData.advisor_id}</div>
          </div>

          <div className="item">
            <div className="heading">Mobile No: </div>
            <div className="text">{ProfileData.mobile_no}</div>
          </div>

          <div className="item">
            <div className="heading">Date of Birth: </div>
            <div className="text">{ProfileData.date_of_birth}</div>
          </div>

          <div className="item">
            <div className="heading">National ID: </div>
            <div className="text">{ProfileData.nid_no}</div>
          </div>

          <div className="item">
            <div className="heading">Bank Account No:</div>
            <div className="text">{ProfileData.bank_acc_no}</div>
          </div>

          <div className="item">
            <div className="heading">Present Address: </div>
            <div className="text">{ProfileData.present_address}</div>
          </div>

          <div className="item">
            <div className="heading">Contact Person Addres: </div>
            <div className="text">{ProfileData.contact_person_address}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
