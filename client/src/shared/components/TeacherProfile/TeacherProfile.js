import React from "react";
import "./TeacherProfile.css";
import CustomButton from "../CustomButton/CustomButton";

const TeacherProfile = (props) => {
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

          <div>
            <div className="text" style={{ paddingTop: "20px" }}>
              <a
                target="_blank"
                rel="noreferrer"
                className="link-to-faculty"
                href={ProfileData.link}
                style={{ textDecoration: "none", transition: "0.4s" }}
              >
                <CustomButton width="150px" label="Visit Faculty Page" variant="contained" color="#ffffff" bcolor="#b13137" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="contact-info-card">
        <div className="contact-header">Contact Information</div>
        <div className="contact-info">
          <div className="item">
            <div className="heading">Address: </div>
            <div className="text">Room No : {ProfileData.room_no}</div>
            <div className="text">Department Of {ProfileData.dept_name}</div>
            <div className="text">Bangladesh University of Engineering and Technology</div>
          </div>

          <div className="item">
            <div className="heading">Contact Info: </div>
            <div className="text">Office Phone : {ProfileData.office_phone}</div>
            <div className="text">Cell Phone : {ProfileData.cell_phone}</div>
            <div className="text">Email : {ProfileData.email}</div>
            <div className="text"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfile;
