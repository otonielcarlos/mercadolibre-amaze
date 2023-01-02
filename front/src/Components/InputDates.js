
import React, {useContext} from 'react'
import {Context} from '../Context/Context'

function InputDates({marca}){

  const {onChangeDate, setDateForSearch} = useContext(Context)
  // const { to} = rangeDate
  return (
    <>
      <label>Desde</label>
      <input type="date" id="start" name="from"
      min="2022-08-01" max="2023-12-31"
      className='button-6'
      onChange={onChangeDate}
      />
      <label>Hasta</label>
      <input type="date" id="finish" name="to"
      className='button-6'
      min="2022-01-01" max="2023-12-31"
      onChange={onChangeDate}
      />
      <button className='button-6' onClick={() => setDateForSearch(marca)}> Buscar</button>
  </>)

}

export {InputDates}