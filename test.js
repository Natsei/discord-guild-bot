const gamedig = require('gamedig');

// Essayer avec l'API moderne de gamedig (par promesse explicite)
gamedig.query({
  type: 'garrysmod',
  host: '45.140.141.100',
  port: 27016,
  socketTimeout: 10000 // Timeout de 10 secondes
}).then((state) => {
  console.log(state);
}).catch((error) => {
  console.error('Erreur:', error);
});
