import { SerialPortHandler } from "../utils/serial/SerialPortHandler"
import { CreateLogFile } from "./FsWriteFile";
import { timeStamp } from "./TimeStamp";
import { createServer } from "http";
import { Server, Socket } from "socket.io"

const httpServer = createServer();
httpServer.listen(3000)
const io = new Server(httpServer);

io.on("connection", (socket) => {
    //show we are connected and send a message to client
    console.log('io on');
    socket.emit('messages', 'hello from cmd app');

    //set a listener for messages from client
    socket.on('app', (msg) => {
        console.log(msg);
    })
    
    //listener for commands
    socket.on('command', (command) => {
        port.write(command + '\n', (err: any) => {
            if(err){
                console.log('error writing port.. ', err)
            }
        });
    })
    
});



//yargs
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const argv = yargs(hideBin(process.argv)).argv;
const ReadCmdLine = require('readline');
const rl = ReadCmdLine.createInterface({
    input: process.stdin,
    output: process.stdout
});


//set up serialport connection with sp handler
const sph = new SerialPortHandler(argv.com, 115200);
const port = sph.serialPort;
const parser = sph.parserR;


//set up log file
let andTime = timeStamp();
andTime = andTime.replace(':','').split(' ').join('');
const fullPath = "C:\\Data Files\\SwitcherCmd\\LogFiles\\ATSLog_" + argv.SerialNumber + "_" + andTime + ".text";
const logFile = new CreateLogFile(fullPath);



//send serial messages and retrieve data
function serialFunc() {
    // rather than emmiting an error the arduino emits an open message
    port.open(function (openMsg: any) {
        if (openMsg) {
            return console.log('Port on msg: ', openMsg.message);
        }
    });

    port.on('close', (err: any) => {
        //here we can catch any unintended disconnects and then catch that in vb script and tell them to wait or reconnect and run the test again.
        if(err){
            
            console.log("ERROR OCCURED:::: " + err.message)
            logFile.addLog("ERROR OCCURED:::: " + err.message);
            //rl.close();
        }
        if(err.disconneted == true){
            console.log("connection has unexpectedly disconnected");
        }
    })

    parser.on('data', function (data: any) {
        console.log(data);
        data = data.toString();
        logFile.addLog(data);

        //broadcast to all connected clients (should only be one)
        io.emit('data', data)
    
    });

    //for now wait 3 secs for the arduino to load before the commands are initated
    setTimeout(function () {
        messageFnc();
    }, 3000);
}


rl.on("close", function() {
    port.close();
    console.log("\nBYE BYE !!!");
    process.exit(0);
});


// set up messages and commandline prompt
function messageFnc(){
    rl.question('', (message: any) => {
        if(message == 'close'){
            rl.close()
            return
        }
        else{

            message = message + '\n';
            port.write(message, (err: any) => {

                if(err){
                    console.log('error writing port.. ', err)
                }
            });
            messageFnc();
        }
    });
}


//entry point
export function stratScript(){
    if(argv.SerInit == 'y') {
        logFile.writeLogFile();
        serialFunc();
    }
    else{
        console.log('not opening app sorry');
    }
}







