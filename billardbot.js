const Discord = require("discord.js");
const bot = new Discord.Client();
const token = "ToKeN";

const OPINION_LIKE = 1
const OPINION_NEUTRAL = 2
const OPINION_HATE = 3
const OPINION_FEAR = 4

var language = "en"; // english by default cuz yeah

function ValidLanguage(str)
{
	if (lang[str.toLowerCase()])
	{
		return str.toLowerCase();
	}

	return "en"; // idk
}

const TranslateLanguageNameToSomethingReadable = { // A+ naming conventions
	["en"]:"English",
	["es"]:"Español (Spanish)",
	["fr"]:"Français (French)",
	["cn"]:"中文 (Chinese)",
	["jp"]:"日本語 (Japanese)",
	["ru"]:"Pусский (Russian)",
}

function ReadableLanguageName(str)
{
	if !(TranslateLanguageNameToSomethingReadable[str.toLowerCase()])
	{
		return "Unknown";
	}

	return TranslateLanguageNameToSomethingReadable[str.toLowerCase()];
}

const lang = { // put all strings in here eventually
	["en"]:{
		error_generic:[
			"Error",
			"Generic error",
		],
		lang_missing:[
			"Language string missing",
			"Bad language string",
			"Nonexistant language string",
		],
	}
}

var opinions = {
	preset:{
		["joseph stalin"]:OPINION_LIKE,
		["josef stalin"]:OPINION_LIKE,
		["josef"]:OPINION_LIKE,
		["stalin"]:OPINION_LIKE,
		["my mother"]:OPINION_LIKE,
		["your mother"]:OPINION_LIKE,
		["adolf hitler"]:OPINION_NEUTRAL,
		["adolf"]:OPINION_NEUTRAL,
		["hitler"]:OPINION_NEUTRAL,
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
			"I love {thing}.",
			"{thing} is pretty good!",
			"I like {thing}."
		],
		[OPINION_NEUTRAL]:[
			"{thing} is alright.",
			"{thing} is okay.",
			"{thing} is fine, not great though.",
			"I don't mind {thing}.",
			"I'm alright with {thing}."
		],
		[OPINION_HATE]:[
			"{thing} is a fucking weeb.",
			"Fuck {thing}.",
			"{thing} can suck a bag of donkey dicks.",
			"I hate {thing}.",
			"{thing} can eat my ass."
		],
		[OPINION_FEAR]:[
			"{thing} creeps me out.",
			"{thing} creeps me the fuck out.",
			"{thing} is spooky.",
			"Get me away from {thing}.",
			"Get me the fuck away from {thing}."
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
	// "places the barrel of a revolver on their tongue.",
	// "presses a revolver to their temple.",
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

var beheading_images = [
	"https://i.imgur.com/hHQ4vEu.gifv",
	"https://i.imgur.com/eY9kEc5.gifv",
	"https://i.imgur.com/ZYADxx4.gifv",
	"https://i.imgur.com/J37kqjN.gifv"
];

var gay_kisses = [
	"https://i.imgur.com/jaldFcg.gifv",
	"https://i.imgur.com/o0Wt5jV.gifv",
	"https://i.imgur.com/WP07gNq.gifv",
	"https://i.imgur.com/AbUVaRY.gifv",
	"https://i.imgur.com/3hd4wvc.gifv",
	"https://i.imgur.com/dWl2fk1.gifv",
	"https://i.imgur.com/XcyZN4T.gifv"
];

var not_my_problem = [
	"https://i.imgur.com/pI61TL6.gifv"
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

const song_list = [
	{url:"kaibobertsidk", tags:["kai_roberts"]},
	{url:"RBF - Sayonara Senorita", tags:["rbf", "trumpet"]},
	{url:"RBF - Everyone Else is an Asshole", tags:["rbf", "comedy"]},
	{url:"Dusty Brown - This City is Killing Me", tags:["depressing", "piano"]},
	{url:"Proleter - Faidherbe Square", tags:["swing"]},
	{url:"Lore, Lore", tags:["deutschland"]},
	{url:"Sir Francis Billard - Agar Holmes: The Final Chapter", tags:["best"]},
	{url:"Carpenter Brut - Paradise Warfare", tags:["synth"]},
	{url:"El Huervo - Daisuke", tags:["chill"]},
	{url:"El Huervo - Rust", tags:["chill"]},
	{url:"Scattle - Bloodline", tags:["pardo"]},
	{url:"Men at Work - Down Under", tags:["meme"]},
];

function ArrayHasValue(arr, val)
{
	return arr.indexOf(val) != -1
}

function MatchingTags(a, b, i)
{
	if !(i)
	{
		i = 0;
	}
	if !(b[i])
	{
		return false;
	}
	if (ArrayHasValue(a, b[i]))
	{
		return true;
	}
	return MatchingTags(a, b, i + 1)
}

function SuggestSongsBasedOnTags(tags, got_songs, on_index)
{
	if !(got_songs)
	{
		got_songs = [];
	}
	if !(on_index)
	{
		on_index = 0;
	}
	if !(song_list[on_index])
	{
		return got_songs;
	}
	if MatchingTags(song_list[on_index].tags, tags)
	{
		tags.push(on_index)
	}
	return SuggestSongsBasedOnTags(tags, got_songs, on_index + 1);
}

var changelog = "BillardBot 2.0: Billboy Edition\nChangelog:\n-Song suggestions (.suggestsong)\n-More opinion statements"

bot.on("ready", () =>
{
	// say the changelog in general or something idk
});

var command_prefix = "."; // make a way to change this or something idk

var bot_commands = [
	{command:"echo", func:function(msg, txt){msg.channel.send(txt)}},
	{command:"changeprefix", func:function(msg, txt){command_prefix = txt[1]}} // wew
];

// hopefully a more efficient method of adding commands
function LoopForBotCommand(msg, txt, i)
{
	if !(i)
	{
		i = 0;
	}
	if !(bot_commands[i])
	{
		return;
	}
	var cmd = bot_commands[i].command;
	if !(bot_commands[i].no_prefix)
	{
		cmd = "." + cmd;
	}
	if (txt[0].toLowerCase() == cmd.toLowerCase())
	{
		return bot_commands[i].func(msg, txt);
	}
	return LoopForBotCommand(msg, txt, i + 1)
}

bot.on("message", message =>
{
	var txt = message.content.split(" ");
	LoopForBotCommand(message, txt)
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
		var name = message.member.nickname || message.author.username;
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
		var bad_thing = message.content.slice(8);
		var name = message.member.nickname || message.author.username;
		message.channel.send(name + " beheads " + bad_thing + "\n" + beheading_images[Math.floor(Math.random() * beheading_images.length)]);
	}
	else if (txt[0].toLowerCase() == ".kiss")
	{
		var good_thing = message.content.slice(6);
		var name = message.member.nickname || message.author.username;
		message.channel.send(name + " kisses " + good_thing + "\n" + gay_kisses[Math.floor(Math.random() * gay_kisses.length)]);
	}
	else if (txt[0].toLowerCase() == ".noneofmybusiness")
	{
		message.channel.send(not_my_problem[Math.floor(Math.random() * not_my_problem.length)]);
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
	else if (txt[0].toLowerCase() == ".language" && txt.length == 1)
	{
		message.channel.send("Current language: " + ReadableLanguageName(language));
	}
});

bot.login(token);
