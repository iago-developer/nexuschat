const body = document.querySelector("body");
const login = document.querySelector(".login");
const loginForm = login.querySelector(".formLogin");
const loginInput = login.querySelector(".inputForm");

const chat = document.querySelector(".chat");
const chatForm = chat.querySelector(".formChat");
const chatInput = chat.querySelector(".chatFormInput");
const chatMessages = chat.querySelector(".chatMessages");

const colors = [
    "cadetblue",
    "darkgoldenrod",
    "cornflowerblue",
    "darkkhaki",
    "hotpink",
    "gold"
];

const user = { id: "", name: "", color: "", content: "" };

let websocket;

const createMessageSelfElement = content => {
    const div = document.createElement("div");

    div.classList.add("message-self");
    div.innerHTML = content;

    return div;
};

const createMessageOtherElement = (content, sender, senderColor) => {
    const div = document.createElement("div");
    const span = document.createElement("span");

    div.classList.add("message-other");
    div.classList.add("message-self");
    span.classList.add("message-sender");
    span.style.color = senderColor;

    div.appendChild(span);
    span.innerHTML = sender;

    div.innerHTML += content;

    return div;
};

const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
};

const processMessage = ({ data }) => {
    const { userId, userName, userColor, userContent } = JSON.parse(data);

    const message =
        userId == user.id
            ? createMessageSelfElement(userContent)
            : createMessageOtherElement(userContent, userName, userColor);
    chatMessages.appendChild(message);
};

const handleLogin = event => {
    event.preventDefault();
    user.id = crypto.randomUUID();
    user.name = loginInput.value;
    user.color = getRandomColor();

    login.style.display = "none";
    chat.style.display = "flex";

    websocket = new WebSocket("ws://localhost:8080");
    websocket.onmessage = processMessage;
};

const sendMessage = event => {
    event.preventDefault();

    const message = {
        userId: user.id,
        userName: user.name,
        userColor: user.color,
        userContent: chatInput.value
    };

    websocket.send(JSON.stringify(message));

    chatInput.value = "";
};

loginForm.addEventListener("submit", handleLogin);
chatForm.addEventListener("submit", sendMessage);
