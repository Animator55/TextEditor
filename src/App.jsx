import React from 'react'
import './assets/App.css'
import Header from './components/Header'

let defaultText = ""
let defaultOptions = ["history", "div1", "div2", "div3", "icon", "clean"]

const clean =(str)=>{
  str.replace(/\*\*/g, "")
  str.replace(/\_\_/g, "")
  str.replace(/\/\//g, "")
  str.replace(/\~\~/g, "")
  str.replace(/\^\^/g, "")
  str.replace(/\´\´/g, "")
  return str
}

const regexText = (str, bool)=>{
  let newStr = ""
  if(!bool) newStr = clean(str)
  newStr = str !== undefined ? !bool ? str.replace(/\*(.*?)\*/g, "<b>$1</b>") : str.replace(/(<b>|<\/b>)/g, "*") : ""
  newStr = !bool ? newStr.replace(/(?<!\<)\/(.*?)(?<!\<)\//g, "<i>$1</i>") : newStr.replace(/(<i>|<\/i>)/g, "/") 
  newStr = !bool ? newStr.replace(/\_(.*?)\_/g, "<ins>$1</ins>") : newStr.replace(/(<ins>|<\/ins>)/g, "_")
  newStr = !bool ? newStr.replace(/\~(.*?)\~/g, "<s>$1</s>") : newStr.replace(/(<s>|<\/s>)/g, "~")
  newStr = !bool ? newStr.replace(/\^(.*?)\^/g, "<sup>$1</sup>") : newStr.replace(/(<sup>|<\/sup>)/g, "^")
  newStr = !bool ? newStr.replace(/\´(.*?)\´/g, "<sub>$1</sub>") : newStr.replace(/(<sub>|<\/sub>)/g, "´")
  return newStr
}

export default function App() {
  const [paragraphList, setParagraphList] = React.useState([
    {id: "0", text: "Text 1"},
    {id: "1", text: "Text 2"}
  ])
  const HeadRef = React.useRef()
  const TextRef = React.useRef()

  const resetCount = ()=>{
    TextRef.current.dataset.count = `${TextRef.current.innerText.length} / 1000`
  }

  const toggleHistory = (index, bool)=>{
    HeadRef.current?.lastChild?.firstChild?.childNodes[index]?.classList?.toggle("disabled", bool)
  }

  const getSelectedIndex = (id)=>{
    let index = 0
    for(let i=0; i<paragraphList.length; i++) {
      if(paragraphList[i].id === id) {index = i; break}
    }
    return index
  }

  const focus = (id)=>{
    let idLocal = id === undefined ? TextRef.selected : id
    let index = getSelectedIndex(idLocal)
    
    TextRef.current?.childNodes[index]?.focus()
  }

  const saveParagraph = ()=>{
    if(TextRef.selected === undefined) return paragraphList
    let index = getSelectedIndex(TextRef.selected)
    paragraphList.splice(index, 1, {id: TextRef.selected, text: TextRef.current.childNodes[index].innerText})

    return paragraphList
  }

  const select = (id)=>{
    saveParagraph()
    TextRef.undo = []
    TextRef.redo = []
    TextRef.selected = id
    // toggleHistory(0, true)
    // toggleHistory(1, true)
    console.log(id)
  }


  const undo = (e) => {
    e.preventDefault()
    // if (TextRef.undo.length === 0) return

    // toggleHistory(1, false)

    // TextRef.redo.push(TextRef.undo[TextRef.undo.length - 1])
    // TextRef.undo.pop()
    // TextRef.current.innerHTML = TextRef.undo.length === 0 ? "" : TextRef.undo[TextRef.undo.length - 1]

    // if (TextRef.undo.length === 0) return toggleHistory(0, true)
    // else if (TextRef.redo.length > 10) TextRef.redo.shift()

    // resetCount()
    // focus()
  }
  const redo = (e) => {
    e.preventDefault()
    // if (TextRef.redo.length === 0) return

    // toggleHistory(0, false)

    // TextRef.current.innerHTML = TextRef.redo[TextRef.redo.length - 1]
    // TextRef.undo.push(TextRef.redo[TextRef.redo.length - 1])
    // TextRef.redo.pop()

    // if (TextRef.undo.length > 10) TextRef.undo.shift()
    // if (TextRef.redo.length === 0) return toggleHistory(1, true)

    // resetCount()
    // focus()
  }

  const setSelection = () => {
    let selection = ''
    if (window.getSelection) selection = window.getSelection();
    else if (document.getSelection) selection = document.getSelection();
    else if (document.selection) selection = document.selection.createRange().text;
    return selection
  }

  const addTags = (Tag) => {
    let selection = setSelection()
    let index = getSelectedIndex(TextRef.selected)
    let allText = TextRef?.current?.childNodes[index]?.innerText

    let fullSelect = selection.baseOffset === selection.extentOffset

    let [lower, upper] = selection.baseOffset < selection.extentOffset ? [selection.baseOffset, selection.extentOffset] : [selection.extentOffset, selection.baseOffset]
    let selectedText = fullSelect ? allText
      : selection.baseNode.data.slice(lower, upper)
      
    let a = fullSelect ? "": allText.slice(0, lower)
    let b = fullSelect ? "": allText.slice(upper)

    TextRef.current.childNodes[index].innerText = a + (Tag + selectedText + Tag) + b
    addUndo()
    
    resetCount()
    focus()
  }
  const addIcon = (icon) => {
    let selection = setSelection()
    let index = getSelectedIndex(TextRef.selected)
    let allText = TextRef?.current?.childNodes[index]?.innerText
    
    let selectedText = selection.baseOffset === selection.extentOffset ?
    undefined
    : selection.baseNode.data.slice(selection.baseOffset, selection.extentOffset)
    
    TextRef.current.childNodes[index].innerText = selectedText !== undefined ? allText.replace(selectedText, icon) : allText.slice(0, selection.baseOffset) + icon + allText.slice(selection.baseOffset)
    addUndo()

    resetCount()
    focus()
  }

  const switchUpperCase = () => {
    let selection = setSelection()
    let index = getSelectedIndex(TextRef.selected)
    let allText = TextRef?.current?.childNodes[index]?.innerText

    let selectedText = selection.baseOffset === selection.extentOffset ?
      allText
      : selection.baseNode.data.slice(selection.baseOffset, selection.extentOffset)

    let newStr = "";

    for (let i = 0; i < selectedText.length; i++) {
      let letter = selectedText[i];

      if (letter === letter.toUpperCase()) {
        newStr += letter.toLowerCase();
      } else {
        newStr += letter.toUpperCase();
      }
    }

    TextRef.current.childNodes[index].innerText = allText.replace(selectedText, newStr)

    resetCount()
    focus()
  }

  const cleanFormat = ()=>{
    addUndo()
    let index = getSelectedIndex(TextRef.selected)
    let text = TextRef?.current?.childNodes[index]?.innerText
    text = text.replace(/\*(.*?)\*/g, "$1")
    text = text.replace(/(?<!\<)\/(.*?)(?<!\<)\//g, "$1")
    text = text.replace(/\_(.*?)\_/g, "$1")
    text = text.replace(/\~(.*?)\~/g, "$1")
    text = text.replace(/\^(.*?)\^/g, "$1")
    text = text.replace(/\´(.*?)\´/g, "$1")

    TextRef.current.childNodes[index].innerText = text
    resetCount()
    focus()
  }

  const checkKey = (e) => {
    if (e.key === "z" && e.ctrlKey) undo(e)
    else if (e.key === "y" && e.ctrlKey) redo(e)
    else if (e.key === "b" && e.ctrlKey) addTags("*")
    else if (e.key === "k" && e.ctrlKey) addTags("/")
    else if (e.key === "u" && e.ctrlKey) addTags("_")
    else if (e.key === "h" && e.ctrlKey) addTags("^")
    else if (e.key === "g" && e.ctrlKey) addTags("´")
    else if (e.key === "Enter") {
      e.preventDefault(); 
      let oldList = saveParagraph()
      let index
      let list = [...oldList]
      for(let i=0; i<paragraphList.length; i++) {
        if(paragraphList[i].id === TextRef.selected) {index = i+1; break}
      }
      let id = Math.random()
      list.splice(index, 0, {id: id, text: ""})
      TextRef.selected = id
      setParagraphList(list)
    }
    else if (e.key === "Control") return
    else addUndo()
  }

  const addUndo = () => {
    // if (TextRef.current.innerHTML === TextRef.undo[TextRef.undo.length-1]) return null
    // TextRef.redo = []
    // toggleHistory(1, true)
    // TextRef.undo.push(TextRef.current.innerHTML)
    // toggleHistory(0, false)
    // if (TextRef.undo.length > 10) TextRef.undo.shift()

    resetCount()
  }

  const checkPrevents = e => {
    if ((e.ctrlKey && (e.key === "z" || e.key === "y"))|| e.key === "Enter") e.preventDefault()
    if (e.key === "Backspace") {
      console.log(e.target.dataset.index)
      if(e.target.innerText.length === 0 && e.target.dataset.index !== 0) {
        let list = [...paragraphList]
        list.splice(e.target.dataset.index, 1)
        setParagraphList(list)
        focus(paragraphList[e.target.dataset.index -1].id)
      }
    }
  }

  React.useEffect(() => {
    TextRef.undo = []
    TextRef.redo = []
    focus()
  }, [])

  React.useEffect(()=>{
    focus()
  }, [paragraphList])

  const optionsFunctions = {
    undo: undo,
    redo: redo,
    bold: () => { addTags("*") },
    italic: () => { addTags("/") },
    underline: () => { addTags("_") },
    midline: () => { addTags("~") },
    sup: () => { addTags("^") },
    sub: () => { addTags("´") },
    icon: (icon) => { addIcon(icon) },
    size: (size)=>{TextRef.current.style.fontSize = size + px},
    upper: switchUpperCase,
    new: ()=>{
      setParagraphList([{id: "0", text: ""}])
      TextRef.undo = []
      TextRef.redo = []
      toggleHistory(0, true)
      toggleHistory(1, true)
      resetCount()
      focus()
    },
    show: ()=>{
      TextRef.current.innerHTML = regexText(TextRef.current.innerHTML, TextRef.current.classList.contains("showing"))
      TextRef.current.setAttribute("contenteditable", TextRef.current.classList.contains("showing"))
      TextRef.current.classList.toggle("showing")
      resetCount()
      focus()
    },
    format: cleanFormat,
  }

  return <section className='main'>
    <Header HeadRef={HeadRef} options={defaultOptions} functions={optionsFunctions} />
    <div
      className='text-editor'
      data-count={"0 / 1000"}
      ref={TextRef}
    >
      {paragraphList.map((p, i)=>{
        return <p 
          data-index={i}
          key={Math.random()}
          onClick={()=>{if(p.id !== TextRef.selected)select(p.id)}}
          onKeyDown={checkPrevents}
          onKeyUp={checkKey}
          contentEditable
          suppressContentEditableWarning
          dangerouslySetInnerHTML={{ __html: p.text }}></p>
      })}
    </div>
  </section>
}
