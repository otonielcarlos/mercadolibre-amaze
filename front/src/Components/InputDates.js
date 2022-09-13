
import React, {useContext} from 'react'
import {Context} from '../Context/Context'

function InputDates(){

  const {onChangeDate, setDateForSearch, rangeDate} = useContext(Context)
  const {from, to} = rangeDate
  return (
    <>
      <label>Desde</label>
      <input type="date" id="start" name="from"
      min="2022-08-01" max="2022-12-31"
      className='button-6'
      onChange={onChangeDate}
      />
      <label>Hasta</label>
      <input type="date" id="finish" name="to"
      className='button-6'
      min="2022-01-01" max={to}
      onChange={onChangeDate}
      />
      <button className='button-6' onClick={setDateForSearch}> Buscar</button>
  </>)

}

export {InputDates}