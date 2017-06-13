const Discord = require("discord.js");
const bot = new Discord.Client();
const token = "MzI0MDYyODUzNDc4ODc1MTQx.DCEOmA.55VzXZ2oQ6uQQLkP1oWMsQdmDew";

var billard = {
	commands:{}
};

const OPINION_LIKE = 1
const OPINION_NEUTRAL = 2
const OPINION_HATE = 3
const OPINION_FEAR = 4

var opinions = {
	preset:{
		["adolf hitler"]:OPINION_LIKE,
		["adolf"]:OPINION_LIKE,
		["hitler"]:OPINION_LIKE,
		["my mother"]:OPINION_LIKE,
		["your mother"]:OPINION_LIKE,
		["4chan"]:OPINION_NEUTRAL,
		["pol"]:OPINION_NEUTRAL,
		["trump"]:OPINION_NEUTRAL,
		["donald trump"]:OPINION_NEUTRAL,
		["league"]:OPINION_HATE,
		["lol"]:OPINION_HATE,
		["league of legends"]:OPINION_HATE,
		["fidget spinners"]:OPINION_HATE,
		["hillary clinton"]:OPINION_HATE,
		["hillary"]:OPINION_HATE,
		["clinton"]:OPINION_HATE,
		["tayte"]:OPINION_HATE,
		["deep water"]:OPINION_FEAR,
		["spider"]:OPINION_FEAR,
		["spiders"]:OPINION_FEAR,
		["bug"]:OPINION_FEAR,
		["bugs"]:OPINION_FEAR,
		["tayte"]:OPINION_FEAR
	},
	responses:{
		[OPINION_LIKE]:[
			"I quite like {thing}.",
			"{thing} is great!",
			"I love {thing}."
		],
		[OPINION_NEUTRAL]:[
			"{thing} is alright.",
			"{thing} is okay.",
			"{thing} is fine, not great though."
		],
		[OPINION_HATE]:[
			"{thing} is a fucking weeb.",
			"Fuck {thing}.",
			"{thing} can suck a bag of donkey dicks."
		],
		[OPINION_FEAR]:[
			"{thing} creeps me the fuck out.",
			"{thing} is honestly scary.",
			"Get me away from {thing}."
		]
	},
	generated:{}
};

function GenerateOpinion(thing)
{
	if (typeof opinions.preset[thing] == "number")
	{
		return opinions.preset[thing];
	}

	if (typeof opinions.generated[thing] == "number")
	{
		return opinions.generated[thing];
	}
	else
	{
		var opinion = Math.floor(Math.random() * 4) + 1;
		opinions.generated[thing] = opinion;
		return opinion;
	}

	return OPINION_HATE;
}

// Hook on to the ready event
bot.on("ready", () =>
{

});

// Hook on the the message event
bot.on("message", message =>
{
	var txt = message.content.split(" ");
	if (txt[0] == ".opinion")
	{
		var thing = "";
		for (i = 1; i < txt.length; i++) { 
			thing += " " + txt[i];
		}

		var opinion = GenerateOpinion(thing.toLowerCase());

		var str = opinions.responses[opinion][Math.floor(Math.random() * opinions.responses[opinion].length)];
		var reply = str.replace("{thing}", thing);

		message.reply(reply)
	}
});

// Initialize bot
bot.login(token);
