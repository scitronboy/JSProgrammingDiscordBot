const Discord = require('discord.js');
const DBL = require('dblapi.js');
const usersRepo = require('./repos/usersRepo');
const config = require('./config/config.json');
const lang = require('./config/lang.json');
const commands = require('./config/commands.js').commands;
const utils = require('./utils/botutils.js');
const client = new Discord.Client();
const request = require('request');

var acceptMessages = false;
var lastJavaSucks = 0;
function getConnectedServerIds() {
    return client.guilds.keyArray();
}

function updateConnectedServers(serverCount) {
    client.user.setPresence({
        game: {
            name: `Selling Your Data`,
            type: 'Streaming',
            url: 'https://facebook.com'
        }
    });
}

function canReply(msg) {
    return msg.guild
        ? msg.channel.permissionsFor(msg.guild.me).has('SEND_MESSAGES')
        : true;
}

client.on('ready', () => {
    var channel = client.channels.find("name","bot-fun");

    var userTag = client.user.tag;
    console.log(lang.log.login.replace('{USER_TAG}', userTag));

    var serverIds = getConnectedServerIds();
    usersRepo.connectServers(serverIds);

    var serverCount = serverIds.length;
    updateConnectedServers(serverCount);
    console.log(
        lang.log.connectedServers.replace('{SERVER_COUNT}', serverCount)
    );

    acceptMessages = true;
    console.log(lang.log.startupComplete);
    channel.send('I am alive! Here\'s a fun fact');
    request('http://randomuselessfact.appspot.com/random.json?language=en',{json: true},(err,res,body) =>{
        channel.send(body.text);
    });
});

client.on('message', msg => {
    if (!acceptMessages || msg.author.bot || !canReply(msg)) {
        return;
    }
    if(!utils.isCommandMsg(msg)){ /* is a command */
        if(msg.content.toLowerCase().includes("java") &&  Date.now() - lastJavaSucks > 600){
            lastJavaSucks = Date.now();
            msg.channel.send(`Hey ${msg.author}...`);
            setTimeout(() => msg.channel.send(`Did you know...`), 1500);
            setTimeout(() => msg.channel.send(`__***3 BILLION DEVICES RUN JAVA***__`), 2000);
        }
        return;
    }
    const command = utils.format(msg);
    const commandName = utils.getCommand(command.args[0].toLowerCase());
    if(!commandName){
        commands.sendHelp(msg);
        return;
    }
    commands[commandName](msg,command.args.slice(1),client);
});

client.on('guildCreate', guild => {
    usersRepo.connectServer(guild.id);
    var serverCount = getConnectedServerIds().length;
    updateConnectedServers(serverCount);
    console.log(
        lang.log.serverConnected
            .replace('{SERVER_NAME}', guild.name)
            .replace('{SERVER_ID}', guild.id)
            .replace('{SERVER_COUNT}', serverCount)
    );
});

client.on('guildDelete', guild => {
    var serverCount = getConnectedServerIds().length;
    updateConnectedServers(serverCount);
    console.log(
        lang.log.serverDisconnected
            .replace('{SERVER_NAME}', guild.name)
            .replace('{SERVER_ID}', guild.id)
            .replace('{SERVER_COUNT}', serverCount)
    );
});

client.on('error', error => {
    console.error(lang.log.clientError);
    console.error(error);
});

client.login(config.token).catch(error => {
    console.error(lang.log.loginFailed);
    console.error(error);
});

if (config.discordBotList.enabled) {
    const dbl = new DBL(config.discordBotList.token, client);

    dbl.on('posted', () => {
        console.log(lang.log.dblServerCountPosted);
    });

    dbl.on('error', error => {
        console.error(lang.log.dblError);
        console.error(error);
    });
}