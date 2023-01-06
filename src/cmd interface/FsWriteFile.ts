import * as fs from 'fs'
import { timeStamp } from './TimeStamp'

export class CreateLogFile{

    fullPath

    constructor(fullPath: string){
        this.fullPath = fullPath;
    }

    //updating the array
    addLog(logToAdd: string) {

        //console.log("appending log file");
        let addTimeStamp = timeStamp();

        let logToAddStr = logToAdd.toString();
        let tsAndLtas = addTimeStamp + ":: " + logToAddStr + '\n';

        fs.appendFile(this.fullPath, tsAndLtas, (err) => {
            if (err) {
                console.log(err);
            }
        });
    }

    //rename file
    renameDir(serialNum: string) {

        let stSearchVal = this.fullPath.indexOf(serialNum)
        console.log('index of = ', stSearchVal);

        if(stSearchVal != -1){
            console.log("found same serial number")
            return
        }

        console.log("updating log name with serial number ")

        let oldPath = this.fullPath
        this.fullPath = this.fullPath + "_" + serialNum;
        let newPath = this.fullPath

        fs.rename(oldPath, newPath, (renameErr) => {
            if(renameErr){
                console.log(renameErr)
            }
        })
    }

    //write the log file
    writeLogFile() {
        console.log("creating log file")
        let addTimeStamp = timeStamp();
        fs.writeFile(this.fullPath, '*****log file created on ' + addTimeStamp + '*****\n\n', (err) => {
            if (err) {
                console.log(err);
            }
            console.log("file written");
        });
    }
}



