const timeUtils = require('../utils/timeUtils');
const regexUtils = require('../utils/regexUtils');
const usersRepo = require('../repos/usersRepo');
const config = require('../config/config.json');
const lang = require('../config/lang.json');

const internalDateFormat = 'YYYY-MM-DD';
const internalTimeFormat = 'h:mm A';

var helpMsg = lang.msg.help.join('\n');
var mapMsg = lang.msg.map.join('\n');
var inviteMsg = lang.msg.invite.join('\n');
var noTimezoneProvidedMsg = lang.msg.noTimezoneProvided.join('\n');
var invalidTimezoneMsg = lang.msg.invalidTimezone.join('\n');
var timezoneNotSetMsg = lang.msg.timezoneNotSet.join('\n');

function processMsg(msg) {
     msg.channel.send("Hi " + msg.author );
}
module.exports = {
    processMsg,
};
