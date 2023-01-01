import { IpcMainEvent } from "electron/main"
import { SerialPort} from 'serialport'

export async function getCom(event?: IpcMainEvent){

    let comPath = 'No Devices Found'

    try{

        const portInfo = await SerialPort.list();

        console.log(portInfo)

        const comPathArr = portInfo.filter((v) => {
            if(v.manufacturer?.indexOf('Arduino') != -1) return v
        });

        if(comPathArr.length == 0) {
            throw new Error(comPath)
        }
        comPath = comPathArr[0].path
        event?.sender.send('data', comPath, 'Arduino')
        return comPath

    }
    catch(err){
        console.log(err)
        throw err
    }
}