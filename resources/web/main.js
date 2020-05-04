var socket = null;

function connect() {
    console.log("Начало подключения");
    socket = new WebSocket("ws://" + window.location.host + "/ws");

    socket.onerror = () => console.log("ошибка сокета");

    socket.onopen = () => write("Подключен");

    socket.onclose = (evt) => {
        const explanation = evt.reason && evt.reason.length > 0 ? "Причина: " + evt.reason : "Без причины";
        write(`Отключен. ${explanation}(${evt.code})`);
        setTimeout(connect, 5000);
    };

    socket.onmessage = (event) => write(event.data.toString());
}

function write(message){
    const line = document.createElement("p");
    line.className = "message";
    line.textContent = message;

    const messagesDiv = document.getElementById("messages");
    messagesDiv.appendChild(line);
    messagesDiv.scrollTop = line.offsetTop;
}

function onSend(){
    const input = document.getElementById("commandInput");
    if (input) {
        const text = input.value;
        if (text && socket) {
            socket.send(text);
            input.value = "";
        }
    }
}

function start(){
    connect();
    document.getElementById("sendButton").onclick = onSend;
    document.getElementById("commandInput").onkeydown = (e) => {e.keyCode == 13 && onSend()};
}

function initLoop(){
    document.getElementById("sendButton") ? start() : setTimeout(initLoop, 300);
}

initLoop();
