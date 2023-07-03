import { faSquare, faSquareCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

const defaultOptions = {
    ToolBar: {
        "History" : true, 
        "Text Formating": true, 
        "Text alignment": true, 
        "Color": true, 
        "Emojis list": true, 
        "Cleaners": true
    }
}

export default function PopUp({options, setConfig, close}) {
  return <section className='pop-back' onClick={(e)=>{if(e.target.className==='pop-back') close()}}>
    <div className='pop-up'>
        <h1>Configuration</h1>
        {Object.keys(defaultOptions).map(key=>{
            return <section key={Math.random()}>
                <h1>{key}</h1>
                <br></br>
                <ul>{Object.keys(defaultOptions[key]).map(config=>{
                    return <li key={Math.random()} onClick={()=>{setConfig({...options, [key]: {...options[key], [config]: !options[key][config]}})}}>
                        <p>{config}</p>
                        <FontAwesomeIcon icon={options[key][config] ? faSquareCheck : faSquare}/>
                    </li>
                })}</ul>
            </section>
        })}
    </div>
  </section>
}
