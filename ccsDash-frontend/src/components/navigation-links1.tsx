import React from 'react'

import PropTypes from 'prop-types'

import './common/css/navigation-links1.css'

const NavigationLinks1 = (props:any) => {
  return (
    <nav className={`navigation-links1-nav ${props.rootClassName} `}>
      <span className="navigation-links1-text">{props.text}</span>
      <span className="navigation-links1-text1">{props.text1}</span>
      <span className="navigation-links1-text2">{props.text2}</span>
      <span className="navigation-links1-text3">{props.text3}</span>
      <span className="navigation-links1-text4">{props.text4}</span>
    </nav>
  )
}

NavigationLinks1.defaultProps = {
  text3: 'Team',
  text1: 'Features',
  text2: 'Pricing',
  text: 'About',
  rootClassName: '',
  text4: 'Blog',
}

NavigationLinks1.propTypes = {
  text3: PropTypes.string,
  text1: PropTypes.string,
  text2: PropTypes.string,
  text: PropTypes.string,
  rootClassName: PropTypes.string,
  text4: PropTypes.string,
}

export default NavigationLinks1
