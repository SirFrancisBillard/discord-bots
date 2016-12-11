const Discord = require("discord.js");
const bot = new Discord.Client();
const token = "MjU3NDIzNjI1Mzk1NjM0MTc3.Cy6f9g.gK7EvS9LcY2QxMCis6WvXJGxpSU";

var mb = {
	weapons:[{id:0, name:"nothing", damage:0, cost:0}],
	armor:[{id:0, name:"nothing", protection:0, cost:0}],
	items:[],
	settings:{defaultGold:0, defaultWeaponID:0, defaultArmorID:0, numberMin:1, numberMax:18, rollMin:0, rollMax:10, messagesForDrop:20},
	info:{name:"Math Battles 2.0", author:"Sir Francis Billard"},
	equations:{timer:0, active:[]},
	active:{}
};

function RandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function RegisterWeapon(a, b)
{
	// Add a weapon to the weapon table
	mb.weapons.push({id:mb.weapons.length, name:a, damage:b, cost:Math.ceil(b * b / 2)});
}

function RegisterArmor(a, b)
{
	// Add armor to the armor table
	mb.armor.push({id:mb.armor.length, name:a, protection:b, cost:Math.ceil(b * b / 2)});
}

function ValidatePlayerInventory(user)
{
	// Retrieve the player's inventory
	var ply = mb.active[user.id];
	// Check if the player's inventory is invalid
	if (typeof ply == "undefined")
	{
		// Create the inventory
		mb.active[user.id] = {};
		// Retrieve the player's inventory again in case it didn't exist before
		ply = mb.active[user.id];
	}
	// Make sure his inventory items exist, and set them to default if they don't
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
	// Retrieve the player's inventory
	var ply = mb.active[user.id];
	// Check if the player's inventory is invalid
	if (typeof ply == "undefined")
	{
		// Create the inventory
		mb.active[message.author.id] = {};
		// Retrieve the player's inventory again in case it didn't exist before
		ply = mb.active[user.id];
	}
	// Reset the player's inventory
	ply.weapon = mb.weapons[mb.settings.defaultWeaponID];
	ply.armor = mb.armor[mb.settings.defaultArmorID];
	ply.gold = mb.settings.defaultGold;
}

// Hook on the the message event
bot.on("message", message =>
{
	mb.equations.timer++;
	if (mb.equations.timer >= mb.settings.messagesForDrop)
	{
		// Reset timer
		mb.equations.timer = 0;
		// Declare object variable in this scope
		var equation = {};
		// Store the random number in a variable to reuse it
		var randy = RandomInt(1, 4);
		// Decide whether the item is armor, an item, or a weapon
		if (RandomInt(1, 2) < 2)
		{
			// Choose a random weapon
			equation.thing = mb.weapons[RandomInt(1, mb.weapons.length - 1)];
			equation.type = "weapon";
		}
		else
		{
			// Choose random armor
			equation.thing = mb.armor[RandomInt(1, mb.armor.length - 1)];
			equation.type = "armor";
		}
		// Set the equation
		if (randy == 1)
		{
			var n_a = RandomInt(mb.settings.numberMin, mb.settings.numberMax);
			var n_b = RandomInt(mb.settings.numberMin, mb.settings.numberMax);
			var n_c = RandomInt(mb.settings.numberMin, mb.settings.numberMax);
			var n_d = RandomInt(mb.settings.numberMin, mb.settings.numberMax);
			equation.problem = "(" + n_a + " / " + n_b + ") * (" + n_c + " + " + n_d + ")";
			equation.answer = (n_a / n_b) * (n_c + n_d)
		}
		else if (randy == 2)
		{
			var n_a = RandomInt(mb.settings.numberMin, mb.settings.numberMax);
			var n_b = RandomInt(mb.settings.numberMin, mb.settings.numberMax);
			var n_c = RandomInt(mb.settings.numberMin, mb.settings.numberMax);
			var n_d = RandomInt(mb.settings.numberMin, mb.settings.numberMax);
			equation.problem = "(" + n_a + " * " + n_b + ") - (" + n_c + " * " + n_d + ")";
			equation.answer = (n_a * n_b) - (n_c * n_d)
		}
		else if (randy == 3)
		{
			var n_a = RandomInt(mb.settings.numberMin, mb.settings.numberMax);
			var n_b = RandomInt(mb.settings.numberMin, mb.settings.numberMax);
			var n_c = RandomInt(mb.settings.numberMin, mb.settings.numberMax);
			var n_d = RandomInt(mb.settings.numberMin, mb.settings.numberMax);
			equation.problem = "(" + n_a + " - " + n_b + ") / (" + n_c + " + " + n_d + ")";
			equation.answer = (n_a - n_b) / (n_c + n_d)
		}
		else
		{
			var n_a = RandomInt(mb.settings.numberMin, mb.settings.numberMax);
			var n_b = RandomInt(mb.settings.numberMin, mb.settings.numberMax);
			var n_c = RandomInt(mb.settings.numberMin, mb.settings.numberMax);
			var n_d = RandomInt(mb.settings.numberMin, mb.settings.numberMax);
			var n_e = RandomInt(mb.settings.numberMin, mb.settings.numberMax);
			var n_f = RandomInt(mb.settings.numberMin, mb.settings.numberMax);
			var n_g = RandomInt(mb.settings.numberMin, mb.settings.numberMax);
			var n_h = RandomInt(mb.settings.numberMin, mb.settings.numberMax);
			equation.problem = "[(" + n_a + " / " + n_b + ") * (" + n_c + " + " + n_d + ")] + [(" + n_e + " / " + n_f + ") * (" + n_g + " + " + n_h + ")]";
			equation.answer = ((n_a / n_b) * (n_c + n_d)) + ((n_e / n_f) * (n_g + n_h))
		}
		mb.equations.active.push(equation)
		// Tell them an item has dropped
		message.channel.sendMessage("A " + equation.thing.name + " has dropped.");
		message.channel.sendMessage("The equation is " + equation.problem + ".");
		message.channel.sendMessage("Type .take <solution> to take the " + equation.thing.name + ".");
	}
	var cmd = message.content.split(" ");
	if (cmd[0] == ".help")
	{
		// Display help text
		message.reply("**Math Battles 2.0** is a bot where you can gain weapons by solving math equations, you can then use these weapons to murder your friends.");
		message.reply("__**Commands**__");
		message.reply("**.help** - *Show this message*");
		message.reply("**.fight <@User>** - *Fight somebody*");
		message.reply("**.buy [optional - item]** - *Buy an item*");
		message.reply("**.take <answer>** - *Take an item by solving the equation*");
	}
	else if (cmd[0] == ".profile")
	{
		// Make sure their items exist
		ValidatePlayerInventory(message.author);
		// Retrieve their items
		var ply = mb.active[message.author.id];
		// Tell them their items
		message.reply("\nYou are wielding " + ply.weapon.name + ".\nYou are wearing " + ply.armor.name + ".\nYou have " + ply.gold + " gold.");
	}
	else if (cmd[0] == ".fight")
	{
		// Store the two fighters in variables for easier access
		var attacker = message.author;
		var target = message.mentions.users.first();
		// Detect if target is invalid
		if (typeof cmd[1] != "string" || typeof target == "undefined" || typeof target.id != "string" || typeof target.username != "string" || attacker.id == target.id)
		{
			// Alert them and abort
			message.reply("You cannot fight that person!");
			return;
		}
		// Announce fight
		message.channel.sendMessage(attacker.username + " is attacking " + target.username + "!");
		// Make sure all items exist
		ValidatePlayerInventory(attacker);
		ValidatePlayerInventory(target);
		// Round values
		var min = Math.ceil(mb.settings.rollMin);
		var max = Math.floor(mb.settings.rollMax);
		// Add a random aspect to turn tables
		var attacker_roll = RandomInt(min, max);
		var target_roll = RandomInt(min, max);
		// Decide attack strength based on weapon and enemy's armor
		var attacker_power = mb.active[attacker.id].weapon.damage - mb.active[target.id].armor.protection;
		var target_power = mb.active[target.id].weapon.damage - mb.active[attacker.id].armor.protection;
		// Let them know what they rolled
		message.channel.sendMessage(attacker.username + " rolled a " + attacker_roll + ".");
		message.channel.sendMessage(target.username + " rolled a " + target_roll + ".");
		// Decide the winner
		if (attacker_power + attacker_roll > target_power + target_roll)
		{
			// Announce the winner
			message.channel.sendMessage(attacker.username + " has won the fight!");
			// Calculate winnings based on inventory quality
			var winnings = mb.active[target.id].weapon.damage + mb.active[target.id].armor.protection;
			message.channel.sendMessage(attacker.username + " has received " + winnings + " gold.");
			return;
		}
		else
		{
			// Announce the winner
			message.channel.sendMessage(target.username + " has won the fight!");
			// Calculate winnings based on inventory quality
			var winnings = mb.active[attacker.id].weapon.damage + mb.active[attacker.id].armor.protection;
			message.channel.sendMessage(target.username + " has received " + winnigs + " gold.");
			return;
		}
	}
	else if (cmd[0] == ".take")
	{
		// Make sure the answer is a decimal
		var answer = parseFloat(cmd[1])
		// Check if the answer is even a number
		if (typeof answer != "number")
		{
			// Alert them and abort
			message.reply("Wrong answer!");
			return;
		}
		// Loop through all non-claimed equations
		for (i = 0; i < mb.equations.active.length; i++)
		{
			// Retreieve equation object
			var equation = mb.equations.active[i];
			// Allow for a small margin of error
			if (equation.answer - answer < 0.2 || answer - equation.answer < 0.2)
			{
				ValidatePlayerInventory(message.author)
				if (equation.type == "weapon")
				{
					// Check if player has a better weapon
					if (mb.active[message.author.id].weapon.damage > equation.thing.damage)
					{
						// Alert them and abort
						message.reply("You already have a better weapon!");
						return;
					}
					else
					{
						// Give the weapon to the player
						mb.active[message.author.id].weapon = equation.thing;
						// Tell them what they got
						message.reply("You took the " + equation.thing.name + ".");
					}
				}
				else if (equation.type == "armor")
				{
					// Check if player has better armor
					if (mb.active[message.author.id].armor.protection > equation.thing.protection)
					{
						// Alert them and abort
						message.reply("You already have better armor!");
						return;
					}
					else
					{
						// Give the armor to the player
						mb.active[message.author.id].armor = equation.thing;
						// Tell them what they got
						message.reply("You took the " + equation.thing.name + ".");
					}
				}
				else if (equation.type == "item")
				{
					// Items coming soon!
				}
				else
				{
					// Remove the equation because it isn't supposed to be there
					mb.equations.active.splice[i, 1];
					return;
				}
				
				// Remove the equation from the list of non-claimed equations
				mb.equations.active.splice[i, 1];
				return;
			}
		}
		// If the entire loop runs without being aborted, they failed
		message.reply("Wrong answer!");
	}
	else if (cmd[0] == ".buy")
	{
		var item = cmd[1];
		if (typeof item == "undefined")
		{
			// Tell them what they can buy
			message.channel.sendMessage("**Buyable Weapons**");
			for (i = 1; i < mb.weapons.length; i++)
			{
				message.channel.sendMessage(i + " - " + mb.weapons[i].name + " - Cost: " + mb.weapons[i].cost);
			}
			message.channel.sendMessage("**Buyable Armor**");
			for (i = 1; i < mb.armor.length; i++)
			{
				message.channel.sendMessage(i + " - " + mb.armor[i].name + " - Cost: " + mb.armor[i].cost);
			}
			return;
		}
		else
		{
			// Buy the item
		}
	}
});

// Register weapons
RegisterWeapon("Butterknife", 1);
RegisterWeapon("Shagger", 2);
RegisterWeapon("Kitchen Knife", 3);
RegisterWeapon("Dagger", 4);
RegisterWeapon("Spear", 5);
RegisterWeapon("Broadsword", 6);
RegisterWeapon("Crowbar", 7);
RegisterWeapon("Bow", 8);
RegisterWeapon("Crossbow", 9);
RegisterWeapon("Pistol", 10);
RegisterWeapon("Rifle", 11);
RegisterWeapon("Negev", 12);
RegisterWeapon("Mini-Nuke", 13);

// Register armor
RegisterArmor("Underpants", 1);
RegisterArmor("Baseball Cap", 2);
RegisterArmor("Cotton T-Shirt", 3);
RegisterArmor("Hoop Ringmail", 4);
RegisterArmor("Coarse Chainmail", 5);
RegisterArmor("Fine Ringmail", 6);
RegisterArmor("Carbon Plating", 7);
RegisterArmor("Kevlar Vest", 8);
RegisterArmor("Military Grade Ceramic Suit", 9);
RegisterArmor("HEV Suit", 10);

// Initialize bot
bot.login(token);
