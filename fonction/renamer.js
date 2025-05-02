async function renameUser(member, newName) {
    try {
      await member.setNickname(newName);
      console.log(`Renommé ${member.user.username} en ${newName}`);
    } catch (err) {
      console.error(`Erreur pour ${member.user.tag}`, err);
    }
  }
  
  module.exports = { renameUser };