import React from 'react'

export const ButtonInMenu = (key, text, onClick) => (
  <div key={key} className='menu-btn' onClick={onClick}>
    {text}
  </div>
)

export const MenuTitle = (text) => (
  <div key={'title-'+text} className='menu-title'>{text}</div>
)

export const Forms = (key, dataList) => {
  const formList = dataList.map(({ name, placeholder, onChange, onSubmit, text }) => (
    <div key={key + name} className='form'>
      <input name={name} placeholder={placeholder} onChange={onChange}/>
      {text && ButtonInMenu(key + text, text, onSubmit)}
    </div>
  ))

  return (
    <div className='forms' key={key}>
      {formList}
    </div>
  )
}

export const ButtonHome = ({key, text, onClick}) => (
  <div className='home-btn'>
    {ButtonInMenu(key, text, onClick)}
  </div>
)
