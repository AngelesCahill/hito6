const socket = io(); // Conectar al servidor Socket.IO

// Obtener el nombre del usuario del almacenamiento local
const name = localStorage.getItem('name');

if (!name) {
    console.error('El nombre del usuario no está disponible.'); 
}

// Enviar mensaje al servidor
function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim(); 

    if (name && message) { 
        const fullMessage = `${name}: ${message}`;
        socket.emit('chat message', fullMessage);
        input.value = ''; // Limpiar el campo de entrada
    } else {
        alert('Por favor, ingresa un mensaje.');
    }
}

// Recibir mensajes del servidor
socket.on('chat message', (msg) => {
    const chatMessages = document.getElementById('chatMessages');
    const newMessage = document.createElement('div');
    newMessage.textContent = msg; // Mostrar el mensaje en el chat
    chatMessages.appendChild(newMessage);
});
