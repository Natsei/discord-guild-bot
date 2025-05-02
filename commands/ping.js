const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { pingServer } = require('../fonction/ping');

const history = {};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Ping un serveur GMod via IP:PORT')
    .addStringOption(option =>
      option.setName('adresse')
        .setDescription('Adresse du serveur au format IP:PORT')
        .setRequired(true)
    ),

  async execute(interaction) {
    const adresse = interaction.options.getString('adresse');
    const [ip, port] = adresse.split(':');

    if (!ip || !port || isNaN(port)) {
      return await interaction.reply({ content: 'Format invalide. Utilisez IP:PORT', ephemeral: true });
    }

    const state = await pingServer(ip, parseInt(port));

    if (state) {
      history[ip] = state.name;
      const embed = new EmbedBuilder()
        .setTitle(`📡 Serveur ${ip}:${port}`)
        .addFields(
          { name: '📛 Nom', value: state.name || 'Inconnu' },
          { name: '🗺️ Carte', value: state.map || 'Inconnue' },
          { name: '👥 Joueurs', value: `${state.players.length}/${state.maxplayers}` },
          { name: '🔒 Mot de passe', value: state.password ? 'Oui' : 'Non' },
          { name: '🏓 Ping', value: `${state.ping} ms` }
        )
        .setColor('#32CD32')
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } else {
      const lastKnown = history[ip] || 'Inconnu';
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle(`❌ Serveur injoignable : ${ip}:${port}`)
            .setDescription(`Impossible de contacter ce serveur.`)
            .addFields({ name: '🕵️‍♂️ Dernier serveur connu', value: lastKnown })
            .setColor('#FF0000')
        ]
      });
    }
  }
};