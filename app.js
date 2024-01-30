// Importar tiktok-live-connector
const { WebcastPushConnection } = require('tiktok-live-connector');

// Usuario de TikTok a observar
const username = 'camiloyaya1'; // Reemplaza con un usuario en vivo

// Crear una nueva conexión
const tiktokConnection = new WebcastPushConnection(username);

// Conectar al chat con nuestro objeto
tiktokConnection.connect().then(state => {
  console.info(`Conectado al live de ${state.roomId}`);
}).catch(err => {
  console.error('Error al conectar', err);
});

// Escuchar mensajes del chat en vivo de TikTok
tiktokConnection.on('chat', data => {
  console.log(`Nickname del usuario: ${data.nickname}, Comentario: ${data.comment}`);
  if (data.comment.startsWith('!spin')) {
    // Lógica para el comando !spin
    console.log(`Comando !spin activado por ${data.nickname}`);
  }

  if (data.comment.toLowerCase().includes('join')) {
    // Lógica para cuando alguien escribe "join"
    console.log(`${data.nickname} se ha unido al juego`);
  }
  // Aquí puedes agregar la lógica del juego, como responder a ciertos comentarios
});
// Escuchar si comienzan a seguir en vivo de TikTok
tiktokConnection.on('follow', (data) => {
    console.log(data.uniqueId, "followed!");
});
// Escuchar si comparten el en vivo de TikTok
tiktokConnection.on('share', (data) => {
    console.log(data.uniqueId, "shared the stream!");
})
// Escuchar si le dan like al en vivo de TikTok
tiktokConnection.on('like', data => {
    console.log(`${data.uniqueId} sent ${data.likeCount} likes, total likes: ${data.totalLikeCount}`);
    console.log(data)
})
// Escuchar si donan al en vivo de TikTok
tiktokLiveConnection.on('gift', data => {
    if (data.giftType === 1 && !data.repeatEnd) {
        // Streak in progress => show only temporary
        console.log(`${data.uniqueId} is sending gift ${data.giftName} x${data.repeatCount}`);
    } else {
        // Streak ended or non-streakable gift => process the gift with final repeat_count
        console.log(`${data.uniqueId} has sent gift ${data.giftName} x${data.repeatCount}`);
    }
})