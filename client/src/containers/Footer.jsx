import React from 'react'
import { Link } from 'react-router-dom'

const Footer = props => (
  <div className='footer'>
    &copy; 2017 The Ursa Majors
    <div className='footer__right'>
      <Link className='footer__link' to='/privacy'>
        {props.mobile ? <i className='fa fa-user-secret footer__icon' /> : 'Privacy'}
      </Link>
      <a
        href='https://github.com/ursa-majors/co-ment'
        data-taborder=''
        rel='noopener noreferrer'
        target='_blank'
        className='footer__link'
      >
        <i className='fa fa-github footer__icon' />
      </a>
    </div>
  </div>
)

export default Footer
