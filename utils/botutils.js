const lang = require('../config/lang.json');

function isCommand(str) {
    return isCommandPrefix(str.split(" ")[0].toLowerCase());
}

function isCommandPrefix(str) {
    return lang.cmd.prefix.includes(str);
}

function isCommandMsg(msg) {
    return isCommand(msg.content)
}

function format(msg) {
    const msgSplit = msg.content.split(" ");
    return {
        prefix: msgSplit.shift(),
        args: msgSplit,
    }
}
function getCommand(str){
    for (const cmd of Object.keys(lang.commands)) {
       if(lang.commands[cmd].includes(str)){
          return cmd;
       }
    }
    return false;
}
module.exports = {
    isCommand,
    isCommandMsg,
    isCommandPrefix,
    format,
    getCommand
};