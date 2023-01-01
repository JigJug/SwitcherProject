import { ipcMain } from "electron";
import { IpcMainEvent } from "electron/main";
import { switcherCommand } from "../configs/commands";
import { SerialPortHandler } from "./SerialPortHandler";


export function serialConnect(event:IpcMainEvent, com: string){

    return new Promise<void>((resolve, reject) => {

        let relayEvent: Electron.IpcMainEvent

        const sp = new SerialPortHandler(com, 115200);

        

        sp.serialPort.on('close', ()=> {
            console.log('sp close listener triggered')
            event.sender.send("spclosed")
            
        })

        sp.serialPort.on('error', (err) => {
            if(err){
                console.log(err)
                reject();
            }
        })

        sp.parserR.on('data', (data) => {
            console.log(data);
            event.sender.send('switcherterminal', data)
        })


        ipcMain.on('relay', (event, commandIndexNo, commandType, toggle, switcherNo) => {

            relayEvent = event

            sp.serialPort.write(`slave ${switcherNo}\r\n`)

            const command = switcherCommand(commandIndexNo, commandType, toggle);

            console.log(command);
            sp.serialPort.write(`${command}\r\n`);
        })

        ipcMain.on('Connect', (event, trigger) => {
            if(trigger === "open"){
                sp.serialPort.open((err) => {
                    if(err) reject();
                    console.log('sp opened')
                    setTimeout(() => {sp.serialPort.write('master\r\n')}, 3000)
                    setTimeout(() => {sp.serialPort.write('slave 0\r\n')}, 3500)
                    setTimeout(() => {sp.serialPort.write('bank 1 in\nbank 2 in\nbank 3 in\nbank 4 in\nbank 5 out\nbank 6 out\n')}, 3600)
                    setTimeout(() => {sp.serialPort.write('slave 1\r\n')}, 3700)
                    setTimeout(() => {sp.serialPort.write('bank 1 in\nbank 2 in\nbank 3 in\nbank 4 in\nbank 5 out\nbank 6 out\n')}, 3800)
                    event.sender.send('info', 'Serial Mode ON')
                })
            }
            else if(trigger === "close"){
                console.log('closingsp')
                sp.serialPort.close();
                event.sender.send('info', 'Monitor Mode')
            }
        })

        

        ipcMain.on('CloseSp', (event) => {
            //if(arg != 'true') return
            
            //resolve();
        })


    })

}

