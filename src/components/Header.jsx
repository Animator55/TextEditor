import { faArrowRotateLeft, faArrowRotateRight, faBold, faEye, faGear, faItalic, faStrikethrough, faSubscript, faSuperscript, faTextSlash, faTrash, faUnderline, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

export default function Header({options, HeadRef, functions}) {
    const emojisArray = ["😀", "😁", "😂","🤣","😃","😄","😅","😆","😉","😊","😋","😎","😍","😘","🥰","😗"]
    let fontSizes = [8,9,10,11,12,14,16,18,20,22,24,26,28,36,48]

    const optionsList = {
        history: <div key={Math.random()}>
            <button
                className='disabled'
                onClick={functions.undo} 
                title='Undo'
            ><FontAwesomeIcon icon={faArrowRotateLeft}/></button>
            <button
                className='disabled'
                onClick={functions.redo} 
                title='Redo'
            ><FontAwesomeIcon icon={faArrowRotateRight}/></button>
        </div>,
        div1: <div key={Math.random()}>
            <button
                onClick={functions.bold}  
                title='Bold'
            ><FontAwesomeIcon icon={faBold}/></button>
            <button
                onClick={functions.italic}  
                title='Italic'
            ><FontAwesomeIcon icon={faItalic}/></button>
            <button
                onClick={functions.underline}  
                title='Underline'
            ><FontAwesomeIcon icon={faUnderline}/></button>
            <button
                onClick={functions.midline}  
                title='Line Through'
            ><FontAwesomeIcon icon={faStrikethrough}/></button>
        </div>,
        div2: <div key={Math.random()}>
            <select title='Font Size'>
                {fontSizes.map(size=>{
                    return <option
                        key={Math.random()} 
                        onClick={()=>{functions.size(size)}}  
                        style={{fontSize: size}}
                    >{size+ "px"}</option>
                })}
            </select>
            <button title='Toggle Uppercase/Lowercase' onClick={functions.upper}  
            >Aa</button>
        </div>,
        div3: <div className='d-flex-col' key={Math.random()}>
            <button onClick={functions.sup} title='Superscript'><FontAwesomeIcon icon={faSuperscript}/></button>
            <button onClick={functions.sub} title='Subscript'><FontAwesomeIcon icon={faSubscript}/></button>
        </div>,
        icon: <ul key={Math.random()} >
            {emojisArray.map(emoji=>{
                return <button
                    key={Math.random()} 
                    title='Emoji'
                    onClick={()=>{functions.icon(emoji)}}  
                >{emoji}</button>
            })}
        </ul>,
        clean: <div className='d-flex-col' key={Math.random()}>
            <button title='Delete Text' onClick={functions.new}><FontAwesomeIcon icon={faTrash}/></button>
            <button title='Clean Format' onClick={functions.format}><FontAwesomeIcon icon={faTextSlash}/></button>
        </div>
    }

    let header = options.length !== 0 && options.map(option=>{
        return <React.Fragment key={Math.random()}>{optionsList[option]} <hr></hr></React.Fragment>
    })

    const Top = ()=>{
        return <nav>
            <p>TextEditor</p>
            <button title='Preview' onClick={functions.show}><FontAwesomeIcon icon={faEye}/></button>
            <button title='Configuration'><FontAwesomeIcon icon={faGear}/></button>
            <button title='Close'><FontAwesomeIcon icon={faXmark}/></button>
        </nav>
    }

    return <header className='header' ref={HeadRef}>
        <Top/>
        <section>{header}</section>
    </header>
}
