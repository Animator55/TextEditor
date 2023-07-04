import { faAlignCenter, faAlignLeft, faAlignRight, faArrowRotateLeft, faArrowRotateRight, faBold, faEye, faGear, faItalic, faListUl, faStrikethrough, faSubscript, faSuperscript, faTextSlash, faTrash, faUnderline, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import PopUp from './PopUp'

export default function Header({ options, setConfig, HeadRef, functions }) {
    const [popUp, openPop] = React.useState(false)

    const emojisArray = ["😀", "😁", "😂", "🤣", "😃", "😄", "😅", "😆", "😉", "😊", "😋", "😎", "😍", "😘", "🥰", "😗"]
    let fontSizes = ["8px", "9px", "10px", "11px", "12px", "14px", "16px", "18px", "20px", "22px", "24px", "26px", "28px", "36px", "48px"]
    let fontFamilys = [
        "Arial",
        "Verdana",
        "Tahoma",
        "Trebuchet MS",
        "Times New Roman",
        "Georgia",
        "Garamond",
        "Courier New",
        "Brush Script MT",
    ]

    const optionsList = {
        History: <div key={Math.random()}>
            <button
                className='disabled'
                onClick={functions.undo}
                title='Undo'
            ><FontAwesomeIcon icon={faArrowRotateLeft} /></button>
            <button
                className='disabled'
                onClick={functions.redo}
                title='Redo'
            ><FontAwesomeIcon icon={faArrowRotateRight} /></button>
        </div>,
        "Text Formating": <div className='d-flex-col' key={Math.random()}>
            <select title='Font Family' onChange={(e) => { functions.font(e.target.value) }}>
                {fontFamilys.map(font => {
                    return <option
                        key={Math.random()}
                        style={{ fontFamily: font }}
                    >{font}</option>
                })}
            </select>
            <select title='Font Size' onChange={(e) => { functions.size(e.target.value) }}>
                {fontSizes.map(size => {
                    return <option
                        key={Math.random()}
                        style={{ fontSize: size }}
                    >{size}</option>
                })}
            </select>
            <button title='Toggle Uppercase/Lowercase' onClick={functions.upper}
            >Aa</button>
            <button
                onClick={functions.bold}
                title='Bold'
            ><FontAwesomeIcon icon={faBold} /></button>
            <button
                onClick={functions.italic}
                title='Italic'
            ><FontAwesomeIcon icon={faItalic} /></button>
            <button
                onClick={functions.underline}
                title='Underline'
            ><FontAwesomeIcon icon={faUnderline} /></button>
            <button
                onClick={functions.midline}
                title='Line Through'
            ><FontAwesomeIcon icon={faStrikethrough} /></button>
            <button onClick={functions.sup} title='Superscript'><FontAwesomeIcon icon={faSuperscript} /></button>
            <button onClick={functions.sub} title='Subscript'><FontAwesomeIcon icon={faSubscript} /></button>
        </div>,
        "Text alignment": <div key={Math.random()}>
            <button onClick={() => { functions.align("0") }} title='Align Left'><FontAwesomeIcon icon={faAlignLeft} /></button>
            <button onClick={() => { functions.align("auto") }} title='Align Center'><FontAwesomeIcon icon={faAlignCenter} /></button>
            <button onClick={() => { functions.align("0 0 0 auto") }} title='Align Right'><FontAwesomeIcon icon={faAlignRight} /></button>
            <button onClick={(e) => { 
                e.target.classList.toggle("active")
                functions.list(e.target.classList.contains("active"))
            }} title='List Item'><FontAwesomeIcon icon={faListUl} /></button>
        </div>,
        "Color": <div className='d-flex-col' key={Math.random()}>
            <label className='color-input' title='Color'>
                <p style={{ marginTop: 3 }}>A</p><input type='color' onChange={(e) => { functions.color(e.target.value) }} />
            </label>
            <label className='back-input' title='Background Color'>
                <p>A</p><input type='color' onChange={(e) => { functions.background(e.target.value) }} />
            </label>
        </div>,
        "Emojis list": <ul key={Math.random()} >
            {emojisArray.map(emoji => {
                return <button
                    key={Math.random()}
                    title='Emoji'
                    onClick={() => { functions.icon(emoji) }}
                >{emoji}</button>
            })}
        </ul>,
        "Cleaners": <div className='d-flex-col' key={Math.random()}>
            <button title='Delete Text' onClick={functions.new}><FontAwesomeIcon icon={faTrash} /></button>
            <button title='Clean Format' onClick={functions.format}><FontAwesomeIcon icon={faTextSlash} /></button>
        </div>
    }

    let header = Object.keys(options.ToolBar).map(option => {
        return options.ToolBar[option] && <React.Fragment key={Math.random()}>{optionsList[option]} <hr></hr></React.Fragment>
    })

    const Top = () => {
        return <nav>
            <p>TextEditor</p>
            <button title='Configuration' onClick={() => { openPop(true) }}><FontAwesomeIcon icon={faGear} /></button>
            <button title='Close'><FontAwesomeIcon icon={faXmark} /></button>
        </nav>
    }

    return <header className='header' ref={HeadRef}>
        <Top />
        {popUp && <PopUp options={options} setConfig={setConfig} close={() => { openPop(false) }} />}
        <section>{header}</section>
    </header>
}
