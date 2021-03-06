// BillardBot 3.7 - Animal Abuse Edition
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
	str = str.toLowerCase()
	if (lang[str])
		return str;

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
	RandomInt: function(min, max)
	{
		return Math.floor(Math.random() * (max - min + 1) + min);
	},
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
	"There's an old saying in Tennessee - I know it's in Texas, probably in Tennessee - that says, 'Fool me once, shame on... shame on you. Fool me - you can't get fooled again.'",
	"Too many good docs are getting out of the business. Too many OB-GYNs aren't able to practice their love with women all across this country.",
	"We ought to make the pie higher.",
	"Rarely is the question asked; Is our children learning?",
	"If you teach a child to read, he or her will be able to pass a literacy test.",
	"I will not answer your question. Neither in French nor in English nor in Mexican.",
	"I know how hard it is for you to put food on your family.",
	"Our enemies are innovative and resourceful, and so are we. They never stop thinking about new ways to harm our country and our people, and neither do we.",
	"It’s important for us to explain to our nation that life is important. It’s not only life of babies, but it’s life of children living in, you know, the dark dungeons of the Internet.",
	"One of the great things about books is sometimes there are some fantastic pictures.",
	"I think it’s really important for this great state of baseball to reach out to people of all walks of life to make sure that the sport is inclusive. The best way to do it is to convince little kids how to... the beauty of playing baseball.",
	"Well, I think if you say you’re going to do something and don’t do it, that’s trustworthiness.",
	"And so, General, I want to thank you for your service. And I appreciate the fact that you really snatched defeat out of the jaws of those who are trying to defeat us in Iraq.",
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
	"college is optional",
	"dont suicide yourself",
	"dont open crates",
	"look both ways when crossing the street",
	"arrays start at 1",
	"count from 0-9 in your everyday life. 1-10 is for boomers",
	"dont expect too much",
	"dont try your luck",
	"learn how to shoot",
	"make your own pizza every once in a while",
	"if you like cheap ramen, keep it that way",
	"addiction is hereditary, know your limits",
	"traveling is what assholes do",
	"pursuing an art career? dont quit your day job",
	"strange women lying in ponds distributing swords is no basis for a system of government",
	"dont use microwaves, use an oven. better yet, use an open flame"
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

const FurFagFaces = [
	"^-^",
	"UwU",
	"OwO",
	"w_w",
	">w<",
	">_<",
	"T_T",
	"u_u"
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

function AddCommas(x)
{
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

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

	let helptext = command;

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

var bekos = {};

function GetBekos(id)
{
	if (typeof bekos[id] == "undefined") {bekos[id] = 0;}
	return bekos[id];
}

function SetBekos(id, amt)
{
	bekos[id] = amt;
	return bekos[id];
}

function AddBekos(id, amt)
{
	SetBekos(id, GetBekos(id) + amt);
	return bekos[id];
}

var pets = {
	data: {
		breeds: [
			{
				name: "Kitty",
				emoji: ":cat2:",
				stats: [
					{name: "health", min: 2, max: 3},
					{name: "damage", min: 1, max: 2},
					{name: "armor", min: 0, max: 0},
				]
			},
			{
				name: "Puppy",
				emoji: ":dog2:",
				stats: [
					{name: "health", min: 3, max: 4},
					{name: "damage", min: 1, max: 2},
					{name: "armor", min: 0, max: 0},
				],
				allergies: ["chocolate"]
			},
			{
				name: "Snail",
				emoji: ":snail:",
				stats: [
					{name: "health", min: 1, max: 1},
					{name: "damage", min: 1, max: 1},
					{name: "armor", min: 0, max: 0},
				]
			},
			{
				name: "Cock",
				emoji: ":rooster:",
				stats: [
					{name: "health", min: 1, max: 2},
					{name: "damage", min: 1, max: 1},
					{name: "armor", min: 0, max: 0},
				]
			},
			{
				name: "Sheep",
				emoji: ":sheep:",
				stats: [
					{name: "health", min: 3, max: 4},
					{name: "damage", min: 1, max: 2},
					{name: "armor", min: 0, max: 0},
				]
			},
			{
				name: "Piggy",
				emoji: ":pig2:",
				stats: [
					{name: "health", min: 3, max: 4},
					{name: "damage", min: 1, max: 2},
					{name: "armor", min: 0, max: 0},
				]
			},
			{
				name: "Cow",
				emoji: ":cow2:",
				stats: [
					{name: "health", min: 5, max: 6},
					{name: "damage", min: 2, max: 3},
					{name: "armor", min: 0, max: 0},
				]
			},
			{
				name: "Poodle",
				emoji: ":poodle:",
				stats: [
					{name: "health", min: 1, max: 1},
					{name: "damage", min: 1, max: 1},
					{name: "armor", min: 0, max: 0},
				]
			},
			{
				name: "Llama",
				emoji: ":llama:",
				stats: [
					{name: "health", min: 3, max: 4},
					{name: "damage", min: 2, max: 3},
					{name: "armor", min: 0, max: 0},
				]
			},
			{
				name: "Snake",
				emoji: ":snake:",
				stats: [
					{name: "health", min: 2, max: 3},
					{name: "damage", min: 3, max: 4},
					{name: "armor", min: 0, max: 0},
				]
			},
			{
				name: "Shark",
				emoji: ":shark:",
				stats: [
					{name: "health", min: 4, max: 5},
					{name: "damage", min: 4, max: 5},
					{name: "armor", min: 0, max: 0},
				]
			}
		],
		diseases: [
			{
				name: "Meno-paws",
				cost: 12
			},
			{
				name: "AIDS",
				incurable: true,
			},
			{
				name: "Cancer",
				incurable: true,
				terminal: true,
			},
		],
		adoptable_max: 4,
		adoptable: [
			{index: util.RandomInt(0, 4), price: util.RandomInt(30, 60)},
			{index: util.RandomInt(0, 6), price: util.RandomInt(50, 80)},
			{index: util.RandomInt(0, 8), price: util.RandomInt(70, 100)},
			{index: util.RandomInt(0, 10), price: util.RandomInt(90, 120)},
		],
		snacks: {
			grapes: {name: "Grapes", health: 1},
			cookie: {name: "Cookie", health: 1},
			peach: {name: "Peach", health: 2},
			cheese: {name: "Cheese", health: 2},
			chocolate: {name: "Chocolate", emoji: ":chocolate_bar:", health: 2},
			bread: {name: "Bread", health: 3},
			bacon: {name: "Bacon", health: 3},
			tea: {name: "Tea", health: 3},
			donut: {name: "Donut", emoji: ":doughnut:", health: 4},
			croissant: {name: "Croissant", health: 4},
			mooncake: {name: "Moon Cake", emoji: ":moon_cake:", health: 5},
			pie: {name: "Pie", health: 5},
			pizza: {name: "Pizza", health: 6},
			burger: {name: "Burger", emoji: ":hamburger:", health: 6},
		}
	},
	users: {}
};

function LoopStr(str, amt)
{
	let ret = "";
	for (let i = 0; i < amt; i++)
	{
		ret += str;
	}

	return ret;
}

function HealthBar(current, max)
{
	if (current <= 0)
	{
		return ":skull_crossbones:";
	}
	if (current > max)
	{
		return LoopStr(":heart:", max) + LoopStr(":yellow_heart:", current - max);
	}
	if (current == max)
	{
		return LoopStr(":heart:", current);
	}
	return LoopStr(":heart:", current) + LoopStr(":black_heart:", max - current);
}

function ItemStack(item, amt, max = 5)
{
	if (amt > max)
	{
		return item + " x " + AddCommas(amt);
	}

	return LoopStr(item, amt)
}

function FormatMoney(amt)
{
	return ":yen: **" + AddCommas(amt) + "**"
}

function FormatPet(obj)
{
	let pet = pets.data.breeds[obj.breed_index];
	return pet.emoji + " **" + obj.name + "**";
}

function FormatSnack(obj)
{
	if (obj.emoji)
	{
		return obj.emoji + " **" + obj.name + "**";
	}
	return ":" + obj.name.toLowerCase() + ": **" + obj.name + "**";
}

function ValidateKittys(id)
{
	if (!pets.users[id])
	{
		pets.users[id] = {pets: [], snacks: {}};
	}
}

// hey peter! "begfedaf" !!! (??)

function crypt(data, cipher, decrypt)
{
	let s = decrypt ? -1 : 1;
	var output = "";
	for (var i = 0, j = 0; i < data.length; i++)
	{
		var c = data.charCodeAt(i);
		var j = cipher[i % cipher.length].toLowerCase().charCodeAt() - ('a').charCodeAt();// * -2;
		output += String.fromCharCode(c + (j * s));
	}
	return output;
}

const changelog = "**BillardBot 3.7: Animal Abuse Edition**\n\n**New Commands**\n``slap`` - slap your pet\n``feed`` - feed your pet";

bot.on("ready", () =>
{
	// say the changelog in general or something idk
});

var command_prefix = ".";

var AutoFurry = {};
function FurryText(txt) {return txt.replace(/r/g, "w").replace(/R/g, "W").replace(/l/g, "w").replace(/L/g, "W") + " " + util.RandomFromArray(FurFagFaces);}

var bot_commands = [
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
			txt.shift();
			message.channel.send(FormatSuggestedSong(PickRandomSongFromTags(txt)) || "FUCK YOU STOP SUGGESTING SONGS");
		}
	}},
	{command: "changelog", aliases: ["updates", "whatsnew", "changes"], help: "See what's new with BillardBot.", func: function(message, txt){message.channel.send(changelog);}},
	{command: "setlanguage", aliases: ["setlang"], func: function(message, txt){
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
			command_prefix = new_prefix; // maybe serialize it a bit lmao (edit: serialized, but still very editable)
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

		message.channel.send("You rolled " + AddCommas(num) + ".");
	}},
	{command: "russian", aliases: ["russianroullette", "roullette"], help: "Kill yourself! (16.7% of the time)\n100% chance to kill JD.", func: function(message, txt)
	{
		var rando = Math.floor(Math.random() * 6000000) % 6;
		var name = GetSenderName(message);
		message.channel.send(util.RandomFromArray(lang[language].russian.start).replace("{name}", name));
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
		var thing = txt.slice(1).join(" ")
		var opinion = GenerateOpinion(thing.toLowerCase());
		var str = util.RandomFromArray(lang[language].opinion_responses[opinion]);
		var reply = str.replace("{thing}", thing);

		message.channel.send(reply);
	}},
	{command: "poll", aliases: ["vote", "startvote", "startpoll", "cockuss"], func: function(message, txt)
	{
		if (typeof txt[1] == "string")
		{
			// message.delete()
			message.channel.send(":ballot_box: ***VOTE***\n" + txt.slice(1).join(" ")).then(function(msg) {
				msg.react('\u2705');
				msg.react('\u274C');
			})
		}
		else
		{
			message.channel.send("vote on what?")
		}
	}},
	{command: "owoify", aliases: ["owoifier", "uwuify", "uwuifier", "furrify", "furfaginate", "furfaginator"], func: function(message, txt)
	{
		message.channel.send(FurryText(txt.slice(1).join(" ")));
	}},
	{command: "autofurry", aliases: ["autofur", "autouwu", "autoowo", "autofurfagresponder", "automaticallyrespondwithfurryshit"], func: function(message, txt)
	{
		if (typeof txt[1] == "string" && txt[1] != bot.user.id)
		{
			let id = txt[1];
			AutoFurry[id] = (typeof AutoFurry[id] == "undefined" || !AutoFurry[id]);
			message.channel.send(FurryText("automatic furfag responses " + (AutoFurry[id] ? "ENABLED" : "DISABLED") + " for ID " + id) + " lawl!");
		}
		else
		{
			message.channel.send("gib user ID pls ^_^");
		}
	}},
	{command: "clear", func: function(message, txt)
	{
		let target = message.mentions.users.first();
		if (target)
			target = target.id;
		else if (txt[1])
			target = txt[1];
		else
			target = bot.user.id;
		let amt = Number(txt[2]) || 50;
		message.channel.fetchMessages({limit: amt}).then(function(messages)
		{
			messages.forEach(e => {
				if (e.author.id == target)
					e.delete().catch(e => {});
			})
		});
	}},
	{command: "wisdom", aliases: ["protip", "lifeprotip", "tip", "lifehack"], help: "Learn a little of BillardBot's wisdom.", func: function(message, txt) {
		message.channel.send(util.RandomFromArray(WiseWords));
	}},
	{command: "balance", aliases: ["bal", "bekos", "getbekos", "bekoks"], help: "See how many bekos you have.", func: function(message, txt) {
		message.channel.send(GetSenderName(message) + " currently has " + FormatMoney(GetBekos(message.author.id)) + ".");
	}},
	{command: "daily", help: "Get your free daily bekos.", func: function(message, txt) {
		AddBekos(message.author.id, 100);
		message.channel.send(":sunny: You received your " + FormatMoney(100) + " daily allowance. :crescent_moon:");
	}},
	{command: "welfare", aliases: ["welfarecheck", "gibs", "gibz", "gibsme"], help: "sheeeeeeeit, gibs me dat!", func: function(message, txt) {
		AddBekos(message.author.id, 250);
		message.channel.send("The gubsment has gibs'd u a welfare check of " + FormatMoney(250) + ".");
	}},
	{command: "save", aliases: ["savebekos", "savepets"], help: "Save your bekos and pets.", func: function(message, txt) {
		// LoadEligible[message.author.id] = true
		let user_id = message.author.id;
		ValidateKittys(user_id)
		let code = crypt(user_id + "{SPLIT}" + (GetBekos(user_id) * 7) + "{SPLIT}" + JSON.stringify(pets.users[user_id]), "begfedaf");
		message.author.send("Here is your code. Use this with ``" + command_prefix + "load`` to recover your bekos and pets.\n```" + code + "```");
	}},
	{command: "load", aliases: ["loadbekos", "savepets"], help: "Load your bekos and pets.", func: function(message, txt) {
		if (txt[1])
		{
			let a = crypt(txt[1], "begfedaf", true).split("{SPLIT}");
			if (a[0] && a[1] && a[2])
			{
				let user_id = a[0]
				if (user_id == message.author.id)
				{
					bekos[user_id] = a[1] / 7;
					pets.users[user_id] = JSON.parse(a[2]);
					message.channel.send("Progress restored successfully!");
				}
				else
				{
					message.channel.send("This looks like someone else's code.");
				}
			}
			else
			{
				message.channel.send("This code's busted. Probably your fault, but it could also be outdated. Did you copy it correctly?");
			}
		}
		else
		{
			message.channel.send("Usage: ``" + command_prefix + "load <code>``");
		}
	}},
	{command: "decrypt", func: function(message, txt) {
		if (txt[1])
		{
			message.channel.send(crypt(txt.slice(1).join(" "), "begfedaf", true));
		}
	}},
	{command: "cheat_setbekos_lmao", func: function(message, txt) {
		let user = 0;
		let amt = 0;
		if (txt.length > 2)
		{
			user = txt[1];
			amt = Number(txt[2])
		}
		else if (txt.length == 2)
		{
			user = message.author.id;
			amt = Number(txt[1]);
		}
		if (user == "all" || user == "*" || user == "everyone" || user == "everybody")
		{
			for (const id in bekos)
			{
				bekos[id] = amt;
			}
		}
		else
		{
			bekos[user] = amt;
		}
		message.delete();
	}},
	{command: "flip", func: function(message, txt) {
		if (typeof txt[1] == "undefined")
		{
			message.channel.send("How many bekos?");
		}
		else
		{
			let mekos = GetBekos(message.author.id);
			let amt;
			switch (txt[1])
			{
				case "allin":
				case "max":
				case "all":
					amt = mekos;
					break;

				case "half":
					amt = Math.ceil(mekos / 2);
					break;

				case "quarter":
					amt = Math.ceil(mekos / 4);
					break;

				case "eighth":
					amt = Math.ceil(mekos / 8);
					break;

				case "sixteenth":
					amt = Math.ceil(mekos / 16);
					break;

				case "thirtysecond":
					amt = Math.ceil(mekos / 32);
					break;

				case "sixtyfourth":
					amt = Math.ceil(mekos / 64);
					break;

				default:
					amt = Number(txt[1])
					if (isNaN(amt))
					{
						message.channel.send("Did you make a typo?");
						return;
					}
					break;
			}
			if (amt < 0)
			{
				message.channel.send("nice try, buddy. that bug got FIXED!");
			}
			else if (amt == 0)
			{
				message.channel.send("oh haha i get it what a cool bet!");
			}
			else if (amt > mekos)
			{
				message.channel.send("You don't have that many bekos!");
			}
			else
			{
				let rand = Math.floor(Math.random() * 2);
				AddBekos(message.author.id, amt * (rand ? 1 : -1));
				message.channel.send(GetSenderName(message) + " has gambled :yen: **" + AddCommas(amt) + "** on a coinflip and **" + (rand ? "WON" : "LOST") + "**!\n" + GetSenderName(message) + " now has :yen: **" + AddCommas(GetBekos(message.author.id)) + "**.");
			}
		}
	}},
	{command: "pets", aliases: ["kittys"], func: function(message, txt) {
		ValidateKittys(message.author.id)
		let user = pets.users[message.author.id];
		let kittys = "";
		for (const pet_id in user.pets)
		{
			let pet = user.pets[pet_id]
			let breed_obj = pets.data.breeds[pet.breed_index];
			kittys += "\n ``#" + (Number(pet_id) + 1) + "``   " + breed_obj.emoji + " **" + breed_obj.name + "** (*" + pet.name + "*)   " + HealthBar(pet.health, pet.max_health);
		}
		if (kittys == "")
		{
			message.channel.send("You have no pets!");
			return
		}
		message.channel.send("**" + GetSenderName(message) + "'s Pets**" + kittys);
	}},
	{command: "stats", aliases: ["pet"], help: "View a pet's stats.", func: function(message, txt) {
		ValidateKittys(message.author.id)
		if (txt[1])
		{
			let petnum = Number(txt[1])
			if (isNaN(petnum) || petnum < 1 || petnum > pets.users[message.author.id].pets.length)
			{
				message.channel.send("Invalid pet #.");
			}
			else
			{
				let pet_obj = pets.users[message.author.id].pets[petnum - 1];
				let breed = pets.data.breeds[pet_obj.breed_index];
				message.channel.send(breed.emoji + " **" + pet_obj.name + "'s Stats**\n" + HealthBar(pet_obj.health, pet_obj.max_health));
			}
		}
		else
		{
			message.channel.send("Usage: ``" + command_prefix + "stats <pet #>``");
		}
	}},
	{command: "euthanize", aliases: ["killpet"], help: "Put down one of your pets.", func: function(message, txt) {
		ValidateKittys(message.author.id)
		if (txt[1])
		{
			let user = pets.users[message.author.id];
			if (txt[1] == "*" || txt[1] == "all")
			{
				let msg = "";
				let len = user.pets.length;
				for (let i = 0; i < len; i++)
				{
					msg += ":skull_crossbones: " + user.pets[i].name + " has died. :skull_crossbones:\n";
				}
				if (len > 2)
				{
					msg += "**" + GetSenderName(message) + "** is a horrible person...";
				}
				user.pets = [];
				message.channel.send(msg);
			}
			else
			{
				let petnum = Number(txt[1])
				if (isNaN(petnum) || petnum < 1 || petnum > user.pets.length)
				{
					message.channel.send("Invalid pet #.");
				}
				else
				{
					message.channel.send(":skull_crossbones: " + FormatPet(user.pets[petnum - 1]) + " has died. :skull_crossbones:");
					user.pets.splice(petnum - 1, 1);
				}
			}
		}
		else
		{
			message.channel.send("Usage: ``" + command_prefix + "euthanize <pet #>``");
		}
	}},
	{command: "inventory", aliases: ["inv", "snacks", "items"], help: "View your pet snack inventory.", func: function(message, txt) {
		ValidateKittys(message.author.id)
		let items = "";
		let inventory = pets.users[message.author.id].snacks;
		for (const item in inventory)
		{
			if (inventory[item] < 1)
			{
				continue;
			}
			let item_obj = pets.data.snacks[item];
			items += "\n" + ItemStack(item_obj.emoji ? item_obj.emoji : ":" + item_obj.name.toLowerCase() + ":", inventory[item])
		}
		if (items == "")
		{
			items = "\n...nothing? :sob:"
		}
		message.channel.send("**" + GetSenderName(message) + "'s Snacks**" + items);
	}},
	{command: "feed", aliases: ["eat", "feedpet"], help: "Feed one of your pets.", func: function(message, txt) {
		ValidateKittys(message.author.id)
		if (txt.length > 2)
		{
			let petnum = Number(txt[1]);
			if (isNaN(petnum) || petnum < 1 || petnum > pets.users[message.author.id].pets.length)
			{
				message.channel.send("Invalid pet #.");
			}
			else
			{
				let snack_name = txt[2].toLowerCase();
				let snack_tab = pets.data.snacks[snack_name]
				if (snack_tab)
				{
					let user_tab = pets.users[message.author.id];
					let pet_tab = user_tab.pets[petnum - 1];
					if (pet_tab.health >= pet_tab.max_health)
					{
						message.channel.send(FormatPet(pet_tab) + " is not hungry.");
					}
					else
					{
						if (user_tab.snacks[snack_name] && user_tab.snacks[snack_name] > 0)
						{
							user_tab.snacks[snack_name]--;
							let new_health = pet_tab.health + snack_tab.health;
							if (new_health > pet_tab.max_health)
							{
								new_health = pet_tab.max_health;
							}
							pet_tab.health = new_health;
							message.channel.send("You fed " + FormatPet(pet_tab) + " some " + FormatSnack(snack_tab) + ".")
						}
						else
						{
							message.channel.send("You don't have any " + snack_name + ".");
						}
					}
				}
				else
				{
					message.channel.send("I don't know what a " + snack_name + " is.");
				}
			}
		}
		else
		{
			message.channel.send("Usage: ``" + command_prefix + "feed <pet #> <snack>``");
		}
	}},
	{command: "beat", aliases: ["slap", "hit"], help: "Discipline your pet for 1 damage.", func: function(message, txt) {
		ValidateKittys(message.author.id)
		if (txt.length > 1)
		{
			let petnum = Number(txt[1]);
			if (isNaN(petnum) || petnum < 1 || petnum > pets.users[message.author.id].pets.length)
			{
				message.channel.send("Invalid pet #.");
			}
			else
			{
				let user = pets.users[message.author.id];
				let pet = user.pets[petnum - 1];
				if (pet.health < 2)
				{
					message.channel.send(":skull_crossbones: " + FormatPet(pet) + " has died of slap wound. :skull_crossbones:");
					user.pets.splice(petnum - 1, 1);
				}
				else
				{
					pet.health--;
					message.channel.send("You hit " + FormatPet(pet) + ".")
				}
			}
		}
		else
		{
			message.channel.send("Usage: ``" + command_prefix + "beat <pet #>``");
		}
	}},
	{command: "adopt", help: "Adopt a pet.", func: function(message, txt) {
		ValidateKittys(message.author.id)
		if (txt.length > 1)
		{
			let adopt_index = Number(txt[1])
			if (isNaN(adopt_index) || adopt_index < 1 || adopt_index > pets.data.adoptable_max)
			{
				message.channel.send("Usage: ``" + command_prefix + "adopt <1-" + pets.data.adoptable_max + "> [name]``")
			}
			else
			{
				let adopt_obj = pets.data.adoptable[adopt_index - 1];
				if (GetBekos(message.author.id) >= adopt_obj.price)
				{
					AddBekos(message.author.id, adopt_obj.price * -1)
					let breed = pets.data.breeds[adopt_obj.index];
					let new_pet = {breed_index: adopt_obj.index};
					new_pet.name = txt[2] ? txt.slice(2).join(" ") : "unnamed";
					for (const stat_index in breed.stats)
					{
						let stat = breed.stats[stat_index];
						new_pet[stat.name] = util.RandomInt(stat.min, stat.max);
					}
					new_pet.max_health = new_pet.health;
					pets.users[message.author.id].pets.push(new_pet);
					message.channel.send("Congratulations! You adopted a " + breed.emoji + " **" + breed.name + "**" + (txt[2] ? " named **" + new_pet.name + "**" : "") + "!");
				}
				else
				{
					message.channel.send("You can't afford that!");
				}
			}
		}
		else
		{
			let kittys = "";
			for (const pet_id in pets.data.adoptable)
			{
				let pet = pets.data.adoptable[pet_id]
				let breed_obj = pets.data.breeds[pet.index];
				kittys += "\n ``#" + (Number(pet_id) + 1) + "``   " + breed_obj.emoji + " **" + breed_obj.name + "**    " + FormatMoney(pet.price);
			}
			message.channel.send("**Animals for Adoption**" + kittys);
		}
	}},
	{command: "shop", aliases: ["buy", "store", "purchase"], func: function(message, txt) {
		ValidateKittys(message.author.id)
		if (txt.length > 1)
		{
			let item = txt[1]
			if (pets.data.snacks[item])
			{
				let price = pets.data.snacks[item].health * 6;
				let id = message.author.id;
				let bekos = GetBekos(id)
				if (bekos >= price)
				{
					if (!pets.users[id].snacks[item])
					{
						pets.users[id].snacks[item] = 0
					}
					pets.users[id].snacks[item]++
					AddBekos(id, price * -1)
					let item_obj = pets.data.snacks[item]
					message.channel.send("You bought " + (item_obj.emoji ? item_obj.emoji : ":" + item_obj.name.toLowerCase() + ":") + " **" + item_obj.name + "**.")
				}
				else
				{
					message.channel.send("You can't afford that!")
				}
			}
			else
			{
				message.channel.send("Unknown item." + " Type ``" + command_prefix + "shop`` for a list of items.");
			}
		}
		else
		{
			let items = {};
			for (const snack_id in pets.data.snacks)
			{
				let price = pets.data.snacks[snack_id].health * 6;
				if (!items[price])
				{
					items[price] = [];
				}
				items[price].push(snack_id);
			}
			let stock = "";
			for (const price in items)
			{
				stock += "\n" + FormatMoney(price) + "    -->    ";
				for (const snack_id_index in items[price])
				{
					let snack_id = items[price][snack_id_index];
					let snack = pets.data.snacks[snack_id];
					if (snack.emoji)
					{
						stock += snack.emoji;
					}
					else
					{
						stock += ":" + snack.name.toLowerCase() + ":";
					}
				}
			}
			message.channel.send(":shopping_cart: **Billard Co**:tm:\n*Your one-stop shop for pet food!*\n\n**In Stock:**" + stock);
		}
	}},
	// TEMP
	{command: "refreshadoption", aliases: ["newpetlist"], func: function(message, txt) {
		pets.data.adoptable = [
			{index: util.RandomInt(0, 4), price: util.RandomInt(30, 60)},
			{index: util.RandomInt(0, 6), price: util.RandomInt(50, 80)},
			{index: util.RandomInt(0, 8), price: util.RandomInt(70, 100)},
			{index: util.RandomInt(0, 10), price: util.RandomInt(90, 120)},
		];
	}}
];

bot_commands.push({command: "help", aliases: ["wiki", "info"], args: "[command]", help: "Find out more about BillardBot's commands.", func: function(message, txt)
{
	if (txt[1])
	{
		let cmd = txt[1]
		let help = GetCommandHelpText(cmd);
		message.channel.send(help ? "Help for **" + cmd + "**\n```" + help + "```" : "Error 69XD: Unknown command \"" + cmd + "\" (core dumped)");
	}
	else
	{
		let help = "Command List\n```";
		for (let i in bot_commands)
		{
			help += GetCommandHelpText(bot_commands[i].command) + "\n\n";
		}
		message.channel.send(help + "```");
	}
}})

// more efficient method of adding commands
function LoopForBotCommand(msg, txt, i)
{
	if (!i) {i = 0;}
	if (!bot_commands[i]) {return false;}
	var cmd = bot_commands[i].command;
	if (!bot_commands[i].no_prefix)
	{
		cmd = command_prefix + cmd;
	}
	if (txt[0].toLowerCase() == cmd.toLowerCase())
	{
		bot_commands[i].func(msg, txt);
		return true;
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
				bot_commands[i].func(msg, txt);
				return true;
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

const thanks_wins = [
	"thanks billardbot",
	"thanks, billardbot",
	"many thanks billardbot",
	"many thanks, billardbot",
	"thank you billardbot",
	"thank you, billardbot"
];

var confirmations = {};

bot.on("message", message =>
{
	if (message.author.bot)
		return;

	var txt = message.content.split(" ");
	var raw = message.content.toLowerCase();

	if (LoopForBotCommand(message, txt)) {return;}

	if (confirmations[message.author.id])
	{
		if (raw.charAt(0) == 'y' && (raw.charAt(1) == 'e' || raw.charAt(1) == 'a'))
		{
			confirmations[message.author.id](message, txt)
		}
		else
		{
			message.channel.send(raw.charAt(0) == 'n' ? "ok nvm then" : "I'll take that as a no...")
		}
		confirmations[message.author.id] = false
	}

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
		if (Math.floor(Math.random() * 100) == 0) {return message.channel.send("suck my fuck, dick weed");}
		message.channel.send("your opinion is wrong");
	}
	else if (txt[0].toLowerCase() == "splish" && txt[1].toLowerCase() == "splash" && txt.length == 2)
	{
		if (Math.floor(Math.random() * 100) == 0) {return message.channel.send("fuck you, loser");}
		message.channel.send("your opinion is trash");
	}
	else if (util.ArrayHasValue(thanks_wins, raw))
	{
		message.channel.send("thillardbot");
	}
	else if (AutoFurry[message.author.id])
	{
		message.channel.send(FurryText(message.content))
	}
});

bot.login(token);
