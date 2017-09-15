const Discord = require("discord.js");
const bot = new Discord.Client();
const token = "wew lad";

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
		["/pol/"]:OPINION_NEUTRAL,
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
		["bugs"]:OPINION_FEAR
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
			"{thing} is spooky.",
			"Get me away from {thing}."
		]
	},
	generated:{}
};

var bushisms = [
	"They misunderestimated me.",
	"I know the human being and fish can coexist peacefully.",
	"There's an old saying in Tennessee - I know it's in Texas, probably in Tennessee - thay says, 'Fool me once, shame on... shame on you. Fool me - you can't get fooled again.'",
	"Too many good docs are getting out of the business. Too many OB-GYNs aren't able to practice their love with women all across this country.",
	"We ought to make the pie higher.",
	"Rarely is the question asked; Is our children learning?",
	"If you teach a child to read, he or her will be able to pass a literacy test."
];

var roullette_start = [
	"places the barrel of a revolver on their tongue.",
	"presses a revolver to their temple.",
	"raises a gun to their head."
];

var roullette_finish = [
	"blows their brains across the pacific.",
	"vaporizes their skull and all of its contents.",
	"spreads their gray matter across four counties."
];

var takyon = [
	"TRIPLE SIX",
	"FIVE",
	"FORKED TONGUE",
	"SUBATOMIC PENETRATION RAPID FIRE THROUGH YOUR SKULL",
	"HOW I SHOT IT ON ONE TAKING IT BACK TO THE DAYS OF TRYING TO LOSE CONTROL",
	"SWERVING IN A BLAZE OF FIRE RAGING IN MY BONES",
	"OH SHIT I'M FEELING IT",
	"TAKYON",
	"HELL YEAH FUCK YEAH I FEEL LIKE KILLING IT",
	"TAKYON",
	"ALRIGHT THAT'S RIGHT WHAT IT'S LIKE TO EXPERIENCE",
	"TAKYON"
];

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
	if (txt[0].toLowerCase() == ".opinion")
	{
		var thing = "";
		for (i = 1; i < txt.length; i++) { 
			thing += " " + txt[i];
		}
		thing = thing.substring(1);

		var opinion = GenerateOpinion(thing.toLowerCase());

		var str = opinions.responses[opinion][Math.floor(Math.random() * opinions.responses[opinion].length)];
		var reply = str.replace("{thing}", thing);

		message.channel.send(reply);
	}
	else if (txt[0].toLowerCase() == ".roll")
	{
		var min = Number(txt[1]) || 1;
		var max = Number(txt[2]) || 6;

		var num = Math.floor(Math.random() * (max - min + 1)) + min;

		message.channel.send("You rolled a " + num + ".");
	}
	else if (txt[0].toLowerCase() == ".russian")
	{
		var rando = Math.floor(Math.random() * 6) + 1;
		var name = message.member.nickname || message.author.username
		message.channel.send(name + " " + roullette_start[Math.floor(Math.random() * roullette_start.length)]);
		if (rando == 1)
		{
			message.channel.send("*BANG*");
			message.channel.send(name + " " + roullette_finish[Math.floor(Math.random() * roullette_finish.length)]);
		}
		else
		{
			message.channel.send("*CLICK*");
		}
		
	}
	else if (txt[0].toLowerCase() == ".takyon")
	{
		var lyrics = "";
		for (var i = 0; i < takyon.length; i++) {
			lyrics += takyon[i] + "\n"
		}
		message.channel.send(lyrics)
	}
	else if (txt[0].toLowerCase() == ".suicide")
	{
		message.channel.send("ur ded now\nrip");
	}
	else if (txt[0].toLowerCase() == ".behead")
	{
		if (message.mentions.members.first(1))
		{
			var kiddo = message.mentions.members.first(1);
		}
	}
	else if (txt[0].toLowerCase() == ".bushism")
	{
		message.channel.send("\"" + bushisms[Math.floor(Math.random() * bushisms.length)] + "\"\n- George W. Bush");
	}
	else if (txt[0].toLowerCase() == ".startvote")
	{
		var yeah = "yeah";
	}
	else if (txt[0] == "WEW" && txt.length == 1)
	{
		message.channel.send("LAD");
	}
	else if (txt[0].toLowerCase() == "wew" && txt.length == 1)
	{
		message.channel.send("lad");
	}
	else if (txt[0].toLowerCase() == "ding" && txt[1].toLowerCase() == "dong" && txt.length == 2)
	{
		message.channel.send("your opinion is wrong");
	}
});

// Initialize bot
bot.login(token);
