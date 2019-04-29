const request = require('request');
const config = require('../config/config');
const cheerio = require('cheerio');
const utils = require('../utils/botutils');
const lang = require('../config/lang.json');
const DataSystem = require('../utils/fileUtils');

let data = new DataSystem({
    data_file: '../data/data.json',
});

Object.defineProperty(Array.prototype, 'random', {
    value: function () {
        return this[Math.floor(Math.random() * this.length)];
    },

    configurable: true,
    writable: true
});

const commandService = {
    sendHelp: (msg) => {
        msg.channel.send("Unknown Command. `!! help` for commands.");
    },
    mdn: (msg, args, client, sudo) => {
        if (args.length < 1) {
            msg.channel.send("**Missing args**");
            return;
        }
        console.log('https://www.google.com/search?q=' + encodeURI(args.join(" ")) + "%20site:developer.mozilla.org");
        request('https://www.google.com/search?q=' + args.join("%20") + "%20site:developer.mozilla.org", (err, res, body) => {
            try {
                const $ = cheerio.load(body);
                const url = $('.r').find('a').attr('href').replace('/url?q=', '').replace(/&sa=.*/, '');
                if(!url.match(/^https:\/\/developer\.mozilla.org\/.*$/)){
                    throw new Error('Invalid url ' + url);
                }
                msg.channel.send();
            } catch (e) {
                msg.channel.send('An error occurred with the request. Are you fucking with me?');
                console.error(e);
            }
        });
    },
    help: (msg, args, client, sudo) => {
        let exportText = "";
        Object.keys(lang.commands).forEach(e => {
            e = lang.commands[e];
            if (!e.ignore) {
                exportText += `\`${e.name}\` - **${e.args.toString()}** - ${e.description}\n`
            }
        });
        msg.channel.send(exportText);
    },
    welcome: (msg, args, client, sudo) => {
        if (args.length < 1) {
            msg.channel.send("**Missing arg `person`**");
            return;
        }
        const person = args[0];
        msg.channel.send(`Welcome, ${person},to the programming chat. Please introduce yourself after joining. This includes age and location (if you are comfortable with sharing that), favorite languages and frameworks, a few recent and past projects (if you have any you want to share), github profiles, personal websites, etc., and anything else that you want us to know about you. Also please tell us who recruited you into the chat.`);
    },
    status: (msg, args, client, sudo) => {
        msg.channel.send(`I am currently alive!`);
    },
    kill: async (msg, args, client, sudo) => {
        if (args.length < 1) {
            msg.channel.send("**Missing args**");
            return;
        }
        if (args[0] === "yourself" || args[0] === "self") {
            if (!utils.permissionCheck('selfDestruct', msg)) {
                msg.channel.send("Your are not authorized to administer this command");
                return;
            }
            commandService.selfDestruct(msg, args, client, sudo);
            return;
        }
        const person = await client.fetchUser(args[0].match(/[0-9]+/));
        msg.channel.send(`\`sudo rm -rf /\` <@${person.id}>`);
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        today = mm + '/' + dd + '/' + yyyy;
        const old_nicname = person.nickname;
        await msg.guild.members.get(person.id).setNickname('Died ' +  today);
        setTimeout(async () => {
            await msg.guild.members.get(person.id).setNickname(old_nicname);
        },300000);

    },
    joke: (msg, args, client, sudo) => {
        if (Math.random() <= 0.1 && args !== "bypass") {
            msg.channel.send(`${msg.author}'s code :wink:`);
            return;
        }
        request('https://official-joke-api.appspot.com/jokes/programming/random', {json: true}, (err, res, body) => {
            body = body[0];
            msg.channel.send(body.setup);
            setTimeout(() => {
                msg.channel.send(body.punchline)
            }, 2500);
        });
    },
    wiki: (msg, args, client, sudo) => {
        if (args.length < 1) {
            msg.channel.send("**Missing args**");
            return;
        }
        request('https://en.wikipedia.org/w/api.php?action=opensearch&limit=1&format=json&search=' + args.join("%20"), {json: true}, (err, response, resp) => {
            // the result will look like this:
            // [search_term, [title0], [description0], [link0]]
            // we only asked for one result, so the inner arrays will have only
            // 1 item each
            var res = resp[3][0],
                found = true;

            if (!res) {
                found = false;
                res = [
                    'No result found',
                    'The Wikipedia contains no knowledge of such a thing',
                    'The Gods of Wikipedia did not bless us'
                ].random();
            }
            msg.channel.send(res);
        });
    },
    funfact: (msg, args, client, sudo) => {
        request('http://randomuselessfact.appspot.com/random.json?language=en', {json: true}, (err, res, body) => {
            body = body[0];
            msg.channel.send(body.text);
        });
    },
    selfDestruct: (msg, args, client, sudo) => {
        if (!sudo) {
            msg.channel.send("Try `sudo`");
            return;
        }
        if(Math.random() <= 0.1){
            msg.channel.send("You don't own me bitch");
            return;
        }
        msg.channel.send("My life has come to end. I hope to be revived soon.");
        setTimeout(() => process.exit(), 1000);
    }
};
module.exports = {
    commands: commandService,
};