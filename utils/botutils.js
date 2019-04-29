const lang = require('../config/lang.json');
const config = require('../config/config.json');


function isCommand(str) {
    return isCommandPrefix(str.split(" ")[0].toLowerCase());
}

function isCommandPrefix(str) {
    return lang.cmd.prefix.includes(str);
}

function isCommandMsg(msg) {
    return isCommand(msg.content)
}

function permissionCheck(commandName, msg) {
    if (lang.commands[commandName].permissions[0] === "all") {
        return true
    }
    for (let permissionsKey of lang.commands[commandName].permissions) {
        if (config.users_groups[permissionsKey].includes(msg.author.username.toLowerCase())) {
            return true;
        }
    }
    return false;
}

function format(msg) {
    const msgSplit = msg.content.split(" ");
    if (msgSplit[1] === "sudo") {
        const prefix = msgSplit.shift();
        msgSplit.shift();
        return {
            sudo: true,
            prefix: prefix,
            args: msgSplit,
        }
    } else {
        return {
            sudo: false,
            prefix: msgSplit.shift(),
            args: msgSplit,
        }
    }
}

function getCommand(str) {
    for (const cmd of Object.keys(lang.commands)) {
        if (lang.commands[cmd].shortcuts.includes(str)) {
            return cmd;
        }
    }
    return false;
}
function validateMsg(str) {
    return true;
}

module.exports = {
    isCommand,
    isCommandMsg,
    isCommandPrefix,
    format,
    getCommand,
    permissionCheck,
    validateMsg
};