import React from 'react'
import './assets/App.css'
import Header from './components/Header'

let defaultOptions = {
  ToolBar: {
      "History" : true, 
      "Text Formating": true, 
      "Text alignment": true, 
      "Color": true, 
      "Emojis list": true, 
      "Cleaners": true
  }
}


const regexText = (str, bool)=>{
  let newStr = str
  newStr = newStr.replace(/(\*|<b>|<\/b>)(.*?)(\*|<b>|<\/b>)/g, "<b>$2</b>")
  newStr = newStr.replace(/(<i>|<\/i>)/g, "/") 
  newStr = newStr.replace(/(?<!\<)\/(.*?)(?<!\<)\//g, "<i>$1</i>") 
  newStr = newStr.replace(/(\_|<ins>|<\/ins>)(.*?)(\_|<ins>|<\/ins>)/g, "<ins>$2</ins>")
  newStr = newStr.replace(/(\~|<s>|<\/s>)(.*?)(\~|<s>|<\/s>)/g, "<s>$2</s>")
  newStr = newStr.replace(/(\^|<sup>|<\/sup>)(.*?)(\^|<sup>|<\/sup>)/g, "<sup>$2</sup>")
  newStr = newStr.replace(/(\´|<sub>|<\/sub>)(.*?)(\´|<sub>|<\/sub>)/g, "<sub>$2</sub>")
  return newStr
}

export default function App() {
  const [paragraphList, setParagraphList] = React.useState([
    {id: "0", text: "Text 1", style: {fontFamily: "Arial", fontSize: "18px", margin: "0", backgroundColor: "transparent", color: "black"}},
    {id: "1", text: "Text 2 ds", style: {fontFamily: "Arial",fontSize: "20px", margin: "0", backgroundColor: "transparent", color: "black"}},
  ])
  const [config, setConfig] = React.useState(defaultOptions)
  const HeadRef = React.useRef()
  const TextRef = React.useRef()
  
  const resetCount = (value)=>{
    TextRef.current.dataset.count = `${value!==undefined?value:TextRef.current.innerText.length} / 1000`
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

  const focus = (id, index)=>{
    let idLocal = id === undefined ? TextRef.selected : id
    let nodeIndex = getSelectedIndex(idLocal)
    
    TextRef.current?.childNodes[nodeIndex]?.focus()

    if(index === undefined && TextRef.selectedIndex === undefined) return
    
    var range = document.createRange()
    let selection = setSelection()
    let selIndex = index !== undefined ? index : TextRef.selectedIndex
    let maxIndex = TextRef.current?.childNodes[nodeIndex].innerText.length

    TextRef.selectedIndex = undefined

    selIndex = selIndex > maxIndex ? maxIndex : selIndex
    
    range.setStart(TextRef.current?.childNodes[nodeIndex].childNodes[0], selIndex)
    range.collapse(true)
    
    selection.removeAllRanges()
    selection.addRange(range)
  }
  
  const addUndo = () => {
    if (TextRef.current.innerHTML === TextRef.undo[TextRef.undo.length-1]?.text) return null
    console.log("added")
    TextRef.redo = []
    toggleHistory(1, true)
    let selection = setSelection()

    TextRef.undo.push({text: TextRef.current.innerHTML, selection: {id: TextRef.selected, index: selection.anchorOffset}})
    toggleHistory(0, false)
    // if (TextRef.undo.length > 10) TextRef.undo.shift()

    resetCount()
  }

  const saveParagraph = ()=>{
    if(TextRef.selected === undefined) return paragraphList
    let index = getSelectedIndex(TextRef.selected)
    paragraphList.splice(index, 1, {
      id: TextRef.selected, 
      text: TextRef.current.childNodes[index].innerText, 
      style: {
        fontFamily: TextRef.current.childNodes[index].style.fontFamily,
        fontSize: TextRef.current.childNodes[index].style.fontSize,
        margin: TextRef.current.childNodes[index].style.margin,
        display: TextRef.current.childNodes[index].style.display,
        backgroundColor: TextRef.current.childNodes[index].style.backgroundColor,
        color: TextRef.current.childNodes[index].style.color,
      }})

    return paragraphList
  }

  const setSelection = () => {
    let selection = ''
    if (window.getSelection) selection = window.getSelection();
    else if (document.getSelection) selection = document.getSelection();
    else if (document.selection) selection = document.selection.createRange().text;
    return selection
  }

  const Enter = (e)=>{
    e.preventDefault(); 
    if(TextRef.selected === undefined) return

    // cuts current line
    let index = parseInt(e.target.dataset.index)
    let selection = setSelection()
    addUndo()
    let allText = TextRef.current.childNodes[index].innerText
    let a = allText.slice(0, selection.baseOffset)
    let b = allText.slice(selection.extentOffset)
    
    TextRef.current.childNodes[index].innerHTML = regexText(a)
    
    //saves new text
    let oldList = saveParagraph()
    let list = [...oldList]

    //create new line
    let id = Math.random()
    list.splice(index+1, 0, {id: id, text: b, style: {
      fontFamily: TextRef.current.childNodes[index].style.fontFamily,
      fontSize: TextRef.current.childNodes[index].style.fontSize,
      margin: TextRef.current.childNodes[index].style.margin,
      display: TextRef.current.childNodes[index].style.display,
      backgroundColor: TextRef.current.childNodes[index].style.backgroundColor,
      color: TextRef.current.childNodes[index].style.color,
    }})
    //select
    TextRef.selected = id
    //refresh
    setParagraphList(list)
  }

  const DeleteLine = (e)=>{
    if(e.target.dataset.index !== "0") {
      let index = parseInt(e.target.dataset.index)
      let selection = setSelection()
      if(selection.baseOffset === selection.extentOffset && selection.baseOffset === 0){
        e.preventDefault()
        addUndo()
        let list = [...paragraphList]
        list[index-1].text += e.target.innerText
        list.splice(index, 1)
        setParagraphList(list)

        TextRef.selected = paragraphList[index -1].id
        TextRef.selectedIndex = e.target.previousSibling?.innerText?.length
      }
    }
  }

  const moveToLine = (e, direction)=>{
    e.preventDefault()
    let selection = setSelection()

    let index = parseInt(e.target.dataset.index) + direction
    if(index < 0) index = 0
    else if(index > paragraphList.length -1) index = paragraphList.length -1
    let idToSelect = paragraphList[index].id

    focus(idToSelect, selection.anchorOffset)
  }

  const select = (id)=>{
    saveParagraph()
    TextRef.selected = id
    let index = getSelectedIndex(id)
    HeadRef.current.lastChild.children[2].firstChild.value = TextRef.current.childNodes[index].style.fontFamily
    HeadRef.current.lastChild.children[2].children[1].value = TextRef.current.childNodes[index].style.fontSize
    HeadRef.current.lastChild.children[4].children[3].classList.toggle("active", TextRef.current.childNodes[index].style.display === "list-item")
  }


  const undo = (e) => {
    e.preventDefault()
    if (TextRef.undo.length === 0) return

    toggleHistory(1, false)

    TextRef.redo.push(TextRef.undo[TextRef.undo.length - 1])
    let text = TextRef.undo[TextRef.undo.length - 1].text
    let selection = TextRef.undo[TextRef.undo.length - 1].selection

    let regex = text.replace(/<p(.*?)>(.*?)<\/p>/g, "$2|")
    let splited = regex.split("|")

    for(let i=0; i<paragraphList.length; i++) {
      let str = splited[i] === undefined ? "" : regexText(splited[i])
      TextRef.current.childNodes[i].innerHTML = str
      paragraphList[i].text = str
    }
    TextRef.undo.pop()

    if (TextRef.undo.length === 0) return toggleHistory(0, true)
    else if (TextRef.redo.length > 10) TextRef.redo.shift()

    resetCount()
    focus(selection.id, selection.index)
  }
  const redo = (e) => {
    e.preventDefault()
    if (TextRef.redo.length === 0) return

    toggleHistory(0, false)

    TextRef.undo.push(TextRef.redo[TextRef.redo.length - 1])
    let text = TextRef.redo[TextRef.redo.length - 1].text
    let selection = TextRef.redo[TextRef.redo.length - 1].selection
    let regex = text.replace(/<p(.*?)>(.*?)<\/p>/g, "$2|")
    let splited = regex.split("|")

    for(let i=0; i<paragraphList.length; i++) {
      TextRef.current.childNodes[i].innerHTML = regexText(splited[i])
      paragraphList[i].text = splited[i]
    }
    TextRef.redo.pop()

    if (TextRef.undo.length > 10) TextRef.undo.shift()
    if (TextRef.redo.length === 0) return toggleHistory(1, true)

    resetCount()
    focus(selection.id, selection.index)
  }


  const addTags = (Tag) => {
    let selection = setSelection()
    if(selection.baseNode === selection.extentNode && selection.extentOffset === selection.baseOffset) return
    let index = getSelectedIndex(TextRef.selected)
    addUndo()

    let [lower, upper] = [selection.baseOffset, selection.extentOffset]

    let dif = lower < upper ? 1 : 0

    selection.baseNode.data = selection.baseNode.data.slice(0, lower) + Tag + selection.baseNode.data.slice(lower)
    selection.extentNode.data = selection.extentNode.data.slice(0, upper+dif) + Tag + selection.extentNode.data.slice(upper+dif)

    TextRef.current.childNodes[index].innerHTML = regexText(TextRef?.current?.childNodes[index]?.innerHTML, false)
    
    resetCount()
    focus()
  }
  // const addComplexTags = (Tag) => {
  //   let selection = setSelection()
  //   if(selection.baseNode === selection.extentNode && selection.extentOffset === selection.baseOffset) return
  //   let index = getSelectedIndex(TextRef.selected)
  //   addUndo()

  //   let [lower, upper] = [selection.baseOffset, selection.extentOffset]

  //   let dif = lower < upper ? 1 : 0

  //   selection.baseNode.data = selection.baseNode.data.slice(0, lower) + Tag + selection.baseNode.data.slice(lower)
  //   selection.extentNode.data = selection.extentNode.data.slice(0, upper+dif) + Tag + selection.extentNode.data.slice(upper+dif)

  //   TextRef.current.childNodes[index].innerHTML = regexText(TextRef?.current?.childNodes[index]?.innerHTML, false)
    
  //   resetCount()
  //   focus()
  // }
  const addIcon = (icon) => {
    let selection = setSelection()
    let index = getSelectedIndex(TextRef.selected)
    addUndo()
    let allText = TextRef?.current?.childNodes[index]?.innerText
    
    let selectedText = selection.baseOffset === selection.extentOffset ?
    undefined
    : selection.baseNode.data.slice(selection.baseOffset, selection.extentOffset)
    
    TextRef.current.childNodes[index].innerHTML = regexText(selectedText !== undefined ? allText.replace(selectedText, icon) : allText.slice(0, selection.baseOffset) + icon + allText.slice(selection.baseOffset))

    resetCount()
    focus()
  }

  const switchUpperCase = () => {
    let selection = setSelection()
    let index = getSelectedIndex(TextRef.selected)
    let allText = TextRef?.current?.childNodes[index]?.innerText
    addUndo()

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

    TextRef.current.childNodes[index].innerHTML = regexText(allText.replace(selectedText, newStr))

    resetCount()
    focus()
  }

  const cleanFormat = ()=>{
    addUndo()
    let index = getSelectedIndex(TextRef.selected)
    let text = TextRef?.current?.childNodes[index]?.innerText

    TextRef.current.childNodes[index].innerHTML = text
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
    else if (e.key === "Enter") Enter(e)
    else if (e.key === "Control") return
  }

  const checkPrevents = e => {
    if ((e.ctrlKey && (e.key === "z" || e.key === "y"))|| e.key === "Enter") e.preventDefault()
    else if (e.key === "Backspace") DeleteLine(e)
    else if(e.key === "ArrowUp") moveToLine(e, -1)
    else if(e.key === "ArrowDown") moveToLine(e, 1)
    else if (!e.ctrlKey && !e.shiftKey) addUndo()
  }

  React.useEffect(() => {
    TextRef.undo = []
    TextRef.redo = []
    focus()
  }, [])

  React.useEffect(()=>{
    focus()
    if(TextRef.undo.length !== 0) toggleHistory(0, false)
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
    size: (size)=>{
      let index = getSelectedIndex(TextRef.selected)
      TextRef.current.childNodes[index].style.fontSize = size
      saveParagraph()
    },
    font: (font)=>{
      let index = getSelectedIndex(TextRef.selected)
      TextRef.current.childNodes[index].style.fontFamily = font
      saveParagraph()
    },
    upper: switchUpperCase,
    align: (position)=>{
      let index = getSelectedIndex(TextRef.selected)
      TextRef.current.childNodes[index].style.margin = position
      saveParagraph()
    },
    list: (bool)=>{
      let index = getSelectedIndex(TextRef.selected)
      TextRef.current.childNodes[index].style.display = bool ? "list-item" : "block"
      saveParagraph()
    },
    background: (color)=>{
      let index = getSelectedIndex(TextRef.selected)
      TextRef.current.childNodes[index].style.backgroundColor = color
      saveParagraph()
    },
    color: (color)=>{
      let index = getSelectedIndex(TextRef.selected)
      TextRef.current.childNodes[index].style.color = color
      saveParagraph()
    },
    new: ()=>{
      setParagraphList([{id: "0", text: "", style: {fontFamily: "Arial",fontSize: "15px", margin: "0", backgroundColor: "transparent", color: "black"}}])
      TextRef.undo = []
      TextRef.redo = []
      toggleHistory(0, true)
      toggleHistory(1, true)
      resetCount(0)
      focus()
    },
    format: cleanFormat,
  }

  return <section className='main'>
    <Header HeadRef={HeadRef} options={config} setConfig={setConfig} functions={optionsFunctions} />
    <div
      className='text-editor'
      data-count={"0 / 1000"}
      ref={TextRef}
    >
      {paragraphList.map((p, i)=>{
        return <p 
          style={p.style}
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
