
// -----------------------------------------
// ------------- EPIC BOT WARS -------------
// -----------------------------------------
// ----- discord bot spoof of epic pet -----
// ----- wars, a mobile game from 2009 -----
// -----------------------------------------

let s = {
	["r" + "e" + "v" + "f"]: function(arr)
	{
		let str = "";
		for (let i = 0; i < arr.length; i++)
		{
			str = arr[i] + str;
		}
		return str;
	}
};

const DEBUG = true;
const Discord = require("discord.js");
const bot = new Discord.Client(); 

const SLOT_NULL = 0;
const SLOT_BACKPACK = 1;
const SLOT_ACCESSORIES = 2;
const SLOT_WEAPON = 3;
const SLOT_HAT = 4;
const SLOT_SHOE = 5;

const maxcarry = {
	[SLOT_NULL]: 0,
	[SLOT_BACKPACK]: 24,
	[SLOT_ACCESSORIES]: 4,
	[SLOT_WEAPON]: 1,
	[SLOT_HAT]: 1,
	[SLOT_SHOE]: 1
}

const illegal_characters = "*`";

const TYPE_NULL = 0;
const TYPE_CONSUMABLE = 1;
const TYPE_EQUIP = 2;
const TYPE_WEAPON = 3;
const TYPE_HAT = 4;
const TYPE_SHOE = 5;
const TYPE_MATERIAL = 6;
const TYPE_TOOL = 7;

const common_errors = {
	invalid_user: "Invalid user.",
	invalid_item: "Invalid item.",
	invalid_character: "Invalid character.",
	invalid_job: "Invalid job.",
	invalid_religion: "Invalid religion.",
	invalid_mood: "Invalid mood.",
	invalid_category: "Invalid category.",
	invalid_location: "Invalid location.",
	cant_during_fight: "You can't do that during a fight.",
	already_fighting: "You are already in a fight.",
	not_fighting: "You aren't fighting anyone.",
	not_enough_money: "You don't have enough money for that.",
	not_for_sale: "That item isn't for sale.",
	item_uncraftable: "That item can't be crafted.",
	bad_ingredients: "You lack the right ingredients.",
	not_enough_energy: "You're too tired.",
}

const translate_types = {
	[TYPE_NULL]: false,
	[TYPE_CONSUMABLE]: "Consumable",
	[TYPE_EQUIP]: "Accessory",
	[TYPE_WEAPON]: "Weapon",
	[TYPE_HAT]: "Wearable",
	[TYPE_SHOE]: "Wearable",
	[TYPE_MATERIAL]: "Material",
	[TYPE_TOOL]: "Tool"
}

const stackable_types = {
	[TYPE_CONSUMABLE]: true,
	[TYPE_MATERIAL]: true
}

const canlist = {
	locations: true,
	items: true,
	characters: true,
	jobs: true,
	effects: true,
	religions: true,
	monsters: true,
	moods: true
}

const loot_tiers = ["Terrible", "Bad", "Good", "Epic", "Legendary"];

const FIGHT_NULL = 0;
const FIGHT_PLAYER = 1;
const FIGHT_MONSTER = 2;

const max_energy = 30;

const STAT_NULL = 0;
const STAT_BUFF = 1;
const STAT_DEBUFF = 2;

const data_format = "3_1_0";

const default_accuracy = 10;

// classy utils :cool_sunglasses:
function numcomma(x) {var parts = x.toString().split("."); parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ","); return parts.join(".");}
function rand(min, max) {return Math.floor(Math.random() * (max - min + 1)) + min;}
function randfrom(arr) {return arr[Math.floor(Math.random() * arr.length)];}
function diff(a, b) {return Math.abs(a - b);}
function roundf_old(num) {return Math.round(num * 100) / 100;}
function roundf(num) {return num.toFixed(2);}
function msend(m, t) {return m.channel.send(t);}
function mpriv(m, t) {return m.author.send(t);}
function merror(m, e) {return msend(m, errorf(e));}
function senderid(msg) {return msg.author.id;}
function errorf(str) {return str + " :no_entry:";}
function deathf(str) {return ":skull: **" + str + "** has died :skull:";}
function emotefraw(item) {return (item.emote == undefined ? item.name.toLowerCase() : item.emote);}
function emotef(item) {return ":" + emotefraw(item) + ":";}
function typef(type) {if (type == undefined || !translate_types[type]) return ""; return " - _" + translate_types[type] + "_";}
function moneyf(count) {return ":yen: " + numcomma(count);}
function moneyf_short(count) {return "¥" + numcomma(count);}
function contains(a, b) {for (let i = 0; i < a.length; i++) {if (a[i] == b) {return true;}} return false;}
function conflict(a, b) {for (let i = 0; i < a.length; i++) {if (contains(b, a[i])) {return true;}} return false;}
function statf(name, num) {return num < 0 ? num + " " + name : "+" + num + " " + name;}
function objf(obj) {return emotef(obj) + " **" + obj.name + "**" + typef(obj.type) + statsf(obj.stats) + "\n";}
function minf(obj) {return emotef(obj) + " **" + obj.name + "**";}
function itemf(id) {return objf(wars.items[id]);}
function minitemf(id) {return minf(wars.items[id]);}
function getinv(id) {if (!validuser(id)) return; return wars.users[id].inventory;}
function religf(name) {return emotef(wars.religions[name]) + " **" + wars.religions[name].adj + "**"}
function namef(userid) {return "**" + wars.users[userid].cached_name + "**";}
function stackf(itemid, count) {return (count > 1 ? numcomma(count) + "x " : "") + minitemf(itemid);}
function validuser(userid) {return wars.users[userid] != undefined;}
function fighting(userid) {return wars.users[userid].fighting;}
function monsterloot(monsterid) {return wars.monsters[monsterid].loot;}
function isdead(userid) {return getstat(wars.users[userid], "health") < 1;}
function wikif(id, subtable)
{
	if (subtable == "items")
	{
		let extra = "";
		let craftable = [];
		for (let itemid in wars.items)
		{
			let recipe = getstat(itemid, "recipe");
			if (!recipe) continue;
			for (let i = 0; i < recipe.ingredients.length; i++)
			{
				if (recipe.ingredients[i].id == id) craftable.push(minitemf(itemid));
			}
		}
		if (craftable.length > 0) extra += "Used to craft " + commalistf(craftable) + ".\n";
		let droppable = [];
		for (let monsterid in wars.monsters)
		{
			let lootitems = wars.monsters[monsterid].loot.items;
			for (let i = 0; i < lootitems.length; i++)
			{
				if (lootitems[i].id == id) droppable.push(objf(wars.monsters[monsterid]));
			}
		}
		if (droppable.length > 0) extra += "Dropped by " + commalistf(droppable) + ".";
		return itemf(id) + extra;
	}
	else
	{
		return objf(wars[subtable][id]);
	}
}
function pickmonster(monsters)
{
	let arr = [];
	for (let i = 0; i < monsters.length; i++)
	{
		for (let j = 0; j < monsters[i].weight; j++)
		{
			arr.push(monsters[i].id);
		}
	}
	return randfrom(arr);
}
function roman(num)
{
	let str = "";
	for (let i = 0; i < Math.floor(num / 1000); i++) str += 'M';
	num %= 1000;
	for (let i = 0; i < Math.floor(num / 500); i++) str += 'D';
	num %= 500;
	for (let i = 0; i < Math.floor(num / 100); i++) str += 'C';
	num %= 100;
	for (let i = 0; i < Math.floor(num / 50); i++) str += 'L';
	num %= 50;
	for (let i = 0; i < Math.floor(num / 10); i++) str += 'X';
	num %= 10;
	if (Math.floor(num) == 9)
	{
		return str + "IX";
	}
	else
	{
		for (let i = 0; i < Math.floor(num / 5); i++) str += 'V';
	}
	num %= 5;
	if (Math.floor(num) == 4)
	{
		return str + "IV";
	}
	else
	{
		for (let i = 0; i < Math.floor(num); i++) str += 'I';
	}
	return str;
}
function crypt(data, cipher, decrypt)
{
	let s = 1
	if (decrypt)
	{
		s *= -1;
	}
	var output = "";
	for (var i = 0, j = 0; i < data.length; i++)
	{
		var c = data.charCodeAt(i);
		var j = cipher[i % cipher.length].toLowerCase().charCodeAt() - ('a').charCodeAt() * -2;
		output += String.fromCharCode(c + (j * s));
	}
	return output;
}
function energyf(amt)
{
	let str = ":high_brightness: ";
	if (amt > 0)
	{
		str += "``";
	}
	else
	{
		return str + "Exhausted";
	}
	for (let i = 0; i < amt; i++)
	{
		str += "|";
	}
	str += "``";
	return str;
}
function newuser(user)
{
	if (wars.users[user.id] == undefined)
	{
		resetuser(user.id, user.username);
		user.send("Welcome to **Epic Bot Wars**!\nWe've got a starter character for you, type ``" + wars.command_prefix + "profile`` to take a look.");
	}
	userupdate(user.id);
}
function userupdate(userid)
{
	setstat(wars.users[userid], "max_health", statsum(userid, "max_health"));
	if (getstat(wars.users[userid], "health") == 0)
	{
		setstat(wars.users[userid], "health", getstat(wars.users[userid], "max_health"))
	}
	let hp = getstat(wars.users[userid], "health");
	let overheal = Math.floor(getstat(wars.users[userid], "max_health") * 1.5);
	if (hp > overheal) setstat(wars.users[userid], "health", overheal);
	let alc = getstat(wars.users[userid], "drunk");
	if (alc > 20) {
		wars.users[userid].effects["buzzed"] = true;
	} else if (alc > 5) {
		wars.users[userid].effects["wasted"] = true;
	} else {
		wars.users[userid].effects["buzzed"] = false;
		wars.users[userid].effects["wasted"] = false;
	}
	applyimmunities(userid);
}
function itemlistf(list, titledata, x)
{
	let str = "";
	if (titledata != undefined)
	{
		str += emotef(titledata) + " **" + titledata.name + "**\n";
	}
	if (list.length < 1) return str + "Empty!";
	let empty = true;
	for (let i = 0; i < list.length; i++)
	{
		let item = list[i];
		if (item.count < 1) continue;
		empty = false;
		str += stackf(item.id, item.count) + ((x == undefined) ? "" : " (" + (wars.stats[x].custom_formatting == undefined ? statf(x, getstat(wars.items[item.id], x)) : wars.stats[x].custom_formatting(getstat(wars.items[item.id], x))) + ")") + "        ";
	}
	if (empty) str += "Empty!";
	return str;
}
function invf(userid)
{
	if (!validuser(userid)) return;
	return itemlistf(getinv(userid), {name:"Inventory", emote:"school_satchel"});
}
function shopf()
{
	let arr = [];
	for (let item in wars.items)
	{
		if (getstat(wars.items[item], "price"))
		{
			arr.push({id:item, count:1});
		}
	}
	return itemlistf(arr, {name:"Shop", emote:"shopping_cart"}, "price");
}
function healthf(hp, max)
{
	let str = "";
	for (let i = 0; i < Math.min(hp, max); i++)
	{
		str += ":heart:";
	}
	if (max > hp)
	{
		for (let i = 0; i < max - hp; i++)
		{
			str += ":black_heart:";
		}
	}
	else
	{
		for (let i = 0; i < hp - max; i++)
		{
			str += ":yellow_heart:";
		}
	}
	return str;
}
function resetuser(userid, uname)
{
	let deaths = 0;
	let name = uname;
	if (wars.users[userid] != undefined)
	{
		deaths = wars.users[userid].deaths;
		name = uname == undefined ? wars.users[userid].cached_name : uname;
	}
	wars.users[userid] = wars.users["default"];
	wars.users[userid].deaths = deaths;
	wars.users[userid].cached_name = name;
	userupdate(userid);
}
function statsf(starr)
{
	if (starr == undefined || starr.length == 0) {return "";}
	let str = "\n```";
	for (let i = 0; i < starr.length; i++)
	{
		if (starr[i].hide) continue;
		tab = wars.stats[starr[i].id];
		if (tab.custom_formatting == undefined)
		{
			str += statf(tab.name, starr[i].val);
		}
		else
		{
			str += tab.custom_formatting(starr[i].val);
		}
		str += "\n";
	}
	return str + "```";
}
function profilef(userid)
{
	if (!validuser(userid)) {return errorf(common_errors.invalid_user);}
	let tab = wars.users[userid];
	let str = ":crossed_swords: " + namef(userid) + " :crossed_swords:\n";
	str += "\n";
	str += "       " + emotef(wars.items[tab.equipped[SLOT_HAT]]) + "                  " + minf(wars.moods[tab.mood]) + "\n";
	str += "       " + emotef(wars.characters[tab.character]) + emotef(wars.items[tab.equipped[SLOT_WEAPON]]) + "           " + religf(tab.religion) + "\n";
	let shoe = emotef(wars.items[tab.equipped[SLOT_SHOE]])
	str += "    " + shoe + shoe + "              " + minf(wars.locations[tab.location]) + "\n\n";
	let access = "";
	let noacc = true;
	for (let i = 0; i < tab.equipped[SLOT_ACCESSORIES].length; i++)
	{
		let emote;
		if (tab.equipped[SLOT_ACCESSORIES][i])
		{
			emote = emotef(wars.items[tab.equipped[SLOT_ACCESSORIES][i]]);
		}
		else
		{
			emote = ":x:";
		}
		access += emote + "    ";
	}
	str += "        " + access + "\n\n";
	str += "    " + ":shield: Defense: **" + statsum(userid, "defense") + "**      :beer: Blood Alcohol: **" + roundf(getstat(wars.users[userid], "drunk") * 0.15) + "**%\n";
	str += "    " + ":books: Intellect: **" + statsum(userid, "intel") + "**      :crystal_ball: Wisdom: **" + statsum(userid, "wisdom") + "**\n";
	str += "    " + ":four_leaf_clover: Luck: **" + statsum(userid, "luck") + "**      :gem: Charm: **" + statsum(userid, "charm") + "**\n\n";
	let effects = [];
	for (effect in tab.effects)
	{
		if (tab.effects[effect]) effects.push(effect);
	}
	if (effects.length > 0)
	{
		str += "    **Status Effects**\n";
		for (let i = 0; i < effects.length; i++)
		{
			str += minf(wars.effects[effects[i]]) + "      ";
		}
		str += "\n\n";
	}
	str += "    " + energyf(getstat(tab, "energy")) + "\n\n";
	str += "    " + healthf(getstat(tab, "health"), getstat(tab, "max_health")) + "\n\n";
	str += "  *" + tab.slogan + "*\n";
	return str;
}
function getstat(obj, stat)
{
	if (typeof obj == "string") obj = wars.items[obj];
	if (!obj || !obj.stats) return;
	for (let i = 0; i < obj.stats.length; i++)
	{
		if (obj.stats[i].id == stat)
		{
			return obj.stats[i].val;
		}
	}
	return 0;
}
function setstat(obj, stat, count)
{
	if (!obj.stats) return;
	for (let i = 0; i < obj.stats.length; i++)
	{
		if (obj.stats[i].id == stat)
		{
			obj.stats[i].val = count;
			return;
		}
	}
	obj.stats.push({id: stat, val: count});
}
function addstat(obj, stat, count)
{
	if (!obj.stats) return;
	setstat(obj, stat, getstat(obj, stat) + count);
}
function mergestats(obj, starr)
{
	if (!obj.stats) return;
	for (let i = 0; i < starr.length; i++)
	{
		addstat(obj, starr[i].id, starr[i].val);
	}
}
function statlist(userid, stat)
{
	if (!validuser(userid)) return;
	let tab = wars.users[userid];
	let arr = [];
	for (let slot in tab.equipped)
	{
		if (slot == SLOT_ACCESSORIES)
		{
			for (let i = 0; i < tab.equipped[slot].length; i++)
			{
				if (tab.equipped[slot][i]) arr.push(getstat(tab.equipped[slot][i], stat));
			}
		}
		else
		{
			arr.push(getstat(tab.equipped[slot], stat));
		}
	}
	arr.push(getstat(wars.characters[tab.character], stat));
	arr.push(getstat(wars.religions[tab.religion], stat));
	if (stat != "max_health") arr.push(getstat(tab, stat));
	return arr;
}
function applyimmunities(userid)
{
	if (!validuser(userid)) return;
	let arr = statlist(userid, "immunity");
	for (let i = 0; i < arr.length; i++)
	{
		for (let j = 0; j < arr[i].length; j++)
		{
			wars.users[userid].effects[arr[i][j]] = false;
		}
	}
}
function immune(userid, effect)
{
	if (!validuser(userid)) return;
	let arr = statlist(userid, "immunity");
	for (let i = 0; i < arr.length; i++)
	{
		for (let j = 0; j < arr[i].length; j++)
		{
			if (arr[i][j] == effect) return true;
		}
	}
	return false;
}
function statsum(userid, stat)
{
	if (!validuser(userid)) return;
	let tab = wars.users[userid];
	let sum = 0;
	for (let slot in tab.equipped)
	{
		if (slot == SLOT_ACCESSORIES)
		{
			for (let i = 0; i < tab.equipped[slot].length; i++)
			{
				if (tab.equipped[slot][i]) sum += getstat(tab.equipped[slot][i], stat);
			}
		}
		else
		{
			sum += getstat(tab.equipped[slot], stat);
		}
	}
	sum += getstat(wars.characters[tab.character], stat);
	sum += getstat(wars.religions[tab.religion], stat);
	if (stat != "max_health") sum += getstat(tab, stat);
	for (let effect in tab.effects)
	{
		if (tab.effects[effect] && wars.effects[effect].statmod != undefined && wars.effects[effect].statmod[effect] != undefined)
		{
			sum = Math.round(sum * wars.effects[effect].statmod[effect]);
		}
	}
	return sum;
}
function recur_cmd(msg, txt, i)
{
	if (!i) {i = 0;}
	if (!wars.commands[i]) {return;}
	let cmd = wars.commands[i];
	if (txt[0].toLowerCase() == wars.command_prefix + cmd.command.toLowerCase())
	{
		if (cmd.response != undefined)
		{
			return msend(msg, cmd.response);
		}
		if (cmd.alias != undefined)
		{
			txt[0] = wars.command_prefix + cmd.alias;
			return recur_cmd(msg, txt, 0);
		}
		return cmd.func(msg, txt);
	}
	return recur_cmd(msg, txt, i + 1);
}
function pickloot(loot)
{
	let rolls = (typeof loot.rolls == "number") ? loot.rolls : rand(loot.rolls.min, loot.rolls.max);
	let lootitems = [];
	for (let n = 0; n < rolls; n++)
	{
		for (let i = 0; i < loot.items.length; i++)
		{
			for (let j = 0; j < loot.items[i].weight; j++)
			{
				lootitems.push(loot.items[i].id);
			}
		}
	}
	let picked = [];
	for (let i = 0; i < rolls; i++)
	{
		picked.push(randfrom(lootitems));
	}
	let properloot = {};
	for (let i = 0; i < picked.length; i++)
	{
		if (properloot[picked[i]] == undefined)
		{
			properloot[picked[i]] = 1;
		}
		else
		{
			properloot[picked[i]]++;
		}
	}
	let cash = (typeof loot.money == "number") ? loot.money : rand(loot.money.min, loot.money.max);
	properloot["money"] = cash;
	let fucksake = [];
	for (let item in properloot)
	{
		fucksake.push({id:item, count:properloot[item]});
	}
	return fucksake;
}
function giveloot(userid, loot)
{
	let arr = pickloot(loot);
	for (let i = 0; i < arr.length; i++)
	{
		giveitem(userid, arr[i].id, arr[i].count);
	}
}
function giveitems(userid, arr)
{
	for (let i = 0; i < arr.length; i++)
	{
		giveitem(userid, arr[i].id, arr[i].count);
	}
}
function hasitem(userid, itemid, amount)
{
	if (!validuser(userid)) return;
	if (!amount) amount = 1;
	let tab = getinv(userid);
	for (let i = 0; i < tab.length; i++)
	{
		if (tab[i].id == itemid && tab[i].count >= amount)
		{
			return true;
		}
	}
	return false;
}
function giveitem(userid, itemid, amount)
{
	if (!validuser(userid)) return;
	if (!amount) amount = 1;
	if (hasitem(userid, itemid))
	{
		for (let i = 0; i < wars.users[userid].inventory.length; i++)
		{
			if (wars.users[userid].inventory[i].id == itemid)
			{
				return wars.users[userid].inventory[i].count += amount;
			}
		}
	}
	else
	{
		wars.users[userid].inventory.push({id:itemid, count:amount});
	}
}
function takeitem(userid, itemid, amount)
{
	if (!validuser(userid)) return;
	if (!amount) amount = 1;
	if (!hasitem(userid, itemid, amount)) return;
	for (let i = 0; i < wars.users[userid].inventory.length; i++)
	{
		if (wars.users[userid].inventory[i].id == itemid)
		{
			wars.users[userid].inventory[i].count -= amount;
			if (wars.users[userid].inventory[i].count <= 0)
			{
				wars.users[userid].inventory.splice(i, 1);
			}
		}
	}
}
function useitem(userid, itemid)
{
	if (!validuser(userid) || !hasitem(userid, itemid)) return;
	let item = wars.items[itemid];
	let old;
	let ret = "";
	switch (item.type)
	{
		case TYPE_CONSUMABLE:
			ret += "You used " + minitemf(itemid) + ".";
			for (let i = 0; i < item.stats.length; i++)
			{
				let stat = item.stats[i]
				if (typeof stat.val == "number") addstat(wars.users[userid], stat.id, stat.val);
				if (wars.stats[stat.id].use != undefined)
				{
					let usage = wars.stats[stat.id].use(userid, stat.val);
					if (usage) ret += "\n\n" + usage;
				}
			}
			takeitem(userid, itemid, 1);
			break;

		case TYPE_WEAPON:
			old = wars.users[userid].equipped[SLOT_WEAPON]
			wars.users[userid].equipped[SLOT_WEAPON] = itemid;
			takeitem(userid, itemid);
			giveitem(userid, old);
			ret += "You equipped " + minitemf(itemid) + ".";
			break;

		case TYPE_HAT:
			old = wars.users[userid].equipped[SLOT_HAT]
			wars.users[userid].equipped[SLOT_HAT] = itemid;
			takeitem(userid, itemid);
			giveitem(userid, old);
			ret += "You equipped " + minitemf(itemid) + ".";
			break;

		case TYPE_SHOE:
			old = wars.users[userid].equipped[SLOT_SHOE]
			wars.users[userid].equipped[SLOT_SHOE] = itemid;
			takeitem(userid, itemid);
			giveitem(userid, old);
			ret += "You equipped " + minitemf(itemid) + ".";
			break;

		case TYPE_EQUIP:
			old = wars.users[userid].equipped[SLOT_ACCESSORIES][3];
			wars.users[userid].equipped[SLOT_ACCESSORIES][3] = wars.users[userid].equipped[SLOT_ACCESSORIES][2];
			wars.users[userid].equipped[SLOT_ACCESSORIES][2] = wars.users[userid].equipped[SLOT_ACCESSORIES][1];
			wars.users[userid].equipped[SLOT_ACCESSORIES][1] = wars.users[userid].equipped[SLOT_ACCESSORIES][0];
			wars.users[userid].equipped[SLOT_ACCESSORIES][0] = itemid;
			takeitem(userid, itemid);
			if (old) giveitem(userid, old);
			ret += "You equipped " + minitemf(itemid) + ".";
			break;

		case TYPE_THROWABLE:
			if (!fighting(userid)) return errorf(common_errors.not_fighting);
			takeitem(userid, itemid);
			ret += "You equipped " + minitemf(itemid) + ".";
			break;
	}
	userupdate(userid);
	return ret;
}
function listf_shortened(obj)
{
	let str = "Here's a list of all the items.\nType .info <id> for more info.\n```";
	for (let item in obj)
	{
		str += item + "\n";
	}
	return str + "```";
}
function listf(obj)
{
	let str = "";
	for (let item in obj)
	{
		str += objf(obj[item]) + "\n";
	}
	return str;
}
function damageplayer(userid, damage)
{
	if (!validuser(userid)) return;
	let def = statsum(userid, "defense");
	realdamage = factordef(damage, def);
	addstat(wars.users[userid], "health", -realdamage);
	if (isdead(userid)) userdeath(userid);
}
function factordef(damage, defense)
{
	if (defense > 0)
	{
		damage -= Math.ceil(defense * 0.5);
		if (damage < 1) damage = 1;
	}
	return damage;
}
function fightback(userid)
{
	if (!validuser(userid)) return;
	if (!fighting(userid)) return;
	let tab = wars.users[userid];
	let monstab = wars.monsters[tab.fighting.id];
	let atk = randfrom(monstab.attacks);
	let str = atk.name.replace("{me}", minf(monstab)).replace("{you}", namef(userid));
	let dmgold = getstat(atk, "health") * -1;
	let dmg = factordef(dmgold, statsum(userid, "defense"))
	setstat(atk, "health", dmg * -1);
	mergestats(wars.users[userid], atk.stats);
	setstat(atk, "health", dmgold * -1);
	if (atk.effects != undefined)
	{
		for (let i = 0; i < atk.effects.length; i++)
		{
			if (!wars.users[userid].effects[atk.effects[i]])
			{
				wars.users[userid].effects[atk.effects[i]] = true;
				str += "\n" + minf(monstab) + " has inflicted " + minf(wars.effects[atk.effects[i]]) + " on " + namef(userid) + ".";
				if (immune(userid, atk.effects[i])) str += "\n" + namef(userid) + " is immune to " + minf(wars.effects[atk.effects[i]]) + ".";
			}
		}
	}
	let user = wars.users[userid];
	for (let effect in user.effects)
	{
		let effobj = wars.effects[effect];
		if (effobj.effect != undefined && rand(1, 100) < (effobj.effect.chance * 100))
		{
			mergestats(wars.users[userid], effobj.effect.stats);
			str += "\n" + effobj.effect.message.replace("{me}", minf(effobj)).replace("{you}", namef(userid));
		}
	}
	return str + "\n" + healthf(getstat(user, "health"), getstat(user, "max_health"));
}
function attack(userid)
{
	if (!validuser(userid)) return;
	if (!fighting(userid)) return errorf(common_errors.not_fighting);
	let tab = wars.users[userid];
	if (tab.fighting.type != FIGHT_MONSTER) return "n.i.y.";
	let monstab = wars.monsters[tab.fighting.id];
	let str = namef(userid) + " attacks " + minf(monstab) + ".\n";
	let acc = statsum(userid, "accuracy") + default_accuracy;
	if (rand(1, 10) > acc)
	{
		str += namef(userid) + " misses!" + "\n";
	}
	else
	{
		tab.fighting.health -= statsum(userid, "damage");
	}
	if (tab.fighting.health < 1)
	{
		let oldf = minf(monstab);
		tab.fighting = false;
		let loot = pickloot(monstab.loot);
		giveitems(userid, loot);
		return str + "\n" + namef(userid) + " has defeated the " + oldf + "!\n" + itemlistf(loot, {name:"Loot", emote:"moneybag"});
	}
	let retaliate = fightback(userid);
	userupdate(userid);
	return str + healthf(tab.fighting.health, wars.monsters[tab.fighting.id].health) + "\n" + retaliate;
}
function gather(userid)
{
	if (!validuser(userid)) return;
	if (fighting(userid)) return errorf(common_errors.cant_during_fight);
	let itemid = pickmonster(wars.locations[wars.users[userid].location].resources);
	giveitem(userid, itemid);
	return "You gathered " + minf(wars.items[itemid]) + ".";
}
function encounter(userid, monsterid)
{
	if (!validuser(userid)) return;
	if (fighting(userid)) return errorf(common_errors.already_fighting);
	if (!monsterid) monsterid = pickmonster(wars.locations[wars.users[userid].location].monsters);
	if (!wars.monsters[monsterid]) return errorf(common_errors.invalid_monster);
	wars.users[userid].fighting = {type:FIGHT_MONSTER, id:monsterid, health:wars.monsters[monsterid].health};
	return "A wild " + minf(wars.monsters[monsterid]) + " has appeared!";
}
function commalistf(arr, subtable)
{
	let str = "";
	for (let i = 0; i < arr.length; i++) {
		let name = (subtable == undefined) ? arr[i] : wars[subtable][arr[i]].name;
		if (i == arr.length - 1) {
			if (i > 0)
			{
				str += "and " + name;
			}
			else
			{
				str += name;
			}
		} else {
			str += name + (arr.length == 2 ? " " : ", ");
		}
	}
	return str;
}
function salarycalc(userid, jobid)
{
	if (!validuser(userid)) return;
	let job = wars.jobs[jobid];
	if (jobid == undefined || job == undefined) return;
	let user = wars.users[userid];
	let salary = getstat(job, "salary");
	let statbonus = getstat(job, "statbonus");
	if (statbonus != undefined)
	{
		salary += Math.ceil(statsum(userid, statbonus.id) * (statbonus.val - 1));
	}
	return Math.round(salary);
}
function work(userid, jobid)
{
	if (!validuser(userid)) return;
	if (fighting(userid)) return errorf(common_errors.cant_during_fight);
	let job = wars.jobs[jobid];
	if (jobid == undefined || job == undefined) return errorf(common_errors.invalid_job);
	let user = wars.users[userid];
	let userenergy = getstat(user, "energy");
	let jobenergy = getstat(job, "energycost");
	if (jobenergy > userenergy) return errorf(common_errors.not_enough_energy);
	addstat(wars.users[userid], "energy", -jobenergy);
	let salary = salarycalc(userid, jobid)
	giveitem(userid, "money", salary);
	return minf(job) + " complete!\nSalary: " + stackf("money", salary);
}
function isvalidformatversion(str)
{
	for (let i = 0; i < str.length; i++)
	{
		let code = str.charCodeAt(i);
		if ((code > 57 || code < 48) && (code != 95)) return false;
	}
	return true;
}
function codeitemstackf(item) {return (item.count > 1 ? numcomma(item.count) + " x " : "") + wars.items[item.id].name;}

const token = DEBUG ? s.revf(["_HUvzSc", "ujgMafnoviKW_", "QVA.KP1KvKk", "jM0MTc3.XOk", "NjI1Mzk1N", "MjU3NDIz"]) : process.env.BOT_TOKEN;
let wars = {
	command_prefix: ".",
	commands: [
		{command:"all", alias:"list"},
		{command:"list", func: function(msg, txt) {
			let type = txt[1];
			if (canlist[type])
			{
				if (type == "items")
				{
					return msend(msg, listf_shortened(wars[type]))
				}
				else
				{
					return msend(msg, listf(wars[type]))
				}
			}
			return msend(msg, errorf(common_errors.invalid_category) + "\nValid categories: locations, items, characters, effects, religions, monsters, moods");
		}},
		{command:"lookup", alias:"info"},
		{command:"wiki", alias:"info"},
		{command:"info", func: function(msg, txt) {
			let id = txt[1];
			if (txt[2] != undefined)
			{
				txt[0] = "";
				id = txt.join("");
			}
			if (id == undefined) return merror(msg, common_errors.query_empty);
			for (type in canlist)
			{
				if (wars[type][id] != undefined) return msend(msg, wikif(id, type));
			}
			return merror(msg, common_errors.invalid_query);
		}},
		{command:"open", alias:"use"},
		{command:"useitem", alias:"use"},
		{command:"equip", alias:"use"},
		{command:"eat", alias:"use"},
		{command:"drink", alias:"use"},
		{command:"use", func: function(msg, txt) {
			let item = txt[1];
			if (item == undefined || wars.items[item] == undefined) return merror(msg, common_errors.invalid_item);
			let usage = useitem(senderid(msg), item)
			if (usage) msend(msg, usage);
		}},
		{command:"calc", alias:"salary"},
		{command:"calculate", alias:"salary"},
		{command:"salarycalc", alias:"salary"},
		{command:"calcsalary", alias:"salary"},
		{command:"salary", func: function(msg, txt) {
			let job = txt[1];
			if (job == undefined || wars.jobs[job] == undefined) return merror(msg, common_errors.invalid_job);
			let calc = salarycalc(senderid(msg), job)
			if (calc) msend(msg, "Estimated salary: " + stackf("money", calc));
		}},
		{command:"dojob", alias:"work"},
		{command:"job", alias:"work"},
		{command:"dowork", alias:"work"},
		{command:"work", func: function(msg, txt) {
			let job = txt[1];
			if (job == undefined || wars.jobs[job] == undefined) return merror(msg, common_errors.invalid_job);
			let ret = work(senderid(msg), job)
			if (ret) msend(msg, ret);
		}},
		{command:"duel", alias:"challenge"},
		{command:"challenge", func: function(msg, txt) {
			let tuser = message.mentions.users.first();
			let target = target.id;
			if (!tuser || !validuser(target)) return merror(msg, common_errors.invalid_user);
			
		}},
		{command:"encounter", alias:"walk"},
		{command:"walk", func: function(msg, txt) {msend(msg, encounter(senderid(msg)));}},
		{command:"spawnmonster", alias:"summon"},
		{command:"summon", func: function(msg, txt) {msend(msg, encounter(senderid(msg), txt[1]));}},
		{command:"collect", alias:"gather"},
		{command:"gather", func: function(msg, txt) {
			let userid = senderid(msg);
			msend(msg, gather(userid));
			if (rand(1, 3) == 3) msend(msg, encounter(userid));
		}},
		{command:"spawnitem", alias:"give"},
		{command:"cheatitem", alias:"give"},
		{command:"give", func: function(msg, txt) {
			let item = txt[1];
			if (item == undefined || wars.items[item] == undefined) return merror(msg, common_errors.invalid_item);
			let amount = txt[2] == undefined ? 1 : parseInt(txt[2], 10);
			giveitem(senderid(msg), item, amount);
			msend(msg, "Gave you " + stackf(item, amount) + ".");
		}},
		{command:"backpack", alias:"inventory"},
		{command:"stuff", alias:"inventory"},
		{command:"items", alias:"inventory"},
		{command:"inv", alias:"inventory"},
		{command:"inventory", func: function(msg, txt) {msend(msg, invf(senderid(msg)));}},
		{command:"catchphrase", alias:"slogan"},
		{command:"slogan", func: function(msg, txt) {
			txt[0] = "";
			let slogan = txt.join(" ").trim();
			if (slogan.length < 1) return merror(msg, "Slogan cannot be empty.");
			if (slogan.length > 80) return merror(msg, "Slogan too long.");
			if (conflict(slogan, illegal_characters)) return merror(msg, "Slogan contains illegal characters.");
			wars.users[senderid(msg)].slogan = slogan;
			msend(msg, "Your slogan has been set to ``" + slogan + "``.");
		}},
		{command:"numeraltest", func: function(msg, txt) {
			let str = "``";
			for (let i = 0; i < 5; i++)
			{
				let num = rand(1, Math.pow(10, (i + 1)));
				str += numcomma(num) + " ---> " + roman(num) + "\n";
			}
			msend(msg, str  + "``");
		}},
		{command:"fight", alias:"attack"},
		{command:"attack", func: function(msg, txt) {
			let ret = attack(senderid(msg));
			if (ret) msend(msg, ret);
		}},
		{command:"go", alias:"location"},
		{command:"goto", alias:"location"},
		{command:"travel", alias:"location"},
		{command:"location", func: function(msg, txt) {
			let newloc = txt[1];
			if (newloc == undefined || wars.locations[newloc] == undefined) return merror(msg, common_errors.invalid_location);
			let loctab = wars.locations[newloc]
			if (loctab.stats != undefined)
			{
				let req = getstat(loctab, "required_items");
				if (req != undefined)
				{
					for (let i = 0; i < req.length; i++)
					{
						let amount = (req[i].count == undefined) ? 1 : req[i].count
						if (!hasitem(senderid(msg), req[i].id, amount))
						{
							msend(msg, "You need " + minitemf(req[i].id) + " to go to " + minf(loctab) + "!");
							return;
						}
					}
				}
			}
			wars.users[senderid(msg)].location = newloc;
			msend(msg, "Travelled to " + minf(loctab) + ".");
		}},
		{command:"mood", func: function(msg, txt) {
			let mood = txt[1];
			if (mood == undefined || wars.moods[mood] == undefined) return merror(msg, common_errors.invalid_mood);
			wars.users[senderid(msg)].mood = mood;
			msend(msg, "Mood set to " + objf(wars.moods[mood]) + ".");
		}},
		{command:"religion", func: function(msg, txt) {
			let rel = txt[1];
			if (rel == undefined || wars.religions[rel] == undefined) return merror(msg, common_errors.invalid_religion);
			wars.users[senderid(msg)].religion = rel;
			msend(msg, "You are now " + (rand(1, 30) == 12 ? "a devout " : "") + religf(rel) + ".");
		}},
		{command:"char", alias:"character"},
		{command:"character", func: function(msg, txt) {
			let character = txt[1];
			if (character == undefined || wars.characters[character] == undefined) return merror(msg, common_errors.invalid_character);
			wars.users[senderid(msg)].character = character;
			msend(msg, "Character set to " + minf(wars.characters[character]) + ".");
		}},
		{command:"me", alias:"profile"},
		{command:"profile", func: function(msg, txt) {
			msend(msg, profilef(senderid(msg)));
		}},
		{command:"brew", alias:"craft"},
		{command:"make", alias:"craft"},
		{command:"craft", func: function(msg, txt) {
			let userid = senderid(msg);
			if (!validuser(userid)) return;
			let itemid = txt[1];
			if (itemid == undefined || wars.items[itemid] == undefined) return merror(msg, common_errors.invalid_item);
			let amount = (txt[2] == undefined) ? 1 : parseInt(txt[2]);
			let item = wars.items[itemid];
			let recipe = getstat(item, "recipe");
			if (!recipe) return merror(msg, common_errors.item_uncraftable);
			for (let i = 0; i < recipe.ingredients.length; i++)
			{
				if (!hasitem(userid, recipe.ingredients[i].id, recipe.ingredients[i].count * amount)) return merror(msg, common_errors.bad_ingredients);
			}
			for (let i = 0; i < recipe.ingredients.length; i++)
			{
				takeitem(userid, recipe.ingredients[i].id, recipe.ingredients[i].count * amount);
			}
			giveitem(userid, itemid, recipe.count * amount);
			msend(msg, "Successfully crafted " + stackf(itemid, recipe.count * amount) + ".");
		}},
		{command:"buy", func: function(msg, txt) {
			let itemid = txt[1];
			if (itemid == undefined || wars.items[itemid] == undefined) return merror(msg, common_errors.invalid_item);
			let item = wars.items[itemid];
			let price = getstat(item, "price");
			if (!price) return merror(msg, common_errors.not_for_sale);	
			let amount = (txt[2] == undefined) ? 1 : txt[2];
			price *= amount
			let userid = senderid(msg);
			if (!hasitem(userid, "money", price)) return merror(msg, common_errors.not_enough_money);
			takeitem(userid, "money", price);
			giveitem(userid, itemid, amount);
			msend(msg, "Bought " + stackf(itemid, amount) + " for " + moneyf(price) + ".");
		}},
		{command:"store", alias:"shop"},
		{command:"shop", func: function(msg, txt) {
			msend(msg, shopf()); // wew lad
		}},
		{command:"save", func: function(msg, txt) {
			let data = crypt(data_format + "-" + JSON.stringify(wars.users[senderid(msg)]), "ba" + "df" + "eg" + "ad");
			mpriv(msg, "Your data has been saved: ```" + data + "```Data format: " + data_format + " (type ``.help saving`` for more info)");
		}},
		{command:"load", func: function(msg, txt) {
			let str = txt[1];
			if (str == undefined) return;
			let data = crypt(str, "ba" + "df" + "eg" + "ad", true);
			let ver = data.split("-", 1)[0];
			ver = isvalidformatversion(ver) ? ver : "unknown";
			let json = data.slice(ver.length + 1);
			let tested;
			try {
				tested = JSON.parse(json);
			} catch (e) {
				mpriv(msg, "This data is corrupted!\nPerhaps it's outdated? (format " + ver + ", current is " + data_format + ")");
				return;
			}
			for (let key in wars.users["default"])
			{
				if (typeof tested[key] != typeof wars.users["default"][key])
				{
					mpriv(msg, "This data is corrupted!\nPerhaps it's outdated? (format " + ver + ", current is " + data_format + ")");
					return;
				}
			}
			wars.users[senderid(msg)] = tested;
			mpriv(msg, "Your data has been loaded.");
		}},
	],
	stats: {
		health: {name: "Health"},
		max_health: {name: "Max Health"},
		defense: {name: "Defense"},
		energy: {name: "Energy"},
		drunk: {name: "Drunkenness", custom_formatting: function(val) {return (val * 1.5) + "% Alcohol";}},
		charm: {name: "Charm"},
		damage: {name: "Damage"},
		wealth: {name: "Wealth"},
		luck: {name: "Luck"},
		intel: {name: "Intellect"},
		wisdom: {name: "Wisdom"},
		accuracy: {name: "Accuracy"},
		alcohol_immune: {name: "Alcohol Immunity", custom_formatting: function(val) {return "Immune to the effects of Alcohol.";}},
		lore: {name: "Lore", custom_formatting: function(val) {return val;}},
		loot: {name: "Loot", custom_formatting: function(val) {
			let str = "This item can be opened.\nPossible contents:\n";
			for (let i = 0; i < val.length; i++)
			{
				str += "  - " + codeitemstackf(val[i]) + "\n";
			}
			return str;
		}, use: function(userid, val) {
			let lootitem = randfrom(val);
			giveitem(userid, lootitem.id, lootitem.count);
			return "You got " + stackf(lootitem.id, lootitem.count) + "."
		}},
		required_items: {name: "Required Items", custom_formatting: function(val) {
			let str = "Items required:\n";
			for (let i = 0; i < val.length; i++)
			{
				let count = val[i].count;
				str += "  - " + codeitemstackf(val[i]) + "\n";
			}
			return str;
		}},
		loot_tier: {name: "Loot Quality", custom_formatting: function(val) {return "Loot Quality: " + loot_tiers[val];}},
		price: {name: "Price", custom_formatting: function(val) {return moneyf_short(val);}},
		salary: {name: "Salary", custom_formatting: function(val) {return "Salary: " + moneyf_short(val);}},
		recipe: {name: "Crafting Recipe", custom_formatting: function(val) {
			let str = "Crafted with:\n"
			for (let i = 0; i < val.ingredients.length; i++)
			{
				let count = val.ingredients[i].count;
				str += "  - " + codeitemstackf(val.ingredients[i]) + "\n";
			}
			return str;
		}},
		statbonus: {name: "Job Stat Bonus", custom_formatting: function(val) {
			return wars.stats[val.id].name + " bonus: " + Math.round((val.val - 1) * 100) + "%";
		}},
		energycost: {name: "Energy Cost", custom_formatting: function(val) {
			return "Energy cost: " + val;
		}},
		ammo: {name: "Energy Cost", custom_formatting: function(val) {
			return "Ammo: " + val;
		}},
		summon: {name: "Summoning Item", custom_formatting: function(val) {
			return "Summons " + wars.monsters[val].name;
		}, use: function(userid, val) {
			wars.users[userid].fighting = {type:FIGHT_MONSTER, id:val, health:wars.monsters[val].health};
			return "A mighty " + minf(wars.monsters[val]) + " has been summoned!";
		}},
		immunity: {name: "Immunity", custom_formatting: function(val) {
			return "Provides immunity to " + commalistf(val, "effects") + ".";
		}},
		cure: {name: "Cure", custom_formatting: function(val) {
			return "Cures " + commalistf(val, "effects") + ".";
		}, use: function(userid, val) {
			for (let i = 0; i < val.length; i++) {
				wars.users[userid].effects[val[i]] = false;
			}
		}},
		effects: {name: "Effects", custom_formatting: function(val) {
			return "Inflicts " + commalistf(val, "effects") + ".";
		}, use: function(userid, val) {
			for (let i = 0; i < val.length; i++) {
				wars.users[userid].effects[val[i]] = true;
			}
		}},
	},
	jobs: {
		cashier: {
			name: "Cashier",
			emote: "convenience_store",
			stats: [
				{id:"energycost", val:3},
				{id:"salary", val:8},
				{id:"statbonus", val:{id:"charm", val:1.1}},
			]
		},
		fish: {
			name: "Fish",
			emote: "fishing_pole_and_fish",
			stats: [
				{id:"energycost", val:8},
				{id:"salary", val:12},
				{id:"statbonus", val:{id:"luck", val:1.2}},
			]
		},
		fly: {
			name: "Fly Cargo",
			emote: "airplane_departure",
			stats: [
				{id:"energycost", val:18},
				{id:"salary", val:30},
				{id:"statbonus", val:{id:"intel", val:1.4}},
			]
		},
		write: {
			name: "Write a Book",
			emote: "writing_hand",
			stats: [
				{id:"energycost", val:20},
				{id:"salary", val:32},
				{id:"statbonus", val:{id:"wisdom", val:1.8}},
			]
		},
		gamble: {
			name: "Gamble",
			emote: "game_die",
			stats: [
				{id:"energycost", val:6},
				{id:"salary", val:10},
				{id:"statbonus", val:{id:"luck", val:2.0}},
			]
		},
		paint: {
			name: "Paint",
			emote: "art",
			stats: [
				{id:"energycost", val:8},
				{id:"salary", val:15},
				{id:"statbonus", val:{id:"wisdom", val:1.3}},
			]
		},
	},
	locations: {
		forest: {
			name: "Forest",
			emote: "deciduous_tree",
			stats: [
				{id:"loot_tier", val:0}
			],
			monsters: [
				{id:"pig", weight:3},
				{id:"frog", weight:2},
				{id:"ant", weight:1}
			],
			resources: [
				{id:"leaves", weight:30},
				{id:"seedling", weight:20},
				{id:"mushroom", weight:10},
				{id:"shamrock", weight:1}
			],
			tier: 1
		},
		desert: {
			name: "Desert",
			emote: "cactus",
			stats: [
				{id:"loot_tier", val:1}
			],
			monsters: [
				{id:"scorpion", weight:3},
				{id:"snake", weight:2},
				{id:"camel", weight:1},
				{id:"jihadi", weight:1}
			],
			resources: [
				{id:"leaves", weight:30},
				{id:"seedling", weight:20},
				{id:"mushroom", weight:10},
				{id:"shamrock", weight:1}
			],
			tier: 2
		},
		ocean: {
			name: "Ocean",
			stats: [
				{id:"loot_tier", val:1}
			],
			monsters: [
				{id:"crab", weight:3},
				{id:"shark", weight:2},
				{id:"squid", weight:2}
			],
			resources: [
				{id:"leaves", weight:30},
				{id:"seedling", weight:20},
				{id:"mushroom", weight:10},
				{id:"shamrock", weight:1}
			],
			tier: 3
		},
		spooktown: {
			name: "Spook Town",
			emote: "jack_o_lantern",
			stats: [
				{id:"loot_tier", val:2}
			],
			monsters: [
				{id:"skeleton", weight:5},
				{id:"ghost", weight:4},
				{id:"clown", weight:2},
				{id:"hauntedmask", weight:1},
				{id:"hauntedsax", weight:1}
			],
			resources: [
				{id:"leaves", weight:30},
				{id:"seedling", weight:20},
				{id:"mushroom", weight:10},
				{id:"shamrock", weight:1}
			],
			tier: 4
		},
		caves: {
			name: "Spider Caves",
			emote: "spider_web",
			stats: [
				{id:"loot_tier", val:2},
				{id:"required_items", val:[{id:"pickaxe", count:1}]}
			],
			monsters: [
				{id:"spider", weight:3},
				{id:"bat", weight:2}
			],
			resources: [
				{id:"leaves", weight:30},
				{id:"seedling", weight:20},
				{id:"mushroom", weight:10},
				{id:"shamrock", weight:1}
			],
			tier: 5
		},
		space: {
			name: "Space",
			emote: "stars",
			stats: [
				{id:"loot_tier", val:2},
				{id:"required_items", val:[{id:"rocket", count:1}]}
			],
			monsters: [
				{id:"alien", weight:3},
				{id:"spaceinvader", weight:2},
				{id:"satellite", weight:1}
			],
			resources: [
				{id:"leaves", weight:30},
				{id:"seedling", weight:20},
				{id:"mushroom", weight:10},
				{id:"shamrock", weight:1}
			],
			tier: 6
		},
		hell: {
			name: "Hell",
			emote: "smiling_imp",
			stats: [
				{id:"loot_tier", val:3},
				{id:"required_items", val:[{id:"hellkey", count:1}]}
			],
			monsters: [
				{id:"imp", weight:3},
				{id:"ogre", weight:2},
				{id:"clown", weight:1},
				{id:"hauntedmask", weight:1}
			],
			resources: [
				{id:"leaves", weight:30},
				{id:"seedling", weight:20},
				{id:"mushroom", weight:10},
				{id:"shamrock", weight:1}
			],
			tier: 7
		}
	},
	items: {
		money: {name: "Yen", type: TYPE_MATERIAL},
		hammer: {name: "Hammer", type: TYPE_WEAPON, stats: [{id:"damage", val:1}]},
		scissors: {name: "Scissors", type: TYPE_WEAPON, stats: [{id:"damage", val:2}]},
		knife: {name: "Knife", type: TYPE_WEAPON, stats: [{id:"damage", val:3}]},
		pickaxe: {name: "Pickaxe", emote: "pick", type: TYPE_WEAPON, stats: [{id:"damage", val:5}]},
		dagger: {name: "Dagger", type: TYPE_WEAPON, stats: [{id:"damage", val:7}]},
		bow: {name: "Bow", emote: "bow_and_arrow", type: TYPE_WEAPON, stats: [{id:"damage", val:10}]},
		bomb: {name: "Bomb", type: TYPE_WEAPON, stats: [{id:"damage", val:12}]},
		gun: {name: "Gun", type: TYPE_WEAPON, stats: [{id:"ammo", val:"bullet"}, {id:"damage", val:15}, {id:"accuracy", val:-3}]},
		apple: {name: "Apple", type: TYPE_CONSUMABLE, stats: [{id:"energy", val:2}]},
		grapes: {name: "Grapes", type: TYPE_CONSUMABLE, stats: [{id:"energy", val:1}]},
		meat: {name: "Meat", emote: "poultry_leg", type: TYPE_CONSUMABLE, stats: [{id:"energy", val:8}]},
		bacon: {name: "Bacon", type: TYPE_CONSUMABLE, stats: [{id:"energy", val:5}]},
		donut: {name: "Donut", emote: "doughnut", type: TYPE_CONSUMABLE, stats: [{id:"energy", val:4}]},
		candy: {name: "Candy", type: TYPE_CONSUMABLE, stats: [{id:"energy", val:1}]},
		cookie: {name: "Cookie", type: TYPE_CONSUMABLE, stats: [{id:"energy", val:2}]},
		pepper: {name: "Hot Pepper", emote: "hot_pepper", type: TYPE_CONSUMABLE, stats: [{id:"energy", val:6}, {id:"health", val:-2}]},
		burger: {name: "Burger", emote: "hamburger", type: TYPE_CONSUMABLE, stats: [{id:"energy", val:5}]},
		fries: {name: "French Fries", emote: "fries", type: TYPE_CONSUMABLE, stats: [{id:"energy", val:3}]},
		bread: {name: "Bread", type: TYPE_CONSUMABLE, stats: [{id:"price", val:12}, {id:"energy", val:3}, {id:"lore", val:"Let's get this bread."}]},
		mushroom: {name: "Mushroom", type: TYPE_CONSUMABLE, stats: [{id:"energy", val:3}, {id:"health", val:-1}, {id:"lore", val:"May give you superpowers."}]},
		icecream: {name: "Ice Cream", emote: "ice_cream", type: TYPE_CONSUMABLE, stats: [{id:"energy", val:6}]},
		beer: {name: "Beer", type: TYPE_CONSUMABLE, stats: [{id:"drunk", val:3}, {id:"health", val:2}]},
		wine: {name: "Wine", emote: "wine_glass", type: TYPE_CONSUMABLE, stats: [{id:"drunk", val:4}, {id:"health", val:3}, {id:"recipe", val:{ingredients:[{id:"grapes", count:3}], count:1}}]},
		sake: {name: "Sake", type: TYPE_CONSUMABLE, stats: [{id:"price", val:30}, {id:"drunk", val:4}, {id:"health", val:3}]},
		whiskey: {name: "Whiskey", emote: "tumbler_glass", type: TYPE_CONSUMABLE, stats: [{id:"drunk", val:6}, {id:"health", val:4}, {id:"lore", val:"Pass the whiskey!"}]},
		maitai: {name: "Mai Tai", emote: "tropical_drink", type: TYPE_CONSUMABLE, stats: [{id:"drunk", val:5}, {id:"health", val:3}, {id:"charm", val:1}]},
		milk: {name: "Milk", type: TYPE_CONSUMABLE, stats: [{id:"health", val:1}]},
		coffee: {name: "Coffee", type: TYPE_CONSUMABLE, stats: [{id:"energy", val:5}, {id:"drunk", val:-2, hide:true}, {id:"lore", val:"Sobers you up."}]},
		pill: {name: "Health Pill", emote: "pill", type: TYPE_CONSUMABLE, stats: [{id:"health", val:5}, {id:"lore", val:"Popping pills is good for you!"}]},
		adrenaline: {name: "Adrenaline Shot", emote: "syringe", type: TYPE_CONSUMABLE, stats: [{id:"energy", val:20}, {id:"lore", val:"Get PUMPED baby!"}]},
		chocbox: {name: "Box of Chocolates", emote: "gift_heart", type: TYPE_CONSUMABLE, stats: [{id:"energy", val:3}, {id:"lore", val:"You never know what you're gonna get."}]},
		cheese: {name: "Cheese", type: TYPE_CONSUMABLE, stats: [{id:"energy", val:4}, {id:"luck", val:-1}]},
		chocolate: {name: "Chocolate", emote:"chocolate_bar", type: TYPE_CONSUMABLE, stats: [{id:"energy", val:2}]},
		tophat: {name: "Top Hat", emote: "tophat", type: TYPE_HAT, stats: [{id:"defense", val:1}, {id:"wealth", val:1}]},
		crown: {name: "Crown", type: TYPE_HAT, stats: [{id:"charm", val:2}, {id:"wealth", val:3}]},
		gradcap: {name: "Grad Cap", emote: "mortar_board", type: TYPE_HAT, stats: [{id:"luck", val:1}]},
		flowerhat: {name: "Flower Hat", emote: "womans_hat", type: TYPE_HAT, stats: [{id:"defense", val:1}, {id:"charm", val:2}]},
		brownshoes: {name: "Brown Shoes", emote: "mans_shoe", type: TYPE_SHOE, stats: [{id:"defense", val:1}]},
		blueshoes: {name: "Blue Shoes", emote: "athletic_shoe", type: TYPE_SHOE, stats: [{id:"defense", val:2}]},
		boots: {name: "Boots", emote: "boot", type: TYPE_SHOE, stats: [{id:"defense", val:3}]},
		sandals: {name: "Sandals", emote: "sandal", type: TYPE_SHOE, stats: [{id:"luck", val:2}]},
		iceskates: {name: "Ice Skates", emote: "ice_skate", type: TYPE_SHOE, stats: [{id:"luck", val:1}]},
		heels: {name: "High Heels", emote: "high_heel", type: TYPE_SHOE, stats: [{id:"charm", val:3}]},
		ring: {name: "Diamond Ring", emote: "ring", type: TYPE_EQUIP, stats: [{id:"charm", val:3}, {id:"lore", val:"Sorry ladies, I'm married... to science!"}, {id:"recipe", val:{ingredients:[{id:"goldnugget", count:3}, {id:"gemstone", count:1}], count:1}}]},
		rose: {name: "Rose", type: TYPE_EQUIP, stats: [{id:"charm", val:2}]},
		lollichop: {name: "Lollichop", emote: "lollipop", type: TYPE_WEAPON, stats: [{id:"damage", val:3}, {id:"lore", val:"Like a lollipop, but also an axe."}]},
		shamrock: {name: "Lucky Clover", emote: "four_leaf_clover", type: TYPE_EQUIP, stats: [{id:"luck", val:4}]},
		present: {name: "Present", emote: "gift", type: TYPE_CONSUMABLE, stats: [{id:"loot", val:[{id:"candy", count:3}, {id:"chocolate", count:1}, {id:"chocbox", count:1}, {id:"lollichop", count:1}]}]},
		rocket: {name: "Rocket", type: TYPE_CONSUMABLE, stats: [{id:"lore", val:"Allows travel to Space."}]},
		goo: {name: "Goo", emote: "large_blue_circle", stats: [{id:"lore", val:"Sticky and useful for crafting."}], type: TYPE_MATERIAL},
		leaves: {name: "Leaves", type: TYPE_MATERIAL},
		flower: {name: "Flower", emote:"blossom", type: TYPE_MATERIAL},
		bouquet: {name: "Bouquet of Flowers", emote:"bouquet", stats:[{id:"charm", val:2}, {id:"recipe", val:{ingredients:[{id:"flower", count:3}], count:1}}], type: TYPE_EQUIP},
		dice: {name: "Weighted Die", emote:"game_die", stats:[{id:"luck", val:2}], type: TYPE_EQUIP},
		jokebook: {name: "Book of Really Funny Jokes", emote:"notepad_spiral", stats:[{id:"charm", val:2}, {id:"lore", val:"Great for parties!"}], type: TYPE_EQUIP},
		clownnose: {name: "Clown Nose", emote:"red_circle", stats:[{id:"charm", val:1}, {id:"lore", val:"Honk honk!"}], type: TYPE_EQUIP},
		seedling: {name: "Seedling", type: TYPE_MATERIAL},
		redheart: {name: "Red Heart", emote: "heart", stats: [{id:"lore", val:"The heart of all things good."}], type: TYPE_MATERIAL},
		yellowheart: {name: "Yellow Heart", emote: "yellow_heart", stats: [{id:"lore", val:"The heart of all things spooky."}], type: TYPE_MATERIAL},
		greenheart: {name: "Green Heart", emote: "green_heart", stats: [{id:"lore", val:"The heart of all things natural."}], type: TYPE_MATERIAL},
		blueheart: {name: "Blue Heart", emote: "blue_heart", stats: [{id:"lore", val:"The heart of all things marine."}], type: TYPE_MATERIAL},
		purpleheart: {name: "Purple Heart", emote: "purple_heart", stats: [{id:"lore", val:"The heart of all things evil."}], type: TYPE_MATERIAL},
		ironchunk: {name: "Iron Chunk", emote: "white_small_square", stats: [], type: TYPE_MATERIAL},
		steelplate: {name: "Steel Plate", emote: "white_medium_square", stats: [], type: TYPE_MATERIAL},
		magicbook: {name: "Enchanting Book", emote: "bookmark", stats: [{id:"lore", val:"Imbued with an ancient power."}], type: TYPE_MATERIAL},
		hellkey: {name: "Key to Hell", emote: "key", stats: [{id:"lore", val:"Allows passage to Hell."}], type: TYPE_MATERIAL},
		honey: {name: "Honey", emote: "honey_pot", stats: [{id:"health", val:1}], type: TYPE_CONSUMABLE},
		crayon: {name: "Crayon", stats: [{id:"health", val:1}, {id:"energy", val:-2}, {id:"lore", val:"Yummy!"}], type: TYPE_CONSUMABLE},
		cookedegg: {name: "Cooked Egg", emote: "cooking", stats: [{id:"energy", val:4}, {id:"recipe", val:{ingredients:[{id:"egg", count:1}, {id:"fire", count:1}], count:1}}], type: TYPE_CONSUMABLE},
		egg: {name: "Egg", stats: [{id:"lore", val:"Can be cooked and eaten, or thrown."}], type: TYPE_MATERIAL},
		rawshrimp: {name: "Raw Shrimp", emote:"shrimp", stats: [{id:"lore", val:"Can be cooked and eaten."}], type: TYPE_MATERIAL},
		cookedshrimp: {name: "Cooked Shrimp", emote: "fried_shrimp", stats: [{id:"energy", val:5}, {id:"recipe", val:{ingredients:[{id:"rawshrimp", count:1}, {id:"fire", count:1}], count:1}}], type: TYPE_CONSUMABLE},
		nametag: {name: "Name Tag", emote:"label", stats: [{id:"lore", val:"Can be cooked and eaten, or thrown."}], type: TYPE_MATERIAL},
		fire: {name: "Fire", stats: [{id:"lore", val:"Used to cook things."}, {id:"recipe", val:{ingredients:[{id:"leaves", count:2}], count:1}}], type: TYPE_MATERIAL},
		boxingglove: {name: "Boxing Glove", emote: "boxing_glove", type: TYPE_WEAPON, stats: [{id:"damage", val:6}, {id:"defense", val:2}, {id:"lore", val:"8.. 9.. 10.. Knockout!"}]},
		guitar: {name: "Guitar", emote: "guitar", type: TYPE_WEAPON, stats: [{id:"damage", val:3}, {id:"charm", val:2}, {id:"lore", val:"Violently serenade your opponent."}]},
		map: {name: "Trifold Map", emote:"map", stats:[{id:"lore", val:"Allows travel to the Desert.\nDon't get lost!"}], type: TYPE_MATERIAL},
		goldnugget: {name: "Gold Nugget", emote:"small_orange_diamond", stats:[{id:"lore", val:"Used to craft various luxurious items."}], type: TYPE_MATERIAL},
		gemstone: {name: "Rare Gemstone", emote:"gem", stats:[{id:"lore", val:"Shiny!"}], type: TYPE_MATERIAL},
		ribbon: {name: "Red Ribbon", emote:"ribbon", stats:[{id:"charm", val:1}], type: TYPE_EQUIP},
		megaphone: {name: "Megaphone", emote:"loudspeaker", stats:[{id:"immunity", val:["quiet"]}], type: TYPE_EQUIP},
		alarmclock: {name: "Alarm Clock", emote:"alarm_clock", stats:[{id:"immunity", val:["sleep"]}], type: TYPE_EQUIP},
		glasses: {name: "Glasses", emote:"eyeglasses", stats:[{id:"accuracy", val:1}, {id:"intel", val:1}], type: TYPE_EQUIP},
		telescope: {name: "Telescope", stats:[{id:"accuracy", val:2}, {id:"lore", val:"Zoom in on those targets!"}], type: TYPE_EQUIP},
		supplycrate: {name: "Bill Co:tm: Supply Crate", emote: "package", type: TYPE_CONSUMABLE, stats: [{id:"price", val:50, hide: true}, {id:"loot", val:[{id:"money", count:25}, {id:"tophat", count:1}, {id:"crown", count:1}, {id:"gradcap", count:1}, {id:"flowerhat", count:1}, {id:"brownshoes", count:1}, {id:"blueshoes", count:1}, {id:"boots", count:1}, {id:"sandals", count:1}, {id:"heels", count:1}, {id:"iceskates", count:1}, {id:"dice", count:1}, {id:"nametag", count:1}]}]},
	},
	effects: {
		poison: {
			name: "Poison",
			emote: "sick",
			stats: [{id:"lore", val:"Inflicted with a mild toxin"}],
			effect: {
				chance: 0.3,
				message: "{you} took damage from {me}",
				stats: [{id:"health", val:-1}]
			}
		},
		venom: {
			name: "Venom",
			emote: "syringe",
			stats: [{id:"lore", val:"Inflicted with a deadly toxin"}],
			effect: {
				chance: 0.6,
				message: "{you} took damage from {me}.",
				stats: [{id:"health", val:-2}]
			}
		},
		armorbroken: {
			name: "Armor Broken",
			emote: "shield",
			stats: [{id:"lore", val:"Defense reduced by 50%"}],
			statmod: {
				defense: 0.5
			}
		},
		curse: {
			name: "Curse",
			emote: "no_mouth",
			stats: [{id:"lore", val:"Luck reduced by 80%"}],
			statmod: {
				luck: 0.2
			}
		},
		quiet: {
			name: "Quiet",
			emote: "mute",
			stats: [{id:"lore", val:"Unable to eat or drink"}],
		},
		frost: {
			name: "Frost",
			emote: "snowflake",
			stats: [{id:"lore", val:"Lose energy to the cold"}],
			effect: {
				chance: 0.3,
				message: "{you} lost energy to {me}",
				stats: [{id:"energy", val:-1}]
			}
		},
		sleep: {
			name: "Sleep",
			emote: "zzz",
			stats: [{id:"lore", val:"Damage and defense both reduced by 20%"}],
			statmod: {
				damage: 0.8,
				defense: 0.8
			}
		},
		radiation: {
			name: "Radiation Sickness",
			emote: "radioactive",
			stats: [{id:"lore", val:"Eaten from the inside out"}],
			effect: {
				chance: 0.2,
				message: "{you} is hurt by {me}",
				stats: [{id:"health", val:-1}]
			}
		},
		lovestruck: {
			name: "Love Struck",
			emote: "revolving_hearts",
			stats: [{id:"lore", val:"Charm increased by 30%"}],
			statmod: {
				charm: 1.3
			}
		},
		buzzed: {
			name: "Buzzed",
			emote: "beers",
			stats: [{id:"lore", val:"Blood alcohol over .75%, accuracy lowered by 20%"}],
			statmod: {
				accuracy: 0.8
			}
		},
		wasted: {
			name: "Shitfaced",
			emote: "beers",
			stats: [{id:"lore", val:"Blood alcohol over 3%, accuracy lowered by 50%"}],
			statmod: {
				accuracy: 0.5
			}
		},
	},
	characters: {
		chicken: {
			name: "Chicken",
			stats: [
				{id:"max_health", val:8},
				{id:"charm", val:2},
			]
		},
		cowboy: {
			name: "Cowboy",
			stats: [
				{id:"max_health", val:8},
				{id:"luck", val:2}
			]
		},
		santa: {
			name: "Santa Claus",
			emote: "santa",
			stats: [
				{id:"max_health", val:10}
			]
		},
		robot: {
			name: "Robot",
			stats: [
				{id:"max_health", val:8},
				{id:"alcohol_immune", val:1}
			]
		},
	},
	religions: {
		none: {
			name: "None",
			adj: "Non-Religious",
			emote: "peace", // xd
			stats: []
		},
		judaism: {
			name: "Judaism",
			adj: "Jewish",
			emote: "star_of_david",
			stats: [
				{id:"luck", val:1}
			]
		},
		christianity: {
			name: "Christianity",
			adj: "Christian",
			emote: "cross",
			stats: [
				{id:"max_health", val:1}
			]
		},
		islam: {
			name: "Islam",
			adj: "Muslim",
			emote: "star_and_crescent",
			stats: [
				{id:"damage", val:1}
			]
		},
	},
	monsters: {
		pig: {
			name: "Pig",
			health: 4,
			attacks: [
				{name:"{me} oinks at {you}.", stats:[{id:"health", val:-1}]},
				{name:"{me} splashes mud on {you}.", stats:[{id:"health", val:-2}]}
			],
			loot: {
				money: {min: 4, max: 7},
				rolls: {min:1, max:2},
				items: [
					{id:"bacon", weight:1}
				]
			}
		},
		frog: {
			name: "Frog",
			health: 2,
			attacks: [
				{name:"{me} craoks at {you}.", stats:[{id:"health", val:-1}]},
				{name:"{me} leaps onto {you}.", stats:[{id:"health", val:-1}]}
			],
			loot: {
				money: {min: 2, max: 5},
				rolls: 1,
				items: [{id:"goo", weight:1}]
			}
		},
		ant: {
			name: "Ant",
			health: 1,
			attacks: [
				{name:"{me} crawls on {you}.", stats:[{id:"health", val:-1}]}
			],
			loot: {
				money: {min: 1, max: 2},
				rolls: 1,
				items: []
			}
		},
		bee: {
			name: "Bee",
			health: 1,
			attacks: [
				{name:"{me} stings {you}.", stats:[{id:"health", val:-1}]}
			],
			loot: {
				money: {min: 1, max: 2},
				rolls: 1,
				items: [{id:"honey", weight:1}]
			}
		},
		scorpion: {
			name: "Scorpion",
			health: 4,
			attacks: [
				{name:"{me} stings {you}.", stats:[{id:"health", val:-1}]}
			],
			loot: {
				money: {min: 1, max: 2},
				rolls: 1,
				items: [{id:"honey", weight:1}]
			}
		},
		jihadi: {
			name: "Jihadi",
			emote: "man_with_turban::skin-tone-4",
			health: 10,
			attacks: [
				{name:"{me} shoots {you} with an AK-47.", stats:[{id:"health", val:-1}]},
				{name:"{me} blows {you} up.", stats:[{id:"health", val:-1}]}
			],
			loot: {
				money: {min: 1, max: 2},
				rolls: 1,
				items: [{id:"bomb", weight:1}]
			}
		},
		shrimp: {
			name: "Shrimp",
			health: 1,
			attacks: [
				{name:"{me} bites {you}.", stats:[{id:"health", val:-1}]}
			],
			loot: {
				money: {min: 3, max: 5},
				rolls: 1,
				items: [{id:"rawshrimp", weight:1}]
			}
		},
		clown: {
			name: "Clown",
			emote: "clown",
			health: 12,
			attacks: [
				{name:"{me} punches {you} right between the eyes.", stats:[{id:"health", val:-3}]},
				{name:"{me} inhumanely attacks {you}.", stats:[{id:"health", val:-3}]}, 
				{name:"{me} mauls {you}.", stats:[{id:"health", val:-4}]},
				{name:"{me} laughs menacingly at {you}.", stats:[{id:"fright", val:1}]}
			],
			loot: {
				money: {min: 50, max: 64},
				rolls: 3,
				items: [
					{id:"burger", weight:5},
					{id:"fries", weight:4},
					{id:"clownnose", weight:2},
					{id:"jokebook", weight:1}
				]
			}
		},
		hauntedsax: {
			name: "Possesed Saxophone",
			emote: "saxophone",
			health: 20,
			attacks: [
				{name:"{me} blasts {you}'s ears out.", stats:[{id:"health", val:-3}, {id:"hearingloss", val:1}]},
				{name:"{me} serenades {you}.", stats:[{id:"health", val:-2}]}
			],
			loot: {
				money: {min: 40, max: 52},
				rolls: 1,
				items: [
					{id:"whiskey", weight:2},
					{id:"crown", weight:1}
				]
			}
		},
		hauntedhouse: {
			name: "Haunted House",
			emote: "house_abandoned",
			health: 50,
			attacks: [
				{name:"{me} collapses on {you}.", stats:[{id:"health", val:-3}]},
				{name:"{me} serenades {you}.", stats:[{id:"health", val:-2}]}
			],
			loot: {
				money: {min: 70, max: 120},
				rolls: 1,
				items: [
					{id:"whiskey", weight:2},
					{id:"crown", weight:1}
				]
			}
		},
		coffin: {
			name: "Coffin",
			emote: "coffin",
			health: 16,
			attacks: [
				{name:"{me} closes on {you}.", stats:[{id:"health", val:-3}]},
				{name:"{me} falls on top of {you}.", stats:[{id:"health", val:-2}]}
			],
			loot: {
				money: {min: 10, max: 12},
				rolls: 1,
				items: [
					{id:"whiskey", weight:2},
					{id:"crown", weight:1}
				]
			}
		},
		spider: {
			name: "Spider",
			health: 8,
			attacks: [
				{name:"{me} bites {you}.", stats:[{id:"health", val:-2}], effects:["poison"]},
				{name:"{me} crawls on {you}.", stats:[{id:"health", val:-1}]}
			],
			loot: {
				money: {min: 10, max: 12},
				rolls: 1,
				items: [
					{id:"whiskey", weight:2},
					{id:"crown", weight:1}
				]
			}
		},
		bat: {
			name: "Bat",
			health: 2,
			attacks: [
				{name:"{me} closes on {you}.", stats:[{id:"health", val:-3}]},
				{name:"{me} falls on top of {you}.", stats:[{id:"health", val:-2}]}
			],
			loot: {
				money: {min: 10, max: 12},
				rolls: 1,
				items: [
					{id:"whiskey", weight:2},
					{id:"crown", weight:1}
				]
			}
		},
		imp: {
			name: "Imp",
			health: 18,
			attacks: [
				{name:"{me} curses {you}.", stats:[{id:"health", val:-1}], effects:["curse"]},
				{name:"{me} throws a fireball at {you}.", stats:[{id:"health", val:-4}]}
			],
			loot: {
				money: {min: 10, max: 12},
				rolls: 1,
				items: [
					{id:"whiskey", weight:2},
					{id:"purpleheart", weight:1}
				]
			}
		},
		spy: {
			name: "Spy",
			health: 20,
			attacks: [
				{name:"{me} slashes {you}.", stats:[{id:"health", val:-3}]},
				{name:"{me} stabs {you}.", stats:[{id:"health", val:-4}]}
			],
			loot: {
				money: {min: 10, max: 12},
				rolls: 1,
				items: [
					{id:"dagger", weight:1}
				]
			}
		},
		soyboy: {
			name: "Soyboy",
			emote: "eye::hole::eye",
			health: 20,
			attacks: [
				{name:"{me} slashes {you}.", stats:[{id:"health", val:-3}]},
				{name:"{me} stabs {you}.", stats:[{id:"health", val:-4}]}
			],
			loot: {
				money: {min: 10, max: 12},
				rolls: 1,
				items: [
					{id:"dagger", weight:1}
				]
			}
		}
	},
	moods: {
		nutty: {name: "Nutty", emote: "weary"},
		stoned: {name: "Stoned", emote: "drool"},
		happy: {name: "Happy", emote: "smiley"},
		angry: {name: "Angry", emote: "rage"},
		joyful: {name: "Overjoyed", emote: "joy"},
		fiendish: {name: "Fiendish", emote: "smiling_imp"},
		cool: {name: "Cool", emote: "sunglasses"},
		sick: {name: "Sick", emote: "thermometer_face"},
		greedy: {name: "Greedy", emote: "money_mouth"},
		disgusted: {name: "Disgusted", emote: "sick"},
		meh: {name: "Meh", emote: "neutral_face"},
	},
	users: {
		["default"]: {
			cached_name: "Default Character",
			slogan: "aight im boutta head out",
			character: "chicken",
			religion: "none",
			mood: "cool",
			location: "forest",
			fighting: false,
			equipped: {
				[SLOT_WEAPON]: "hammer",
				[SLOT_HAT]: "gradcap",
				[SLOT_SHOE]: "brownshoes",
				[SLOT_ACCESSORIES]: [false, false, false, false]
			},
			inventory: [
				{id: "money", count: 20},
				{id: "apple", count: 1}
			],
			stats: [
				{id:"energy", val:max_energy}
			],
			effects: {}
		},
	}
}

bot.on("message", message => {
	if (message.author.bot) return;
	if (!validuser(message.author.id)) newuser(message.author);
	recur_cmd(message, message.content.split(" "));
});

bot.login(token);
