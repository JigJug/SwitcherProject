import { io } from "socket.io-client"
import * as readline from "readline"
import { stdin as input, stdout as output } from "process"
import { IpcMainEvent } from "electron/main"

class SwitcherClient1 {

    event

    constructor(event: IpcMainEvent){
        this.event = event
    }

    startListening(){
        //const rl = readline.createInterface({ input, output });
        const socket = io('http://localhost:3000');

        //connect to server and send hello
        socket.on('connect', () => {
            console.log(`Client connected: ${socket.connected} - with socket ID: ${socket.id}`);
            socket.emit('app', 'hello from client');
        });

        //data listener
        socket.on('data', (data) => {
            console.log('Client recieved data: ', data)
        });

        //messages listener
        socket.on('messages', (msg) => {
            console.log(`messages from server: ${msg}`)
        });
    }

}




//set up messages to send to server on the command channel
//function start(){
//    return rl.question('send cmd: ', (answer) => {
//       socket.emit('command', answer)
//        if(answer == 'quit') return socket.close();
//    });
//}
//start();



export function switcherClient(event: IpcMainEvent){
    //const rl = readline.createInterface({ input, output });
    const socket = io('http://localhost:3000');

    //connect to server and send hello
    socket.on('connect', () => {
        console.log(`Client connected: ${socket.connected} - with socket ID: ${socket.id}`);
        socket.emit('app', 'hello from client');
    });

    //data listener
    socket.on('data', (data) => {
        console.log('Client recieved data: ', data)
        event.sender.send('commands', data);
    });

    //messages listener
    socket.on('messages', (msg) => {
        console.log(`messages from server: ${msg}`)
        event.sender.send('commands', msg);
    });
}