import { IpcMainEvent } from "electron/main"
import { getCom } from "./utils/serial/SerialGet"
import { app, BrowserWindow, autoUpdater, ipcMain} from 'electron'
import { startAutoUpdater } from "./utils/update";
import { switcherClient } from "./utils/socketio/sioclient";
import { serialConnect } from "./utils/serial/SerialConnect";

// For the update process
//if (require('electron-squirrel-startup')) app.quit();

function createWindow () {
  const win = new BrowserWindow({
    width: 1190,
    height: 470,

    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#2f3241',
      symbolColor: '#74b1be',
      height: 22
    },

    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })
  win.loadFile('indexNew.html')
}

async function serialComConnect(event: IpcMainEvent){
  try{
    const com = await getCom();
    await serialConnect(event, com);
  }catch(err){
    console.log(err)
  }
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('ready', () => {
  //startAutoUpdater();
  createWindow();
})

function quitF() {
  app.quit();
}




//Main app listeners

//start the client
ipcMain.once('RenderInit', (event: IpcMainEvent) => {
  switcherClient(event);
  console.log('switcher start');
  serialComConnect(event);
})

