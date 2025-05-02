const { SlashCommandBuilder } = require('discord.js');
const { renameUser } = require('../fonction/renamer');
const config = require('../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rename')
    .setDescription('Renomme un utilisateur avec le prénom et nom définis')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('L\'utilisateur à renommer')
        .setRequired(true)
    ),

  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const member = await interaction.guild.members.fetch(user.id);
    const newName = `${config.prenom} ${config.nom}`;

    try {
      await renameUser(member, newName);
      await interaction.reply(`${user.tag} a été renommé en **${newName}**.`);
    } catch (error) {
      console.error('Erreur lors du renommage :', error);
      await interaction.reply({ content: '❌ Impossible de renommer cet utilisateur.', ephemeral: true });
    }
  }
};