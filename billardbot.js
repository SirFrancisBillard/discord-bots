// BillardBot 3.0 - Egg Boy Edition
// Vulgarity warning: this bot is approved by George Carlin
// https://www.youtube.com/watch?v=vbZhpf3sQxQ

const Discord = require("discord.js");
const bot = new Discord.Client();
const token = "ToKeN";

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
	["cn"]: "中文 (Chinese)",
	["jp"]: "日本語 (Japanese)",
	["ru"]: "Pусский (Russian)",
};

function ReadableLanguageName(str)
{
	if (!TranslateLanguageNameToSomethingReadable[str.toLowerCase()])
	{
		return "Unknown";
	}

	return TranslateLanguageNameToSomethingReadable[str.toLowerCase()];
}

const lang = { // put all strings in here eventually
	["en"]: {
		error_generic: [
			"Error",
			"Generic error",
		],
		lang_missing: [
			"Language string missing",
			"Bad language string",
			"Nonexistant language string",
		],
		under_construction: [
			"This feature is under construction",
			"This feature is incomplete",
			"Still working on this part, sorry!",
			"This part's not done yet",
			"This feature isn't done yet",
		],
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
		["bugs"]: OPINION_FEAR
	},
	responses: {
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

// maybe put all the arrays between here and "boop" into a larger object?
const bushisms = [
	"They misunderestimated me.",
	"I know the human being and fish can coexist peacefully.",
	"There's an old saying in Tennessee - I know it's in Texas, probably in Tennessee - thay says, 'Fool me once, shame on... shame on you. Fool me - you can't get fooled again.'",
	"Too many good docs are getting out of the business. Too many OB-GYNs aren't able to practice their love with women all across this country.",
	"We ought to make the pie higher.",
	"Rarely is the question asked; Is our children learning?",
	"If you teach a child to read, he or her will be able to pass a literacy test.",
];

const roullette_start = [
	"raises a gun to their head.", // wew lad
];

const roullette_finish = [
	"{name} blows their brains across the pacific.",
	"{name} vaporizes their skull and all of its contents.",
	"{name} spreads their gray matter across four counties.",
	"Holy shit! {name} just blew their head off!",
	// "*i shouldn't have done that...* is probably what {name} would be thinking right now... if they still had a head!",
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
// "boop"

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

const song_list = [
	{url: "78WVCYkTIJgWUAbwTTrTiO", artist: "Reel Big Fish", title: "Sayonara Senorita", tags: ["rbf", "trumpet"]},
	{url: "7vPLB09s3XNhIM5S5wF1Si", artist: "Reel Big Fish", title: "Everyone Else is an Asshole", tags: ["rbf", "comedy"]},
	{url: "1sIVrEY8WNhQNpON9BmXTd", artist: "Dusty Brown", title: "This City is Killing Me", tags: ["depressing", "piano"]},
	{url: "2hHNFmRgj2KUCeCcJH0QLP", artist: "Proleter", title: "Faidherbe Square", tags: ["swing"]},
	{url: "02Q0bei8227VUIxJgqppUk", title: "Lore, Lore", tags: ["deutschland", "heil"]},
	{url: "7MwjanOxjvV2ILQPfOKIIm", artist: "Carpenter Brut", title: "Paradise Warfare", tags: ["synth"]},
	{url: "4FdQL99ZOQTAsAQv2EJGnw", artist: "Carpenter Brut", title: "Meet Matt Stryker", tags: ["synth"]},
	{url: "7oxnK2wg8qFv8EXyyxKDJ4", artist: "Carpenter Brut", title: "Roller Mobster", tags: ["synth"]},
	{url: "1hGRe4d3LJCg1VszAU8Cy1", artist: "El Huervo", title: "Daisuke", tags: ["chill"]},
	{url: "2uA9EGy7KifPvk2F342IvR", artist: "El Huervo", title: "Rust", tags: ["chill"]},
	{url: "6NCM7ADhVKOo2tT84p60hP", artist: "Scattle", title: "Bloodline", tags: ["pardo", "meme"]},
	{url: "2bHpNAMEsB3Wc00y87JTdn", artist: "Magic Sword", title: "In The Face Of Evil", tags: ["synth"]},
	{url: "2hQCzcb3qyZirWzOD5Yzoj", artist: "Justice", title: "D.A.N.C.E.", tags: ["bass"]},
	{url: "1tA9cQEtQPvUdcndCUcP9E", artist: "Lil Dicky", title: "White Crime", tags: ["rap", "comedy"]},
	{url: "53duuSwaLOZuIrELvZXqLH", artist: "The Notorious B.I.G.", title: "Going Back To Cali", tags: ["rap", "posthumous"]},
	{url: "46RVKt5Edm1zl0rXhPJZxz", artist: "Men at Work", title: "Down Under", tags: ["meme"]},
	{url: "6tC2iHfUlzB2W4ntXXL2BH", artist: "Pendulum", title: "Propane Nightmares", tags: ["oldschool"]},
	{url: "3DPdm3xVRuBIzWbDTt3Gde", title: "Push it to the Limit", tags: ["rock"]},
	{url: "3ctoHckjyd13eBi2IDw2Ip", artist: "The White Stripes", title: "Seven Nation Army", tags: ["rock", "stadium"]},
	{url: "4fQMGlCawbTkH9yPPZ49kP", artist: "Booker T and the M.G.'s", title: "Green Onions", tags: ["classic", "funky"]},
	{url: "2hhFpD32iXUd4GaCu6T4wn", artist: "Jon Lajoie", title: "Everyday Normal Guy 2", tags: ["comedy", "meme", "rap"]},
	{url: "7I1uAzqqdNVUptxlHPj9pZ", artist: "Lemon Demon", title: "Action Movie Hero Boy", tags: ["comedy", "rock"]},
	{url: "3cfOd4CMv2snFaKAnMdnvK", artist: "Smash Mouth", title: "All Star", tags: ["meme"]},
	{url: "4jacsL77ZYnpInmTtUBaJW", artist: "Junior Senior", title: "Move Your Feet", tags: ["upbeat"]},
	{url: "0U0ldCRmgCqhVvD6ksG63j", artist: "Kavinsky", title: "Nightcall", tags: ["synth"]},
	{url: "1eyzqe2QqGZUmfcPZtrIyt", artist: "M83", title: "Midnight City", tags: ["synth"]},
	{url: "1JcwHjETNNbUH0yfrc9w9n", artist: "Power Glove", title: "Power Core", tags: ["synth"]},
	{url: "34x6hEJgGAOQvmlMql5Ige", artist: "Kenny Loggins", title: "Danger Zone", tags: ["classic", "rock"]},
];

// maybe put this up with the other "boop" ones?
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

function PickRandomSongFromTags(tags)
{
	var got_songs = SuggestSongsBasedOnTags(tags);
	return util.RandomFromArray(got_songs);
}

// i have enough time to write this comment saying that the changelog is outdated but i'm not going to actually update the changelog
// A+ coding skills
const changelog = "**BillardBot 3.0: Egg Boy Edition**\n\n**New Features**\nSong suggestions w/ optional tags (.suggestsong <tags>)\nMore opinion statements\nChangeable command prefix\nDirectly addressable commands (like Alexa)\n\n**Features in Progress**\nCross compatibility between prefixes commands and addressed commands\nOverall nicer looks\nLocalization";

bot.on("ready", () =>
{
	// say the changelog in general or something idk (how tho???)
});

var command_prefix = "."; // make a way to change this or something idk (edit: i half-assed it)

const bot_commands = [
	{command: "echo", func: function(message, txt){message.channel.send("ECHOE");}},
	{command: "mentionshawntoannoyhim", func: function(message, txt){message.channel.send("@sjun21#1824");}},
	{command: "suicide", func: function(message, txt){message.channel.send("ur ded now\nrip");}},
	{command: "suggestsong", func: function(message, txt)
	{
		if (txt.length == 1)
		{
			message.channel.send(FormatSuggestedSong(Math.floor(Math.random() * song_list.length)));
		}
		else
		{
			txt.shift(); // i dont like this - it modifies the variable itself
			message.channel.send(FormatSuggestedSong(PickRandomSongFromTags(txt)) || "FUCK YOU STOP SUGGESTING SONGS");
		}
	}},
	{command: "changelog", func: function(message, txt){message.channel.send(changelog);}},
	{command: "language", func: function(message, txt){message.channel.send("Current language:  " + ReadableLanguageName(language));}},
	{command: "startvote", func: function(message, txt)
	{
		var yeah = "yeah";
		message.channel.send(yeah); // under construction
	}},
	{command: "kiss", func: function(message, txt)
	{
		var good_thing = message.content.slice(6);
		var name = message.member.nickname || message.author.username;
		message.channel.send(name + " kisses " + good_thing + "\n" + util.FormatImgurGifV(util.RandomFromArray(kissi_boi)));
	}},
	{command: "bushism", func: function(message, txt)
	{
		message.channel.send("\"" + util.RandomFromArray(bushisms) + "\"\n    -George W. Bush");
	}},
	{command: "noneofmybusiness", func: function(message, txt)
	{
		message.channel.send( util.FormatImgurGifV(util.RandomFromArray(not_my_problem)));
	}},
	{command: "changeprefix", func: function(message, txt)
	{
		var new_prefix = "";
		for (i = 1; i < txt.length; i++)
		{ 
			new_prefix += " " + txt[i];
		}
		new_prefix = new_prefix.substring(1);

		if (new_prefix) // check for an empty string
		{
			command_prefix = new_prefix; // maybe serialize it a bit? lmao (edit: serialized, but still very editable)
			message.channel.send("Command prefix changed to \"" + command_prefix + "\"");
		}
		else
		{
			message.channel.send("Invalid command prefix! What the fuck are you thinkin?");
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
	{command: "behead", func: function(message, txt)
	{
		var bad_thing = message.content.slice(8);
		var name = message.member.nickname || message.author.username;
		message.channel.send(name + " beheads " + bad_thing + "\n" + util.FormatImgurGifV(util.RandomFromArray(decappi_boi)));
	}},
	{command: "roll", func: function(message, txt)
	{
		var min = Number(txt[1]) || 1;
		var max = Number(txt[2]) || 6;
		var num = Math.floor(Math.random() * (max - min + 1)) + min;

		message.channel.send("You rolled a " + num + ".");
	}},
	{command: "russian", func: function(message, txt)
	{
		var rando = Math.floor(Math.random() * 6) + 1;
		var name = message.member.nickname || message.author.username;
		message.channel.send(name + " " + util.RandomFromArray(roullette_start));
		if (rando == 1)
		{
			message.channel.send("*BANG*\n" + util.RandomFromArray(roullette_finish).replace("{name}", name));
		}
		else
		{
			message.channel.send("*CLICK*");
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
		var str = util.RandomFromArray(opinions.responses[opinion]);
		var reply = str.replace("{thing}", thing);

		message.channel.send(reply);
	}},
];

// hopefully a more efficient method of adding commands (edit: yup, its way more efficient)
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
		{command: "what do you think?", response: "i think thats some gay shit LMAO miss me nigga", rare_response: "i think thats some gay shit LMAO miss me ni: b: : b: a"},
		{command: "what's up?", response: "not much", rare_response: "oh, just mass genocide, school shootings, and terrorism. the usual", auto_censor: true},
		{command: "does kai roberts have the gay?", response: "idk maybe", rare_response: "DEFINITELY YES", auto_censor: true},
		{command: "drumroll please", response: ":drum::drum::drum:", rare_response: "i'm not your slave", auto_censor: true},
		{command: "can i have some free porb?", response: "no", rare_response: "ok fine :eggplant: :sweat_drops: :peach: :heart_eyes:"},
		{command: "do you have stairs in your house?", response: "what kind of question is that?", rare_response: "I AM PROTECTED", auto_censor: true},
		{command: "what is best country?", response: ":flag_ru:", rare_response: "actually it's :flag_sl:, all the other answers are decoys to distract the spies"},
	],
};

bot.on("message", message =>
{
	var txt = message.content.split(" ");
	var raw = message.content.toLowerCase();
	LoopForBotCommand(message, txt);
	alexa.util.evaluate(raw, message);

	// someday i'll figure out how to fix these
	// someday...
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
		message.channel.send("your opinion is wrong");
	}
	else if (raw == "thanks, billardbot" || raw == "many thanks, billardbot" || raw == "many thanks billardbot" || raw == "thank you, billardbot" || raw == "thank you billardbot" || raw == "thanks billardbot")
	{
		message.channel.send("you're welcome my dude");
	}
});

bot.login(token);
