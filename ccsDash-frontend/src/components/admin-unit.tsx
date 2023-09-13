import React from 'react'

import PropTypes from 'prop-types'

import './common/css/admin-unit.css'

const AdminUnit = (props:any) => {
  return (
    <div id="editUnit" className="admin-unit-container">
      <h1 className="admin-unit-text">{props.heading}</h1>
      <form className="admin-unit-form">
        <ul className="admin-unit-ul list">
          <li className="admin-unit-li list-item">
            <span className="admin-unit-ccs-name list">
              <span>CCS Name:</span>
              <br></br>
            </span>
          </li>
          <li className="admin-unit-li1 list-item">
            <span className="admin-unit-log-msg list">
              <span>Log Message:</span>
              <br></br>
            </span>
          </li>
          <li className="admin-unit-li2 list-item">
            <span className="admin-unit-p-s1">
              <span>Pressure Sensor 1:</span>
              <br></br>
            </span>
          </li>
          <li className="admin-unit-li3 list-item">
            <span className="admin-unit-p-s2">
              <span>Pressure Sensor 2:</span>
              <br></br>
            </span>
          </li>
          <li className="admin-unit-li4 list-item">
            <span className="admin-unit-p-ambient">
              <span>Ambient Pressure</span>
              <br></br>
            </span>
          </li>
          <li className="admin-unit-li5 list-item">
            <span className="admin-unit-pwm">PWM</span>
          </li>
          <li className="admin-unit-li6 list-item">
            <span className="admin-unit-cfm-set-point">
              <span>CFM SetPoint</span>
              <br></br>
            </span>
          </li>
          <li className="admin-unit-li7 list-item">
            <span className="admin-unit-elevation">
              <span>Elevation:</span>
              <br></br>
            </span>
          </li>
          <li className="admin-unit-li8 list-item">
            <span className="admin-unit-model-type">
              <span>Model Type</span>
              <br></br>
            </span>
          </li>
        </ul>
        <button className="admin-unit-button button">{props.removeUnit}</button>
      </form>
      <div className="admin-unit-container1">
        <button type="submit" className="admin-unit-button1 button">
          {props.saveAdmin}
        </button>
        <button className="admin-unit-button2 button">
          {props.closeAdmin}
        </button>
      </div>
    </div>
  )
}

AdminUnit.defaultProps = {
  heading: 'Admin Access',
  saveAdmin: 'Save',
  closeAdmin: 'Close',
  removeUnit: 'Remove Unit',
}

AdminUnit.propTypes = {
  heading: PropTypes.string,
  saveAdmin: PropTypes.string,
  closeAdmin: PropTypes.string,
  removeUnit: PropTypes.string,
}

export default AdminUnit
