export function switcherCommand(commandIndexNo: number, commandType: string, toggle: boolean){

    const returncommand = getcommands();

    const commandFunction =  returncommand[commandType as keyof typeof returncommand];

    return commandFunction(commandIndexNo, commandType, toggle);
}




function getcommands(){
    return {
        relay: relayCommands,
        phant: phantomPower
    }
}




function relayCommands(commandIndexNo: number, commandType: string, toggle: boolean){

    return `${commandType} ${relayBankSelect(commandIndexNo)} ${relayNumberSelect(commandIndexNo)} ${toggleOnOff(commandType, toggle)}`
    
}


function toggleOnOff(commandType: string, toggle: boolean){

    if(commandType === "bank") {
        if(toggle) return "in";
        return "out"
    }

    if(toggle) return "1"
    return "0"
     
}

function relayBankSelect(commandIndexNo: number){

    let bank: string = '';
    console.log(commandIndexNo)

    //switcher 0
    bank = "1";
    if(commandIndexNo > 7 && commandIndexNo < 16) bank = "2";
    if(commandIndexNo > 31 && commandIndexNo < 40) bank = "3";
    if(commandIndexNo > 39 && commandIndexNo < 48) bank = "4";
    if(commandIndexNo > 63 && commandIndexNo < 72) bank = "5";
    if(commandIndexNo > 71 && commandIndexNo < 80) bank = "6";

    //switcher 1
    //if(commandIndexNo < (8+16)) bank = "1";
    if(commandIndexNo > (7+16) && commandIndexNo < (16+16)) bank = "2";
    if(commandIndexNo > (31+16) && commandIndexNo < (40+16)) bank = "3";
    if(commandIndexNo > (39+16) && commandIndexNo < (48+16)) bank = "4";
    if(commandIndexNo > (63+16) && commandIndexNo < (72+16)) bank = "5";
    if(commandIndexNo > (71+16) && commandIndexNo < (80+16)) bank = "6";

    console.log('bank = ' + bank)
    return bank

}

function relayNumberSelect(commandIndexNumber: number){

    commandIndexNumber++

    if(commandIndexNumber > 8 && commandIndexNumber < 17) commandIndexNumber -= 8;
    if(commandIndexNumber > 16 && commandIndexNumber < 25) commandIndexNumber -= 16;
    if(commandIndexNumber > 24 && commandIndexNumber < 33) commandIndexNumber -= 24;
    if(commandIndexNumber > 32 && commandIndexNumber < 41) commandIndexNumber -= 32;
    if(commandIndexNumber > 40 && commandIndexNumber < 49) commandIndexNumber -= 40;
    if(commandIndexNumber > 48 && commandIndexNumber < 57) commandIndexNumber -= 48;
    if(commandIndexNumber > 56 && commandIndexNumber < 65) commandIndexNumber -= 56;
    if(commandIndexNumber > 64 && commandIndexNumber < 73) commandIndexNumber -= 64;
    if(commandIndexNumber > 72 && commandIndexNumber < 81) commandIndexNumber -= 72;
    if(commandIndexNumber > 80 && commandIndexNumber < 89) commandIndexNumber -= 80;
    if(commandIndexNumber > 88) commandIndexNumber -= 88;

    return commandIndexNumber;

}



function phantomPower(){

}

