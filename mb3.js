const Discord = require("discord.js");
const bot = new Discord.Client();
const token = "xd";

var mb = {
	weapons:[{id:0, name:"nothing", damage:0, cost:0}],
	armor:[{id:0, name:"nothing", protection:0, cost:0}],
	items:[],
	settings:{defaultGold:0, defaultWeaponID:0, defaultArmorID:0, numberMin:1, numberMax:18, rollMin:0, rollMax:10, messagesForDrop:20},
	info:{name:"Math Battles 2.0", author:"Sir Francis Billard", buyhelp:""},
	equations:{timer:0, active:[]},
	active:{}
};

function RandomInt(min, max)
{
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function Abs(n) {return n < 0 ? -n : n;}
function Diff(a, b) {return Abs(a - b);}

function RegisterWeapon(a, b)
{
	mb.weapons.push({id:mb.weapons.length, name:a, damage:b, cost:Math.ceil(b * b / 2)});
}

function RegisterArmor(a, b)
{
	mb.armor.push({id:mb.armor.length, name:a, protection:b, cost:Math.ceil(b * b / 2)});
}

function ValidatePlayerInventory(user)
{
	var ply = mb.active[user.id];
	if (typeof ply == "undefined")
	{
		mb.active[user.id] = {};
		ply = mb.active[user.id];
	}
	if (typeof ply.weapon != "object")
	{
		ply.weapon = mb.weapons[mb.settings.defaultWeaponID];
	}
	if (typeof ply.armor != "object")
	{
		ply.armor = mb.armor[mb.settings.defaultArmorID];
	}
	if (typeof ply.gold != "number")
	{
		ply.gold = mb.settings.defaultGold;
	}
}

function KillPlayer(user)
{
	var ply = mb.active[user.id];
	if (typeof ply == "undefined")
	{
		mb.active[user.id] = {};
		ply = mb.active[user.id];
	}
	ply.weapon = mb.weapons[mb.settings.defaultWeaponID];
	ply.armor = mb.armor[mb.settings.defaultArmorID];
	ply.gold = mb.settings.defaultGold;
}

bot.on("ready", () =>
{
	mb.info.buyhelp = mb.info.buyhelp + "**Buyable Weapons**\n";
	for (i = 1; i < mb.weapons.length; i++)
	{
		mb.info.buyhelp = mb.info.buyhelp + i + " - " + mb.weapons[i].name + " - Cost: " + mb.weapons[i].cost + "\n";
	}
	mb.info.buyhelp = mb.info.buyhelp + "**Buyable Armor**\n";
	for (i = 1; i < mb.armor.length; i++)
	{
		mb.info.buyhelp = mb.info.buyhelp + i + " - " + mb.armor[i].name + " - Cost: " + mb.armor[i].cost + "\n";
	}
});

bot.on("message", message =>
{
	ValidatePlayerInventory(message.author)
	if (message.author.id != bot.user.id)
	{
		mb.equations.timer++;
	}
	if (mb.equations.timer >= mb.settings.messagesForDrop)
	{
		mb.equations.timer = 0;

		var equation = {};
		var equationType = RandomInt(1, 4);

		if (RandomInt(1, 2) < 2)
		{
			equation.thing = mb.weapons[RandomInt(1, mb.weapons.length - 1)];
			equation.type = "weapon";
		}
		else
		{
			equation.thing = mb.armor[RandomInt(1, mb.armor.length - 1)];
			equation.type = "armor";
		}

		switch (equationType)
		{
			case 1:
				var n_a = RandomInt(mb.settings.numberMin, mb.settings.numberMax);
				var n_b = RandomInt(mb.settings.numberMin, mb.settings.numberMax);
				var n_c = RandomInt(mb.settings.numberMin, mb.settings.numberMax);
				var n_d = RandomInt(mb.settings.numberMin, mb.settings.numberMax);
				equation.problem = "(" + n_a + " / " + n_b + ") * (" + n_c + " + " + n_d + ")";
				equation.answer = (n_a / n_b) * (n_c + n_d);
				break;

			case 2:
				var n_a = RandomInt(mb.settings.numberMin, mb.settings.numberMax);
				var n_b = RandomInt(mb.settings.numberMin, mb.settings.numberMax);
				var n_c = RandomInt(mb.settings.numberMin, mb.settings.numberMax);
				var n_d = RandomInt(mb.settings.numberMin, mb.settings.numberMax);
				equation.problem = "(" + n_a + " * " + n_b + ") - (" + n_c + " * " + n_d + ")";
				equation.answer = (n_a * n_b) - (n_c * n_d);
				break;
			
			case 3:
				var n_a = RandomInt(mb.settings.numberMin, mb.settings.numberMax);
				var n_b = RandomInt(mb.settings.numberMin, mb.settings.numberMax);
				var n_c = RandomInt(mb.settings.numberMin, mb.settings.numberMax);
				var n_d = RandomInt(mb.settings.numberMin, mb.settings.numberMax);
				equation.problem = "(" + n_a + " - " + n_b + ") / (" + n_c + " + " + n_d + ")";
				equation.answer = (n_a - n_b) / (n_c + n_d);
				break;

			default:
				var n_a = RandomInt(mb.settings.numberMin, mb.settings.numberMax);
				var n_b = RandomInt(mb.settings.numberMin, mb.settings.numberMax);
				var n_c = RandomInt(mb.settings.numberMin, mb.settings.numberMax);
				var n_d = RandomInt(mb.settings.numberMin, mb.settings.numberMax);
				var n_e = RandomInt(mb.settings.numberMin, mb.settings.numberMax);
				var n_f = RandomInt(mb.settings.numberMin, mb.settings.numberMax);
				var n_g = RandomInt(mb.settings.numberMin, mb.settings.numberMax);
				var n_h = RandomInt(mb.settings.numberMin, mb.settings.numberMax);
				equation.problem = "[(" + n_a + " / " + n_b + ") * (" + n_c + " + " + n_d + ")] + [(" + n_e + " / " + n_f + ") * (" + n_g + " + " + n_h + ")]";
				equation.answer = ((n_a / n_b) * (n_c + n_d)) + ((n_e / n_f) * (n_g + n_h));
				break;
		}
		mb.equations.active.push(equation);
		message.channel.send("A " + equation.thing.name + " has dropped.\nThe equation is " + equation.problem + ".\nType .take <solution> to take the " + equation.thing.name + ".");
	}
	var cmd = message.content.split(" ");
	switch (cmd[0])
	{
	
	}
	if (cmd[0] == ".help")
	{
		message.channel.send("**Math Battles 2.0** is a bot where you can gain weapons by solving math equations, you can then use these weapons to murder your friends.");
		message.channel.send("__**Commands**__\n**.help** - *Show this message*\n**.fight <@User>** - *Fight somebody*\n**.buy [optional - item]** - *Buy an item*\n**.take <answer>** - *Take an item by solving the equation*\n**.sell <weapon/armor>** - *Sell your weapon or armor for gold*\n**.equations** - *List all current equations*");
	}
	else if (cmd[0] == ".profile")
	{
		var ply = mb.active[message.author.id];
		message.reply("\nYou are wielding " + ply.weapon.name + ".\nYou are wearing " + ply.armor.name + ".\nYou have " + ply.gold + " gold.");
	}
	else if (cmd[0] == ".fight")
	{
		var attacker = message.author;
		var target = message.mentions.users.first();
		if (typeof cmd[1] != "string" || typeof target == "undefined" || typeof target.id != "string" || typeof target.username != "string" || attacker.id == target.id)
		{
			message.reply("You cannot fight that person!");
			return;
		}
		message.channel.send(attacker.username + " is attacking " + target.username + "!");
		ValidatePlayerInventory(target);
		var min = Math.ceil(mb.settings.rollMin);
		var max = Math.floor(mb.settings.rollMax);
		var attacker_roll = RandomInt(min, max);
		var target_roll = RandomInt(min, max);
		var attacker_power = mb.active[attacker.id].weapon.damage - mb.active[target.id].armor.protection;
		var target_power = mb.active[target.id].weapon.damage - mb.active[attacker.id].armor.protection;
		message.channel.send(attacker.username + " rolled a " + attacker_roll + ".");
		message.channel.send(target.username + " rolled a " + target_roll + ".");
		if (attacker_power + attacker_roll > target_power + target_roll)
		{
			message.channel.send(attacker.username + " has won the fight!");
			var winnings = mb.active[target.id].weapon.damage + mb.active[target.id].armor.protection + mb.active[target.id].gold;
			mb.active[attacker.id].gold += winnings;
			message.channel.send(attacker.username + " has received " + winnings + " gold.");
			KillPlayer(target);
			return;
		}
		else
		{
			message.channel.send(target.username + " has won the fight!");
			var winnings = mb.active[attacker.id].weapon.damage + mb.active[attacker.id].armor.protection + mb.active[attacker.id].gold;
			mb.active[target.id].gold += winnings;
			message.channel.send(target.username + " has received " + winnings + " gold.");
			KillPlayer(attacker);
			return;
		}
	}
	else if (cmd[0] == ".take")
	{
		var answer = parseFloat(cmd[1])
		if (typeof answer != "number")
		{
			message.reply("Wrong answer!");
			return;
		}
		for (i = 0; i < mb.equations.active.length; i++)
		{
			var equation = mb.equations.active[i];
			if (Math.abs(Difference(equation.answer, answer)) < 0.2)
			{
				if (equation.type == "weapon")
				{
					if (mb.active[message.author.id].weapon.damage > equation.thing.damage)
					{
						message.reply("You already have a better weapon!");
						return;
					}
					else
					{
						mb.active[message.author.id].weapon = equation.thing;
						message.reply("You took the " + equation.thing.name + ".");
						mb.equations.active.splice(i, 1);
						return;
					}
				}
				else if (equation.type == "armor")
				{
					if (mb.active[message.author.id].armor.protection > equation.thing.protection)
					{
						message.reply("You already have better armor!");
						return;
					}
					else
					{
						mb.active[message.author.id].armor = equation.thing;
						message.reply("You took the " + equation.thing.name + ".");
						mb.equations.active.splice(i, 1);
						return;
					}
				}
				else if (equation.type == "item")
				{
					// Items coming soon!
				}
				else
				{
					mb.equations.active.splice[i, 1];
					return;
				}
			}
		}
		message.reply("Wrong answer!");
	}
	else if (cmd[0] == ".buy")
	{
		var type = cmd[1];
		var id = cmd[2];
		if (typeof type == "undefined" || typeof id == "undefined" || id < 1)
		{
			message.channel.send(mb.info.buyhelp);
			return;
		}
		if (type == "weapon")
		{
			var weapon = mb.weapons[id];
			if (typeof weapon != "undefined")
			{
				if (weapon.damage <= mb.active[message.author.id].weapon.damage)
				{
					message.reply("You already have a more powerful weapon!");
					return;
				}
				if (weapon.cost > mb.active[message.author.id].gold)
				{
					message.reply("You cannot afford this weapon!");
					return;
				}
				message.reply("You have bought a " + weapon.name + " for " + weapon.cost + " gold.")
				mb.active[message.author.id].gold = mb.active[message.author.id].gold - weapon.cost
				mb.active[message.author.id].weapon = weapon
			}
		}
		else if (type == "armor")
		{
			var armor = mb.armor[id];
			if (typeof armor != "undefined")
			{
				if (armor.protection <= mb.active[message.author.id].armor.protection)
				{
					message.reply("You already have more powerful armor!");
					return;
				}
				if (armor.cost > mb.active[message.author.id].gold)
				{
					message.reply("You cannot afford this armor!");
					return;
				}
				message.reply("You have bought a " + armor.name + " for " + armor.cost + " gold.")
				mb.active[message.author.id].gold = mb.active[message.author.id].gold - armor.cost
				mb.active[message.author.id].armor = armor
			}
		}
		else
		{
			message.channel.send(mb.info.buyhelp);
			return;
		}
	}
	else if (cmd[0] == ".sell")
	{
		var item = cmd[1];
		if (typeof item == "undefined")
		{
			message.reply("Invalid argument! Type either \"weapon\" or \"armor\" as arguments.");
			return;
		}
		else
		{
			if (item == "weapon")
			{
				if (mb.active[message.author.id].weapon == mb.weapons[mb.settings.defaultWeaponID])
				{
					message.reply("You cannot sell " + mb.weapons[mb.settings.defaultWeaponID].name + "!");
					return;
				}
				else
				{
					message.reply("You have sold your " + mb.active[message.author.id].weapon.name + " for " + mb.active[message.author.id].weapon.cost + " gold.");
					mb.active[message.author.id].gold = mb.active[message.author.id].gold + mb.active[message.author.id].weapon.cost;
					mb.active[message.author.id].weapon = mb.weapons[mb.settings.defaultWeaponID];
					return;
				}
			}
			else if (item == "armor")
			{
				if (mb.active[message.author.id].armor == mb.armor[mb.settings.defaultWeaponID])
				{
					message.reply("You cannot sell " + mb.armor[mb.settings.defaultWeaponID].name + "!");
					return;
				}
				else
				{
					message.reply("You have sold your " + mb.active[message.author.id].armor.name + " for " + mb.active[message.author.id].armor.cost + " gold.");
					mb.active[message.author.id].gold = mb.active[message.author.id].gold + mb.active[message.author.id].armor.cost;
					mb.active[message.author.id].armor = mb.armor[mb.settings.defaultArmorID];
					return;
				}
			}
			else
			{
				message.reply("Invalid argument! Type either \"weapon\" or \"armor\" as arguments.");
				return;
			}
		}
	}
	else if (cmd[0] == ".equations")
	{
		message.channel.send("**Active Equations**");
		for (i = 0; i < mb.equations.active.length; i++)
		{
			// Retreieve equation object
			var equation = mb.equations.active[i];
			message.channel.send(equation.problem + " - " + equation.thing.name);
		}
	}
	else if (cmd[0] == ".setting")
	{
		var key = cmd[1];
		var val = cmd[2];
		if (typeof key == "undefined" || typeof val == "undefined")
		{
			message.channel.send("Unable to change setting.");
			return;
		}
		message.channel.send("Setting changed.");
		mb.settings[key] = val;
	}
	else if (cmd[0] == ".cheat")
	{
		var target = message.mentions.users.first();
		var command = cmd[1];
		var arg1 = cmd[3];
		var arg2 = cmd[4];
		var hasArg1 = true;
		var hasArg2 = true;
		if (typeof command == "undefined" || typeof target == "undefined")
		{
			message.reply("Invalid argument!");
			return;
		}
		if (typeof arg1 == "undefined")
		{
			hasArg1 = false;
		}
		if (typeof arg2 == "undefined")
		{
			hasArg2 = false;
		}
		if (command == "slay")
		{
			KillPlayer(target);
			message.channel.send(target.username + " was auto-slain.");
		}
		else if (command == "givegold" && hasArg1)
		{
			mb.active[target.id].gold = mb.active[target.id].gold + parseInt(arg1);
			message.channel.send(target.username + " was given " + arg1 + " gold.");
		}
	}
});

bot.login(token);
