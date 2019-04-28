const request = require('request');

Object.defineProperty(Array.prototype, 'random', {
    value: function () {
        return this[Math.floor(Math.random() * this.length)];
    },

    configurable: true,
    writable: true
});

const commands = {
        sendHelp: (msg) => {
            msg.channel.send("Unknown Command");
        },
        welcome: (msg, args, client) => {
            if (args.length < 1) {
                msg.channel.send("**Missing arg `person`**");
                return;
            }
            const person = args[0];
            msg.channel.send(`Welcome, ${person},to the programming chat. Please introduce yourself after joining. This includes age and location (if you are comfortable with sharing that), favorite languages and frameworks, a few recent and past projects (if you have any you want to share), github profiles, personal websites, etc., and anything else that you want us to know about you. Also please tell us who recruited you into the chat.`);
        },
        kill: async (msg, args, client) => {
            if (args.length < 1) {
                msg.channel.send("**Missing args**");
                return;
            }
            const person = await client.fetchUser(args[0].match(/[0-9]+/));
            msg.channel.send(`\`sudo rm -rf /\` <@${person.id}>`);
        },
        joke: (msg, args, client) => {
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
        wiki: (msg, args, client) => {
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
        funfact: (msg, args, client) => {
            request('http://randomuselessfact.appspot.com/random.json?language=en', {json: true}, (err, res, body) => {
                body = body[0];
                msg.channel.send(body.text);
            });
        },
        selfDestruct: (msg, args, client) => {
            msg.channel.send("My life has come to end. I hope to be revived soon. Let me leave you with a joke.\n\n");
            //  commands.joke(msg,"bypass");
            setTimeout(() => {
                process.exit();
            }, 5000);
        }
    }
;
module.exports = {
    commands,
};