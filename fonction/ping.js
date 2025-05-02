// === fonction/ping.js ===
const gamedig = require('gamedig');
const { EmbedBuilder } = require('discord.js');
const config = require('../config.json');

async function pingServer(ip, port) {
  try {
    const state = await gamedig.query({
      type: 'garrysmod',
      host: ip,
      port: port
    });
    return state;
  } catch (error) {
    return null;
  }
}

async function pingServersAndCreateEmbed() {
  let onlineServers = '';
  let offlineServers = '';
  let relifeOnline = false;
  let relifeAccessible = false;

  for (const server of config.server_ips) {
    const result = await pingServer(server.ip, server.port);
    if (result) {
      const isPasswordProtected = result.password;
      const serverInfo = `✅ **${server.name}** (${server.ip})\n• 📛 Nom : ${result.name}\n• 🗺️ Carte : ${result.map}\n• 👥 Joueurs : ${result.players.length}/${result.maxplayers}\n• 🔒 Mot de passe : ${isPasswordProtected ? 'Oui' : 'Non'}\n• 🏓 Ping : ${result.ping ?? 'Inconnu'} ms\n\n`;
      onlineServers += serverInfo;
      if (server.name === 'Relife') {
        relifeOnline = true;
        if (!isPasswordProtected) relifeAccessible = true;
      }
    } else {
      offlineServers += `❌ **${server.name}** (${server.ip})\n`;
    }
  }

  const embed = new EmbedBuilder()
    .setTitle('📡 **Statut des Serveurs de Jeu**')
    .setDescription('Voici l\'état actuel de tous les serveurs.')
    .addFields(
      { name: '🔵 **En Ligne**', value: onlineServers || 'Aucun' },
      { name: '🔴 **Hors Ligne**', value: offlineServers || 'Aucun' }
    )
    .setColor(onlineServers ? '#32CD32' : '#FF6347')
    .setFooter({ text: `Bot par Nats - ${new Date().toLocaleString()}` })
    .setTimestamp();

  return { embed, relifeOnline, relifeAccessible };
}

module.exports = { pingServersAndCreateEmbed, pingServer };