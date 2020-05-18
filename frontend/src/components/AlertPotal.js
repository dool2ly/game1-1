import React from 'react';
import { connect } from 'react-redux'

import '../scss/AlertPortal.scss'
import { closeAlert } from '../actions/AlertPortal'

const AlertBox = ({ title, message, onClick }) => (
  <div className="AlertPortal">
    <div className="alert-box">
      <div className='alert-title'>{title}</div>
      <div className='alert-msg'>{message}</div>
      <div className='menu-btn' onClick={onClick}>OK</div>
    </div>
  </div>
)

const AlertPortal = ({ title, message, show, closeAlert }) => (
  <div>
    {show ? <AlertBox title={title} message={message} onClick={closeAlert}/> : ''}
  </div>
)

const mapStateToProps = (state) => {
  return {
    ...state.portal
  }
}

export default connect(mapStateToProps, { closeAlert })(AlertPortal)
