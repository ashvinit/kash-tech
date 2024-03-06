import React from "react";
import "../assets/styles/EmployeesDetail.css";

function EmployeeInfoCard(props) {
  return (
    <section className="EmployeeInfoCard--section-container">
      <div className="EmployeeInfoCard--employee-detail-section">
        <section className="EmployeeInfoCard--employee-name-id-username-section">
          <h3 className="EmployeeInfoCard--employee-name">Garrett Anderson</h3>
          <div className="EmployeeInfoCard--employee-username">
            <label>Username:</label>
            <span>ganderson</span>
          </div>
          <div className="EmployeeInfoCard--employee-id">
            <label>EMP_ID:</label>
            <span>411065</span>
          </div>
          <div className="EmployeeInfoCard--employee-level">
            <label>User level:</label>
            <span>Super Admin</span>
          </div>
        </section>
        <section className="EmployeeInfoCard--employee-type">
          <label>Contract Type:</label>
          <span>W-2</span>

          {/* If employee type is contractor/ 1099-C  
          <div>
            <label>Contract Type:</label>
            <span className="EmployeeInfoCard--contractor">1099-C</span>
          </div>
          <div>
            <label>Contract Name:</label>
            <span className="EmployeeInfoCard--contractor-name">
              Contractor Name
            </span>
          </div>
          */}
        </section>
      </div>

      <section className="EmployeeInfoCard--employee-contact-info-section">
        <ol>
          <li>
            <label>Email:</label>
            <span className="EmployeeInfoCard--employee-email">
              Garrett.Anderson@kashtechllc.com
            </span>
          </li>
          <li>
            <label>Phone:</label>
            <span>407-718-1889</span>
          </li>
          <li>
            <label>Location:</label>
            <span>Longwood, Florida - United States</span>
          </li>
        </ol>
      </section>

      <section className="EmployeeInfoCard--employee-hours-billed-section">
        <label>Hours Billed:</label>
      </section>
    </section>
  );
}

export default EmployeeInfoCard;
