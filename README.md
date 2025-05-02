# 🤖 Discord Server Status Bot

Un bot Discord développé en Node.js permettant de **ping** des serveurs de jeu (comme Garry's Mod) et d'afficher leur statut directement dans un salon Discord.  
Parfait pour suivre l'état de tes serveurs communautaires en temps réel ! 🚀

---

## 🛠️ Fonctionnalités

- 🔍 Ping automatique ou manuel des serveurs Garry's Mod
- 🟢 Affiche les serveurs en ligne avec nom, carte, joueurs, mot de passe, ping
- 🔴 Liste les serveurs hors-ligne
- 🔐 Détecte les serveurs protégés par mot de passe
- 📤 Mise à jour dynamique via interactions Discord

---

## 📦 Installation

### 1. Cloner le dépôt

```bash
git clone https://github.com/ton-utilisateur/discord-server-bot.git
cd discord-server-bot
```
### 2. Installer les dépendances
```bash
npm install
```
### 3. Configurer le bot
```json
{
  "token": "TON_TOKEN_DISCORD",
  "guild_id": "TON_GUILD_ID",
  "channel_id": "ID_DU_CHANNEL_OU_ENVOYER_LES_PINGS",
  "server_ips": [
    {
      "name": "Relife",
      "ip": "45.140.212.6",
      "port": 27016
    },
    {
      "name": "Relife 2",
      "ip": "45.140.212.6",
      "port": 27017
    }
  ]
}
```
### 4. Lancer le bot
```bash
node index.js
```
### Info. Structure du projet
```
discord-server-bot/
├── config.json           # Configuration du bot
├── index.js              # Fichier principal
├── commands/
│   ├── ping.js           # Commande !ping
│   └── rename.js         # Commande !rename
└── fonction/
    ├── ping.js           # Fonction pour ping les serveurs
    └── renamer.js        # Fonction pour renommer les membres
```
