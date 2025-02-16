const socket = io(); // Conectar al servidor Socket.IO

// Obtener el nombre del usuario del almacenamiento local
const name = localStorage.getItem('name');

if (!name) {
    console.error('El nombre del usuario no está disponible.'); // Mensaje de error si no se encuentra el nombre
}

// Enviar mensaje al servidor
function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim(); // Usar trim() para eliminar espacios en blanco

    if (name && message) { // Verificar que el nombre y el mensaje no estén vacíos
        const fullMessage = `${name}: ${message}`; // Formatear el mensaje con el nombre
        socket.emit('chat message', fullMessage); // Emitir el mensaje al servidor
        input.value = ''; // Limpiar el campo de entrada
    } else {
        alert('Por favor, ingresa un mensaje.'); // Alerta si falta información
    }
}

// Recibir mensajes del servidor
socket.on('chat message', (msg) => {
    const chatMessages = document.getElementById('chatMessages');
    const newMessage = document.createElement('div');
    newMessage.textContent = msg; // Mostrar el mensaje en el chat
    chatMessages.appendChild(newMessage);
});
