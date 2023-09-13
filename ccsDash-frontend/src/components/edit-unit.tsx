import React from 'react'

import PropTypes from 'prop-types'

import './common/css/edit-unit.css'

const EditUnit = (props:any) => {
  return (
    <div id="editUnit" className="edit-unit-container">
      <h1 className="edit-unit-text">{props.heading}</h1>
      <form className="edit-unit-form">
        <input
          type="text"
          placeholder="CCS Name"
          className="edit-unit-textinput input"
        />
        <input
          type="text"
          placeholder="Elevation"
          className="edit-unit-textinput1 input"
        />
        <input
          type="text"
          placeholder="Model Type"
          className="edit-unit-textinput2 input"
        />
        <input
          type="text"
          placeholder="Serial Number"
          className="edit-unit-textinput3 input"
        />
        <input
          type="text"
          placeholder="Airspeed"
          className="edit-unit-textinput4 input"
        />
        <input
          type="text"
          placeholder="Pre-Filter Timer"
          className="edit-unit-textinput5 input"
        />
      </form>
      <div className="edit-unit-container1">
        <button type="submit" className="edit-unit-button button">
          {props.saveCfg}
        </button>
        <button className="edit-unit-button1 button">{props.closeCfg}</button>
      </div>
    </div>
  )
}

EditUnit.defaultProps = {
  textinput_placeholder2: 'placeholder',
  textinput_placeholder4: 'placeholder',
  textinput_placeholder: 'placeholder',
  closeCfg: 'Close',
  heading: 'Edit Existing CCS',
  textinput_placeholder1: 'placeholder',
  textinput_placeholder3: 'placeholder',
  textinput_placeholder5: 'placeholder',
  saveCfg: 'Save',
}

EditUnit.propTypes = {
  textinput_placeholder2: PropTypes.string,
  textinput_placeholder4: PropTypes.string,
  textinput_placeholder: PropTypes.string,
  closeCfg: PropTypes.string,
  heading: PropTypes.string,
  textinput_placeholder1: PropTypes.string,
  textinput_placeholder3: PropTypes.string,
  textinput_placeholder5: PropTypes.string,
  saveCfg: PropTypes.string,
}

export default EditUnit
