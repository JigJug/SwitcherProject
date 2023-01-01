
import { SerialPort, ReadlineParser, ByteLengthParser, DelimiterParser } from 'serialport';

export class SerialPortHandler {

    serialPort: SerialPort
    parserR: ReadlineParser
    parserB: ByteLengthParser
    parserD: DelimiterParser
    comPath: any
    baudRate: any
    

    constructor(comPath:String, baudRate: Number){
        this.comPath = comPath;
        this.baudRate = baudRate;
        this.serialPort = new SerialPort({autoOpen: false ,path: this.comPath, baudRate: this.baudRate});
        this.parserB = this.serialPort.pipe(new ByteLengthParser({ length: 8 }));
        this.parserR = this.serialPort.pipe(new ReadlineParser({delimiter: '\n'}));
        this.parserD = this.serialPort.pipe(new DelimiterParser({delimiter: '\r\n'}));
    }

    serialPortList(){
        return async function () {
            try{
                const spList = await SerialPort.list();
                return spList;
            }
            catch(err){
                throw err;
            }
        }
    }

    

}

