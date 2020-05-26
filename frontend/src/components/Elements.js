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
  const formList = dataList.map(data => (
    <div key={key + data.name} className='form'>
      <input
        autoComplete="off"
        name={data.name}
        placeholder={data.placeholder}
        onChange={data.onChange}
        type={data.type}
        onKeyDown={(e) => {
          if (e.key==='Enter') {
            e.target.blur()
            data.onEnter()
          }
        }}
      />
      {data.text && ButtonInMenu(key + data.text, data.text, data.onSubmit)}
    </div>
  ))

  return (
    <div className='forms' key={key}>
      {formList}
    </div>
  )
}

export const ButtonHome = ({key, text, onClick}) => (
  <div key={key+'-btn'} className='home-btn'>
    {ButtonInMenu(key, text, onClick)}
  </div>
)

export const WarningMsg = (key) => (
  <p key={key}>Use only ENG, Number</p>
)