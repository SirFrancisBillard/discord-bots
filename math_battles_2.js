const Discord = require("discord.js");
const bot = new Discord.Client();
const token = "MjU3NDIzNjI1Mzk1NjM0MTc3.Cy6f9g.gK7EvS9LcY2QxMCis6WvXJGxpSU";

var mb = {
	weapons:[{id:0, name:"nothing", damage:0}],
	armor:[{id:0, name:"nothing", protection:0}],
	settings:{defaultGold:0, defaultWeaponID:0, defaultArmorID:0, rollMin:0, rollMax:10},
	info:{name:"Math Battle 2.0", author:"Sir Francis Billard"},
	active:{}
};

function ValidatePlayerInventory(user)
{
	var ply = mb.active[user.id];
	if (typeof ply == "undefined")
	{
		mb.active[user.id] = {};
	}
	var ply = mb.active[user.id];
	if (typeof ply.weapon != "object")
	{
		ply.weapon = mb.weapons[mb.settings.defaultWeaponID];
	}
	if (typeof ply.armor != "object")
	{
		ply.armor = mb.armor[mb.settings.defaultArmorID];
	}
	if (typeof ply.armor != "number")
	{
		ply.gold = mb.settings.defaultGold;
	}
}

function KillPlayer(user)
{
	var ply = mb.active[user.id];
	if (typeof ply == "undefined")
	{
		mb.active[message.author.id] = {};
	}
	var ply = mb.active[user.id];
	ply.weapon = mb.weapons[mb.settings.defaultWeaponID];
	ply.armor = mb.armor[mb.settings.defaultArmorID];
	ply.gold = mb.settings.defaultGold;
}

function GetPlayerInventory(user)
{
	var ply = mb.active[user.id];
	if (typeof ply == "undefined")
	{
		mb.active[message.author.id] = {};
	}
	var ply = mb.active[user.id];
	var PLY_WPN = ply.weapon;
	var PLY_ARM = ply.armor;
	var PLY
	return {weapon:PLY_WPN, armor:PLY_ARM, gold:PLY_GLD};
}

bot.on("message", message =>
{
	var cmd = message.content.split(" ");
	if (cmd[0] == ".profile")
	{
		ValidatePlayerInventory(message.author);
		var ply = mb.active[message.author.id];
		message.reply("\nYou are wielding " + ply.weapon.name + ".\nYou are wearing " + ply.armor.name + ".\nYou have " + ply.gold + " gold.");
	}
	else if (cmd[0] == ".battle")
	{
		var attacker = message.author;
		var target = message.mentions.users.first();
		if (typeof cmd[1] != "string" || typeof target == "undefined" || typeof target.id != "string" || typeof target.username != "string" || attacker.id == target.id)
		{
			message.reply("You cannot fight that person!");
		}
		message.channel.sendMessage(attacker.username + " is attacking " + target.username + "!");
		ValidatePlayerInventory(attacker);
		ValidatePlayerInventory(target);
		var min = Math.ceil(mb.settings.rollMin);
		var max = Math.floor(mb.settings.rollMax);
		var attacker_roll = Math.floor(Math.random() * (max - min)) + min;
		var target_roll = Math.floor(Math.random() * (max - min)) + min;
		var attacker_power = mb.active[attacker.id].weapon.damage - mb.active[target.id].armor.protection;
		var target_power = mb.active[target.id].weapon.damage - mb.active[attacker.id].armor.protection;
		message.channel.sendMessage(attacker.username + " rolled a " + attacker_roll + ".");
		message.channel.sendMessage(target.username + " rolled a " + target_roll + ".");
		if (attacker_power + attacker_roll > target_power + target_roll)
		{
			message.channel.sendMessage(attacker.username + " has won the fight!");
		}
		else
		{
			message.channel.sendMessage(target.username + " has won the fight!");
		}
	}
});

bot.login(token);
