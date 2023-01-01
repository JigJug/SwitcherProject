import { ipcMain, IpcMessageEvent, ipcRenderer } from 'electron';
//const ipcRenderer = require('electron').ipcRenderer;

const pageState = {
  com: null,
  ipOpToggle: true,
  switcherNumber: 0,
  relayNumber: 0

}

function addIdsToSpanClass(){
  const eles = document.getElementsByClassName("span");
  for(let i = 0; i < eles.length; i++){
    eles[i].id = `relay${i+1}`
  }
}

function sendMessage(channel: string, arg1: string, arg2: string, arg3: boolean | null, arg4: string){
  ipcRenderer.send(channel, arg1, arg2, arg3, arg4);
} 

window.onload = function () {

  addIdsToSpanClass();

  addClassIt(document.getElementsByClassName('span'), false)
  addClassIt(document.getElementsByClassName('ComDisplayButton'), false)
  addClassIt(document.getElementsByClassName('ComConnect'), false)
  addClassIt(document.getElementsByClassName('CloseSp'), false)
  ipcRenderer.send('RenderInit', 'true')
}



//function to add click listeners to buttons in html class
function addClassIt(eles: HTMLCollection, sideBar: boolean){
    for(let i = 0; i < eles.length; i++){
      (eles[i] as HTMLInputElement).onclick = () => {

        let info = '';
        let arg1 = '';
        let arg2 = null;
        let arg3 = '';

        let listener = eles[i].id

        if(listener === 'Connect') {
          info = monitorModeOnOFf(i, eles);
        }

        if(eles[i].getAttribute("data-id") === 'relay') {
          console.log('listener = '+listener)
          listener = 'relay'
          arg1 = 'relay'
          info = i.toString()
          arg2 = getOnAndOff(i, eles);
          console.log('arg2 = ' + arg2)
          arg3 = switcherNumberTracker(i, eles)
        }
        

        
        sendMessage(listener, info, arg1, arg2, arg3)
        console.log('working')

      }
    }
}

function monitorModeOnOFf(i: number, eles: HTMLCollection){
  let attribute = eles[i]?.getAttribute("data-montiormode");

  if(attribute == "off"){
    eles[i].setAttribute("data-montiormode", "on");
    return "close"
  }
  else{
    eles[i].setAttribute("data-montiormode", "off");
    return "open"
  }
}


function getOnAndOff(i: number, eles: HTMLCollection){

  let attribute = eles[i]?.getAttribute("data-toggle");
  console.log(attribute)

  let id = eles[i].id

  if(attribute == 'off') {
    eles[i].setAttribute("data-toggle", "on");

    if(i < 64) eles[i].className = "span inon"
    else eles[i].className = "span ouon"

    return true
  }
  else {
    eles[i].setAttribute("data-toggle", "off");

    if(i < 64) eles[i].className = "span in";
    else eles[i].className = "span ou";

    return false
  }
  
}

function switcherNumberTracker(i: number, eles: HTMLCollection){

  let switchNo = eles[i]?.getAttribute("data-switchno");

  if(switchNo) return switchNo

  return '';
}


// add listener for error messages
ipcRenderer.on('error', (event, msg) => {
    //dialog.showMessageBox({'message': msg});
    //getEles('id', 'errormessages').innerHTML = msg
    console.log('messages')
})

ipcRenderer.on('data', (event, com, name) => {
  pageState.com = com;
  document.getElementById('ComDisplay')!.innerHTML = `Found ${name} on ${com}`
});

ipcRenderer.on('info', (event, info) => {
  document.getElementById('info')!.innerHTML = `${info}`
});

ipcRenderer.on('commands', (event, data) => {

})

ipcRenderer.on('switcherterminal', (event, data) => {
  const ele = document.getElementById("switcherterminal");
  const newp = document.createElement("p");
  const tn = document.createTextNode(data);
  newp.appendChild(tn);
  ele?.appendChild(newp);
  document.getElementById("switcherterminal")?.scrollTop = document.getElementById("switcherterminal")?.scrollHeight;
})

ipcRenderer.on('spclosed', (event) => {
  //let eles = document.getElementsByClassName("XlrButtons");
  //for(let i = 0; i < eles.length; i++){
  //  let id = eles[i].id
  //  document.getElementById(id)?.style.backgroundColor = "#85a0a0"
  //}
})