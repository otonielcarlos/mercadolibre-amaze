
import React, {useContext} from 'react'
import {Context} from '../Context/Context'

function InputDates(){

  const {onChangeDate, setDateForSearch} = useContext(Context)

  return (
    <>
      <input type="date" id="start" name="from"
      min="2022-01-01" max="2022-12-31"
      onChange={onChangeDate}
      />

      <input type="date" id="finish" name="to"
      min="2022-01-01" max="2022-12-31"
      onChange={onChangeDate}
      />
      <button onClick={setDateForSearch}> Buscar</button>
  </>)

}

export {InputDates}