// BillardBot 3.3 - Kinda Shittier Edition
// Vulgarity warning: this bot is approved by George Carlin
// https://www.youtube.com/watch?v=vbZhpf3sQxQ

const Discord = require("discord.js");
const bot = new Discord.Client();
const token = process.env.BOT_TOKEN; // for Heroku, change to token if not using Heroku

const OPINION_LIKE = 1;
const OPINION_NEUTRAL = 2;
const OPINION_HATE = 3;
const OPINION_FEAR = 4;

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
	["en"]: "English",
	["es"]: "Español (Spanish)",
	["fr"]: "Français (French)",
	["cn"]: "(Chinese)",
	["jp"]: "(Japanese)",
	["ru"]: "(Russian)"
};

function ReadableLanguageName(str)
{
	if (!TranslateLanguageNameToSomethingReadable[str.toLowerCase()])
	{
		return "Segmentation fault"; // i mean yeah kinda
	}

	return TranslateLanguageNameToSomethingReadable[str.toLowerCase()];
}

const lang = {
	["en"]: {
		error_generic: "Unknown error",
		lang_missing: "Bad language string",
		invalid_language: "Invalid language",
		under_construction: "This part's not done yet, sorry.",
		language_set: "Language set to {language}.",
		opinion_responses: {
			[OPINION_LIKE]: [
				"I quite like {thing}.",
				"{thing} is great!",
				"I love {thing}.",
				"{thing} is pretty good!",
				"I like {thing}."
			],
			[OPINION_NEUTRAL]: [
				"{thing} is alright.",
				"{thing} is okay.",
				"{thing} is fine, not great though.",
				"I don't mind {thing}.",
				"I'm alright with {thing}.",
			],
			[OPINION_HATE]: [
				"{thing} is a fucking weeb.",
				"Fuck {thing}.",
				"{thing} can suck a bag of donkey dicks.",
				"I hate {thing}.",
				"{thing} can eat my ass.",
			],
			[OPINION_FEAR]: [
				"{thing} creeps me out.",
				"{thing} creeps me the fuck out.",
				"{thing} is spooky.",
				"Get me away from {thing}.",
				"Get me the fuck away from {thing}.",
			]
		},
		russian: {
			click: "*CLICK*",
			bang: "*BANG!*",
			start: [
				"{name} raises a gun to their head.",
			],
			finish: [
				"{name} shoots their fuckin' head off and dies.",
				"Holy shit! {name} just blew their head off!",
				"{name} blew their brains out.",
			],
		},
		eightball: [
			"It is certain.",
			"It is decidedly so.",
			"Without a doubt.",
			"Yes - definitely.",
			"You may rely on it.",
			"As I see it, yes.",
			"Most likely.",
			"Outlook good.",
			"Yes.",
			"Signs point to yes.",
			"Reply hazy, try again.",
			"Ask again later.",
			"Better not tell you now.",
			"Cannot predict now.",
			"Concentrate and ask again.",
			"Don't count on it.",
			"My reply is no.",
			"My sources say no.",
			"Outlook not so good.",
			"Very doubtful.",
		],
		command_prefix_changed: "Command prefix changed to \"{prefix}\".",
	},
	["fr"]: {
		error_generic: "Zut, desolé, j'fais un erreur.",
		lang_missing: "Mal langue ID",
		invalid_language: "Cette langue n'est pas vrai.",
		under_construction: "Ceci n'est pas fini encore.",
		language_set: "La langue est maintenant {language}.",
		opinion_responses: {
			[OPINION_LIKE]: [
				"J'aime beaucoup {thing}.",
				"{thing}, c'est très bon!",
				"J'adore {thing}.",
				"{thing} est bon!",
				"{thing}. Je l'aime."
			],
			[OPINION_NEUTRAL]: [
				"{thing} is alright.",
				"{thing} is okay.",
				"{thing} is fine, not great though.",
				"I don't mind {thing}.",
				"I'm alright with {thing}.",
			],
			[OPINION_HATE]: [
				"{thing} est un ouiabou.",
				"{thing} est merde.",
				"La mère de {thing} est belge.",
				"Je déteste {thing}.",
				"{thing} peu manger mon zizi.",
			],
			[OPINION_FEAR]: [
				"{thing} est spooky.",
				"Je peux pas regarder {thing}.",
				"Mets-moi loin de {thing}.",
			]
		},
		russian: {
			click: "*CLIQUE*",
			bang: "*BANGE!*",
			start: [
				"{name} mets un pistole à son tête.",
			],
			finish: [
				"{name} se suicide. REP.",
				"Zut! {name} est très, très morte!",
				"{name} blew their brains out.",
			],
		},
		eightball: [
			"C'est certain.",
			"C'est comme ça.",
			"Sans doût.",
			"Oui - defini.",
			"Tu que entruste.",
			"Comme je le vois? Ouai.",
			"C'est probable.",
			"Bon regarder.",
			"Oui.",
			"Non.",
			"Je sais pas.",
			"Pose à quelques temps plus.",
			"C'est meilleur que tu sais pas.",
			"J'ai pas d'idée.",
			"Ne pose encore.",
			"Je dit 'non'.",
			"Mes sources ditent 'non'.",
			"J'ai doût.",
		],
		command_prefix_changed: "Préfixe de commande a changé à \"{prefix}\".",
	},
};

// nobody uses this anymore, i guess the novelty is wearing off
// it's use is kinda being replaced by the alexa-esque commands
// *kinda*
var opinions = {
	preset: {
		["joseph stalin"]: OPINION_LIKE,
		["josef stalin"]: OPINION_LIKE,
		["josef"]: OPINION_LIKE,
		["stalin"]: OPINION_LIKE,
		["my mother"]: OPINION_LIKE,
		["your mother"]: OPINION_LIKE,
		["adolf hitler"]: OPINION_NEUTRAL,
		["adolf"]: OPINION_NEUTRAL,
		["hitler"]: OPINION_NEUTRAL,
		["4chan"]: OPINION_NEUTRAL,
		["/pol/"]: OPINION_NEUTRAL,
		["pol"]: OPINION_NEUTRAL,
		["trump"]: OPINION_NEUTRAL,
		["donald trump"]: OPINION_NEUTRAL,
		["league"]: OPINION_HATE,
		["lol"]: OPINION_HATE,
		["league of legends"]: OPINION_HATE,
		["fidget spinners"]: OPINION_HATE,
		["hillary clinton"]: OPINION_HATE,
		["hillary"]: OPINION_HATE,
		["clinton"]: OPINION_HATE,
		["tayte"]: OPINION_HATE,
		["brockhampton"]: OPINION_HATE,
		["deep water"]: OPINION_FEAR,
		["spider"]: OPINION_FEAR,
		["spiders"]: OPINION_FEAR,
		["bug"]: OPINION_FEAR,
		["bugs"]: OPINION_FEAR,
		// FUCK I DONT WANNA BE BANANAED
		["hooni"]: OPINION_LIKE,
		["hunni"]: OPINION_LIKE,
		["huni"]: OPINION_LIKE,
		["hoon"]: OPINION_LIKE,
		["honi"]: OPINION_LIKE
	},
	generated: {}
};

// put random functions in here
const util = {
	ArrayHasValue: function(arr, val)
	{
		return arr.indexOf(val) != -1;
	},
	RandomFromArray:  function(arr)
	{
		return arr[Math.floor(Math.random() * arr.length)];
	},
	FormatImgurGifV: function(txt)
	{
		return "https://i.imgur.com/" + txt + ".gifv";
	},
	FormatSpotifySong: function(txt)
	{
		return "https://open.spotify.com/track/" + txt;
	},
	FormatSongTitle: function(artist, title)
	{
		if (artist)
		{
			return artist + " - " + title;
		}
		else
		{
			return title;
		}
	},
};

const bushisms = [
	"They misunderestimated me.",
	"I know the human being and fish can coexist peacefully.",
	"There's an old saying in Tennessee - I know it's in Texas, probably in Tennessee - thay says, 'Fool me once, shame on... shame on you. Fool me - you can't get fooled again.'",
	"Too many good docs are getting out of the business. Too many OB-GYNs aren't able to practice their love with women all across this country.",
	"We ought to make the pie higher.",
	"Rarely is the question asked; Is our children learning?",
	"If you teach a child to read, he or her will be able to pass a literacy test.",
];

const takyon = [
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
	"TAKYON",
];

const decappi_boi = [
	"hHQ4vEu",
	"eY9kEc5",
	"ZYADxx4",
	"J37kqjN",
];

const kissi_boi = [
	"jaldFcg",
	"o0Wt5jV",
	"WP07gNq",
	"AbUVaRY",
	"3hd4wvc",
	"dWl2fk1",
	"XcyZN4T",
];

const not_my_problem = [
	"pI61TL6",
];

const emojiball_responses = [
	":eggplant: :sweat_drops:",
	":heart:",
	":b:",
	":thinking:",
	":thinking:",
	":upside_down:",
	":slight_smile:",
	":rage:",
	":blush:",
	":grimacing:",
	":sunglasses:",
	":weary:",
	":unamused:",
	":pensive:",
	":smiling_imp:",
	":sob:",
	":cold_sweat:",
	":gun: :cowboy:",
	":expressionless:",
	":scream:",
	":yum:",
	":point_left: :sunglasses: :point_left:",
	":point_right: :sunglasses: :point_right:",
	":see_no_evil: :hear_no_evil: :speak_no_evil:",
	":ok_hand: :100:",
	":fire: :fire: :fire:",
	":money_mouth:",
	":rolling_eyes:",
	":eye: :lips: :eye:",
	":joy:",
	":eyes:\n:tongue:",
	":heart_eyes:"
];

const WiseWords = [
	"dont pee on people",
	"dont be trans (just dont)",
	"dont suicide yourself",
	"dont open crates",
	"look both ways when crossing the street",
	"arrays start at 1",
	"dont expect too much",
	"dont try your luck",
	"pursuing an art career? dont quit your day job",
];

// literally older than your grandma
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

// feature sux
const song_list = [
	{url: "02Q0bei8227VUIxJgqppUk", title: "Lore, Lore", tags: ["deutschland", "heil"]},
	{url: "46RVKt5Edm1zl0rXhPJZxz", artist: "Men at Work", title: "Down Under", tags: ["meme"]},
	{url: "3cfOd4CMv2snFaKAnMdnvK", artist: "Smash Mouth", title: "All Star", tags: ["meme"]},
	{url: "1eyzqe2QqGZUmfcPZtrIyt", artist: "M83", title: "Midnight City", tags: ["synth"]},
];

const i_like_this_song = [
	"I found a song you might like.",
	"Here's a song I like.",
	"This is one of my favorites.",
	"I hope you like this one.",
	"This is probably my favorite song.",
];

function FormatSuggestedSong(n)
{
	if (!song_list[n])
	{
		return;
	}

	return util.RandomFromArray(i_like_this_song) + "\n\n" + util.FormatSongTitle(song_list[n].artist, song_list[n].title) + "\n\n" + util.FormatSpotifySong(song_list[n].url);
}

// useless function lmao - what loser made this
function MatchingTags_RECURSIVE(a, b, i)
{
	if (!i)
	{
		i = 0;
	}
	if (!b[i])
	{
		return false;
	}
	if (util.ArrayHasValue(a, b[i]))
	{
		return true;
	}
	return MatchingTags(a, b, i + 1);
}

function MatchingTags(a, b)
{
	var new_array = a.filter((n) => b.includes(n));
	return (new_array.length > 0);
}

function SuggestSongsBasedOnTags(tags, got_songs, on_index)
{
	if (!got_songs)
	{
		got_songs = [];
	}
	if (!on_index)
	{
		on_index = 0;
	}
	if (!song_list[on_index])
	{
		return got_songs;
	}
	if (MatchingTags(song_list[on_index].tags, tags))
	{
		got_songs.push(on_index);
	}
	return SuggestSongsBasedOnTags(tags, got_songs, on_index + 1);
}

function PickRandomSongFromTags(tags) {return util.RandomFromArray(SuggestSongsBasedOnTags(tags));}

function GetCommandInfo(command)
{
	for (let i in bot_commands)
	{
		if (bot_commands[i].command == command) return bot_commands[i];
	}
	return false;
}

function GetCommandHelpText(command)
{
	cmd = GetCommandInfo(command);
	if (!cmd) return false;

	helptext += command;

	if (cmd.aliases)
	{
		helptext += " (aliases:";
		for (let i in cmd.aliases)
		{
			helptext += " " + cmd.aliases[i];
		}
		helptext += ")";
	}

	if (cmd.args)
	{
		helptext += "\nUsage: " + (cmd.no_prefix ? "" : command_prefix) + command + " " + cmd.args;
	}

	if (cmd.help)
	{
		helptext += "\n" + cmd.help;
	}

	return helptext;
}

function GetSenderName(msg)
{
	return msg.member ? (msg.member.nickname || msg.author.username) : msg.author.username;
}

const changelog = "**BillardBot 3.3: Autofellatio Edition**\n\n**New Features**\nRead the docs! (.help)\nLearn something new! (.wisdom)\nCommands now have aliases\nMore preset opinions\nUpdated localization files\n\n**Features in Progress**\nCross compatibility between prefixes commands and addressed commands\nOverall nicer looks\nFinish the goddamn localization";

bot.on("ready", () =>
{
	// say the changelog in general or something idk
});

var command_prefix = "."; // make a way to change this or something idk (edit: i half-assed it)

const bot_commands = [
	{command: "echo", func: function(message, txt){message.channel.send(":eggplant: (virgin)");}},
	{command: "mentionshawntoannoyhim", func: function(message, txt){message.channel.send("no");}},
	{command: "suicide", aliases: ["kms", "killmyself"], func: function(message, txt){message.channel.send("ur ded now\nrip");}},
	{command: "suggestsong", func: function(message, txt)
	{
		if (txt.length == 1)
		{
			message.channel.send(FormatSuggestedSong(Math.floor(Math.random() * song_list.length)));
		}
		else
		{
			txt.shift(); // bad - it fucks with txt
			message.channel.send(FormatSuggestedSong(PickRandomSongFromTags(txt)) || "FUCK YOU STOP SUGGESTING SONGS");
		}
	}},
	{command: "changelog", aliases: ["updates", "whatsnew", "changes"], help: "See what's new with BillardBot.", func: function(message, txt){message.channel.send(changelog);}},
	{command: "setlang", alias: "setlanguage"},
	{command: "setlanguage", func: function(message, txt){
		let langue = txt[1].toLowerCase();
		if (lang[langue])
		{
			language = langue;
			message.channel.send(lang[language].language_set.replace("{language}", ReadableLanguageName(language)));
		}
		else
		{
			message.channel.send(lang[language].invalid_language);
		}
	}},
	{command: "language", aliases: ["currentlanguage"], func: function(message, txt){message.channel.send("Current language:  " + ReadableLanguageName(language));}},
	{command: "startvote", func: function(message, txt)
	{
		var yeah = "yeah";
		message.channel.send(yeah); // under construction
	}},
	{command: "kiss", func: function(message, txt)
	{
		var good_thing = message.content.slice(6);
		var name = GetSenderName(message);
		message.channel.send(name + " kisses " + good_thing + "\n" + util.FormatImgurGifV(util.RandomFromArray(kissi_boi)));
	}},
	{command: "bushism", aliases: ["bushquote", "georgewbush"], help: "Learn a little bit of knowledge from former president and pro golfer George W. Bush.", func: function(message, txt)
	{
		message.channel.send("\"" + util.RandomFromArray(bushisms) + "\"\n    -George W. Bush");
	}},
	{command: "8ball", aliases: ["eightball", "magic8ball"], args: "<query>", help: "Picks a majic 8 ball response for your query.", func: function(message, txt)
	{
		message.channel.send("```" + message.content + "```\n" + util.RandomFromArray(lang[language].eightball));
	}},
	{command: "emojiball", aliases: ["emoji8ball", "randomemoji"], args: "<query>", help: "Picks a random emoji in response to your query.", func: function(message, txt)
	{
		message.channel.send(util.RandomFromArray(emojiball_responses));
	}},
	{command: "noneofmybusiness", func: function(message, txt)
	{
		message.channel.send(util.FormatImgurGifV(util.RandomFromArray(not_my_problem)));
	}},
	{command: "changeprefix",  args: "<prefix>", help: "Change the command prefix.\nBe very careful with this.\nDefault is \".\".", func: function(message, txt)
	{
		var new_prefix = "";
		for (i = 1; i < txt.length; i++)
		{ 
			new_prefix += " " + txt[i];
		}
		new_prefix = new_prefix.substring(1);

		if (new_prefix) // check for an empty string
		{
			command_prefix = new_prefix; // maybe serialize it a bit"lmao (edit: serialized, but still very editable)
			message.channel.send(lang[language].command_prefix_changed.replace("{prefix}", command_prefix));
		}
		else
		{
			message.channel.send("wow, you broke it. i dont even know how you did that. im disappointed.");
		}
	}},
	{command: "takyon", func: function(message, txt)
	{
		var lyrics = "";
		for (var i = 0; i < takyon.length; i++)
		{
			lyrics += takyon[i] + "\n";
		}
		message.channel.send(lyrics);
	}},
	{command: "behead", args: "<things>", help: "Behead somebody or something.", func: function(message, txt)
	{
		var bad_thing = message.content.slice(8);
		var name = GetSenderName(message);
		message.channel.send(name + " beheads " + bad_thing + "\n" + util.FormatImgurGifV(util.RandomFromArray(decappi_boi)));
	}},
	{command: "roll", aliases: ["pick", "pickrandom", "rolldice", "dice", "diceroll"], args: "[min=1] [max=6]", help: "Roll a random number between min and max.", func: function(message, txt)
	{
		var min = Number(txt[1]) || 1;
		var max = Number(txt[2]) || 6;
		var num = Math.floor(Math.random() * (max - min + 1)) + min;

		message.channel.send("You rolled a " + num + ".");
	}},
	{command: "russian", aliases: ["russianroullette", "roullette"], help: "Kill yourself! (16.7% of the time)\n100% chance to kill JD.", func: function(message, txt)
	{
		var rando = Math.floor(Math.random() * 5);
		var name = GetSenderName(message);
		message.channel.send(name + " " + util.RandomFromArray(lang[language].russian.start).replace("{name}", name));
		if (rando == 0 || message.author.id == "358133639126581249") // KILL JD ALWAYS
		{
			message.channel.send(lang[language].russian.bang + "\n" + util.RandomFromArray(lang[language].russian.finish).replace("{name}", name));
		}
		else
		{
			message.channel.send(lang[language].russian.click);
		}
	}},
	{command: "opinion", func: function(message, txt)
	{
		var thing = "";
		for (i = 1; i < txt.length; i++)
		{ 
			thing += " " + txt[i];
		}
		thing = thing.substring(1);

		var opinion = GenerateOpinion(thing.toLowerCase());
		var str = util.RandomFromArray(lang[language].opinion_responses[opinion]);
		var reply = str.replace("{thing}", thing);

		message.channel.send(reply);
	}},
	{command: "profile", func: function(message, txt)
	{
		var name = GetSenderName(message);
		var target = message.mentions.users.first();
		message.channel.send("Profiling dis nigga...")
		if (!target)
		{
			message.channel.send("ERROR: Nigga Aint Real !!!");
			return;
		}
		var target_name = target.username; // idk lmao
		message.channel.send("This will take a fucking while...");
		message.channel.fetchMessages({limit:100}).then(function(messages)
		{
			message.channel.send("Found " + messages.size + " messages...");
			var MessagesThatDumbNiggaSent = {};
			var SortNiggasAmount = {};
			var SortNiggasDay = {};
			for (var NiggaMsg in messages)
			{
				if (messages[NiggaMsg].author.id == target.id)
				{
					message.channel.send(" O H S H I T N I G G A LOOK OUT FOR THE LIZARD :burrito:")
					MessagesThatDumbNiggaSent.push(messages[NiggaMsg].content)
				}
				var DisNigga = messages[NiggaMsg].content;
				if (typeof SortNiggasAmount[DisNigga] == "number")
				{
					SortNiggasAmount[DisNigga] += 1;
				}
				else
				{
					SortNiggasAmount[DisNigga] = 1;
				}
			}
			message.channel.send("Damn nigga found " + MessagesThatDumbNiggaSent.length + " messages from dis nigga");
			message.channel.send("Calculating dis shit here nigga...");
			var NiggaFinalMessage = "";
			for (var OhShit in SortNiggasAmount)
			{
				NiggaFinalMessage += "i dunno: " + OhShit + " <- was dat | wuz dis -> " + SortNiggasAmount[OhShit];
			}
			message.channel.send(NiggaFinalMessage);
			message.channel.send("sry about the chat spam lmao im a dum nigga")
		});
	}},
	{command: "help", aliases: ["wiki", "info"], args: "[command]", help: "Find out more about BillardBot's commands.", func: function(message, txt)
	{		
		if (txt[1])
		{
			let help = GetCommandHelpText(txt[1]);
			message.channel.send(help ? "```" + help + "```" : "Error 69XD: Unknown command");
		}
		else
		{
			let help = "```";
			for (let i in bot_commands)
			{
				help += GetCommandHelpText(bot_commands[i].command) + "\n\n";
			}
			message.channel.send(help + "```");
		}
	}},
	{command: "wisdom", aliases: ["protip", "lifeprotip", "tip", "lifehack"], help: "Learn a little of BillardBot's wisdom.", func: function(message, txt) {
		message.channel.send(util.RandomFromArray(WiseWords));
	}}
];

// more efficient method of adding commands
function LoopForBotCommand(msg, txt, i)
{
	if (!i)
	{
		i = 0;
	}
	if (!bot_commands[i])
	{
		return;
	}
	
	var cmd = bot_commands[i].command;
	if (!bot_commands[i].no_prefix)
	{
		cmd = command_prefix + cmd;
	}
	if (txt[0].toLowerCase() == cmd.toLowerCase())
	{
		return bot_commands[i].func(msg, txt);
	}
	else if (bot_commands[i].aliases)
	{
		// wow this is terrible
		// at least it works i guess?
		for (let j in bot_commands[i].aliases)
		{
			let alias = bot_commands[i].aliases[j]
			if (!bot_commands[i].no_prefix)
			{
				alias = command_prefix + alias;
			}
			if (txt[0].toLowerCase() == alias.toLowerCase())
			{
				return bot_commands[i].func(msg, txt);
			}
		}
	}
	return LoopForBotCommand(msg, txt, i + 1);
}

var annoyance_level = 0;

const are_you_egg = [
	"no, im not an egg boy",
	"no, im not",
	"no",
	"stop saying that",
	"im not an egg boy",
	"fucking stop",
	"its not funny anymore",
	"im not a fucking egg boy",
	"i WILL file a restraining order",
	"stop fucking saying that",
	"is this what you want? a restraining order?",
	"say that one more fucking time i swear",
	"https://i.imgur.com/5ddwkPj.jpg", // "your tip has been submitted!"
];

const acronym_i = [
	"immense",
	"iodized",
	"immovable",
	"idiotic",
	"icecaps",
	"inhuman",
	"impactful",
	"inflicted",
	"intense",
	"ignorant",
];

const acronym_n = [
	"noun",
	"nozzle",
	"nocturnal",
	"nonzero",
	"nostril",
	"networked",
	"niggardly",
	"nitpicky",
	"nicked",
	"napkins",
	"nighttime",
	"numbing",
];

const acronym_t = [
	"testicular",
	"treasure",
	"toothpaste",
	"thumb",
	"truck",
	"tequila",
	"technical",
	"tranquil",
	"tweezed",
	"thimble",
	"touchup",
	"tiny",
	"twelfth",
];

const acronym_l = [
	"lame",
	"loving",
	"longbow",
	"loser",
	"lockbox",
	"liquid",
	"lament",
	"luck",
	"lullaby",
	"lamppost",
	"lexicon",
];

const alexa = {
	util:  {
		commandPrefix: function(txt)
		{
			if (txt)
			{
				return alexa.name + ", " + txt;
			}
			else
			{
				return alexa.name + ", ";
			}
		},
		evaluate: function(raw, message, i)
		{
			if (!i)
			{
				i = 0;
			}
			if (!alexa.commands[i])
			{
				return alexa.sorrymate || "goofed";
			}
			var cmd = alexa.util.commandPrefix(alexa.commands[i].command);
			if (raw.toLowerCase() == cmd.toLowerCase())
			{
				if (alexa.commands[i].func)
				{
					return alexa.commands[i].func(raw, message);
				}
				else if (alexa.commands[i].response)
				{
					if (alexa.commands[i].rare_response && Math.random() > 0.60)
					{
						var promise = message.channel.send(alexa.commands[i].rare_response);
						if (alexa.commands[i].auto_censor)
						{
							setTimeout(function()
							{
								promise.then(function(message)
								{
									message.edit(alexa.commands[i].response);
								});
							}, 1000);
						}
					}
					else
					{
						return message.channel.send(alexa.commands[i].response);
					}
				}
				else
				{
					return message.channel.send("WHAT THE FUCK AM I DOING");
				}
			}
			return alexa.util.evaluate(raw, message, i + 1);
		},
	},
	name: "billardbot",
	sorrymate: "Sorry, I don't understand you.",
	commands: [
		{command: "are you an egg boy?", func: function(raw, message)
		{
			if (annoyance_level < are_you_egg.length)
			{
				message.channel.send(are_you_egg[annoyance_level]);
				annoyance_level += 1;
			}
		}},
		{command: "what does intl stand for?", func: function(raw, message)
		{
			message.channel.send(util.RandomFromArray(acronym_i) + " " + util.RandomFromArray(acronym_n) + " " + util.RandomFromArray(acronym_t) + " " + util.RandomFromArray(acronym_l));
		}},
		{command: "what do you think?", response: "i think thats some gay shit LMAO miss me nigga", rare_response: "i think thats some gay shit LMAO miss me ni:b::b:a"},
		{command: "what's up?", response: "not much", rare_response: "oh, just mass genocide, school shootings, and terrorism. the usual", auto_censor: true},
		{command: "does kai roberts have the gay?", response: "idk maybe", rare_response: "DEFINITELY YES", auto_censor: true},
		{command: "drumroll please", response: ":drum::drum::drum:", rare_response: "i'm not your slave", auto_censor: true},
		{command: "can i have some free porb?", response: "no", rare_response: "ok fine :eggplant: :sweat_drops: :peach: :heart_eyes:"},
		{command: "do you have stairs in your house?", response: "what kind of question is that?", rare_response: "I AM PROTECTED", auto_censor: true},
		{command: "what is best country?", response: ":flag_ru:", rare_response: "actually it's :flag_sl:, all the other answers are decoys to distract the spies"},
		{command: "what does tayte not realize?", response: "well, son, what tayte doesn't realize is that this isnt a bot account. this is my alt that now has admin on his server. *my* server. its not his anymore."},
		{command: "are you gay?", response: "no", rare_response: "actually yes i am super duper gay i browse /cm/ every waking minute of my entire life there are you happy now?"},
		{command: "gay?", response: "i am gay for tayte :3", rare_response: "i am gay for tayte :3 (btw tayte if you're reading this, call me: +1 (808) 261-3930"},
		{command: "who are you gay for?", response: "tayte is the ultimate goal UwU but i am single so any cuties hmu: +1 (808) 261-3930"},
	],
};

const censor_enabled = true;
var WarnedNiggas = {};
// old banned words
// var BannedWords = {"weeb":true, "weebs":true, "nerd":true, "nerds":true, "oof":true};
var BannedWords = {"bluealbumsucks":true};

const YoureWelcome = [
	"you're welcome my dude",
	"you're welcome my dude",
	"your welcome my dude", // based
	"no problem",
	"no problem",
	"no problem",
	"no problem",
	"no problemo",
	"your welcome",
	"you're welcome",
	"you're welcome",
	"you're welcome",
	"you're welcome",
	"you're welcome",
	"you're welcome",
	"you're welcome",
	"fuck you dip shit"
];

function censorship(msg, txt)
{
	if (!msg.member) return;
	if (censor_enabled && BannedWords[txt[0].toLowerCase()] && txt.length == 1)
	{
		if (WarnedNiggas[msg.author.id])
		{
			msg.channel.send("you should have listened. buh-bye!");
			msg.member.kick("dumb fuck");
		}
		else
		{
			msg.channel.send("looks like you tried to type a degenerate word. use both your brain cells next time. don't do that again.");
			WarnedNiggas[msg.author.id] = true;
		}
		msg.delete();
	}
}

bot.on("message", message =>
{
	var txt = message.content.split(" ");
	var raw = message.content.toLowerCase();
	LoopForBotCommand(message, txt);
	alexa.util.evaluate(raw, message);
	censorship(message, txt);

	if (txt[0] == "WEW" && txt.length == 1)
	{
		message.channel.send("LAD");
	}
	else if (txt[0].toLowerCase() == "wew" && txt.length == 1)
	{
		message.channel.send("lad");
	}
	else if (txt[0].toLowerCase() == "ding" && txt[1].toLowerCase() == "dong" && txt.length == 2)
	{
		if (Math.floor(Math.random() * 100) == 0) {return message.channel.send("suck my fuck");}
		message.channel.send("your opinion is wrong");
	}
	else if (txt[0].toLowerCase() == "splish" && txt[1].toLowerCase() == "splash" && txt.length == 2)
	{
		if (Math.floor(Math.random() * 100) == 0) {return message.channel.send("fuck you loser");}
		message.channel.send("your opinion is trash");
	}
	else if (raw == "thanks, billardbot" || raw == "many thanks, billardbot" || raw == "many thanks billardbot" || raw == "thank you, billardbot" || raw == "thank you billardbot" || raw == "thanks billardbot")
	{
		message.channel.send(util.RandomFromArray(YoureWelcome));
	}
});

bot.login(token);
