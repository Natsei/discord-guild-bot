const { Client, GatewayIntentBits, SlashCommandBuilder, Routes } = require('discord.js');
const cron = require('node-cron');
const config = require('./config.json');
const { pingServersAndCreateEmbed } = require('./fonction/ping');
const { renameUser } = require('./fonction/renamer');
const fs = require('fs');
const path = require('path');
const { REST } = require('@discordjs/rest');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers]
});

client.once('ready', () => {
  console.log('✅ Bot en ligne !');
  registerSlashCommands();

  cron.schedule('0 * * * * *', async () => {
    console.log('⏱ Ping automatique');
    await sendPingResult();
  });
});

let relifeStatus = false;

async function sendPingResult() {
  const channel = await client.channels.fetch('1360241458338205862');
  const { embed, relifeOnline, relifeAccessible } = await pingServersAndCreateEmbed();
  const messages = await channel.messages.fetch({ limit: 5 });
  const lastMessage = messages.find(msg => msg.embeds.length > 0);

  if (lastMessage) {
    await lastMessage.edit({ embeds: [embed] });
  } else {
    await channel.send({ embeds: [embed] });
  }

  if (!relifeStatus && relifeOnline && relifeAccessible) {
    const role = await channel.guild.roles.fetch('1360246035640750221');
    if (role) {
      await channel.send({ content: `${role.toString()} Le serveur **Relife** est maintenant en ligne ! 🎉` });
    }
    relifeStatus = true;
  }
  if (relifeStatus && (!relifeOnline || !relifeAccessible)) {
    relifeStatus = false;
  }
}

client.on('guildMemberAdd', async member => {
  const newName = `${config.prenom} ${config.nom}`;
  await renameUser(member, newName);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const command = interaction.commandName;
  if (command === 'rename') {
    const user = interaction.options.getUser('user');
    const member = await interaction.guild.members.fetch(user.id);
    const newName = `${config.prenom} ${config.nom}`;
    try {
      await renameUser(member, newName);
      await interaction.reply(`${member.user.tag} a été renommé en ${newName}`);
    } catch (err) {
      await interaction.reply({ content: 'Erreur lors du renommage.', ephemeral: true });
    }
  }
});

async function registerSlashCommands() {
  const commands = [];
  const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    if (command.data) {
      commands.push(command.data);
    }
  }

  const rest = new REST({ version: '10' }).setToken(config.token);
  await rest.put(Routes.applicationCommands(client.user.id), {
    body: commands.map(cmd => cmd.toJSON())
  });
  console.log('✅ Commandes slash enregistrées');
}

client.login(config.token);