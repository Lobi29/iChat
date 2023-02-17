const socket = io();

socket.on("connect", () => {
    console.log(socket.id);
})


socket.on("server", msg => {
    console.log(msg);
})



const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".container");


const userName = prompt("Enter your name to join!");
socket.emit('new-user-joined', userName);

// on user joined
socket.on('user-joined', userName => {
    append(userName + ' : joined the chat.', 'left');
})



socket.on('receive', data => {
    append(data.name + " : " + data.message, 'left');
})

socket.on('left', user => {
    append(user + " : left the chat", 'left');
})



const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerHTML = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    if (message === "") return;

    append("you : " + message + "", 'right');
    messageInput.value = "";

    socket.emit('send', message);
})