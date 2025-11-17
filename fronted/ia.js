// ============================
//  CHAT IA OPENAI
// ============================

// ⚠️ REEMPLAZAR TU API KEY AQUI:
const OPENAI_API_KEY = "TU_API_KEY_AQUI";

const chatInput = document.getElementById("chat-input");
const chatSend = document.getElementById("chat-send");
const chatWindow = document.getElementById("chat-window");

// Función para agregar mensajes al chat
function addMessage(content, sender) {
    const msg = document.createElement("p");
    msg.classList.add(sender === "user" ? "user-msg" : "ai-msg");
    msg.textContent = content;
    chatWindow.appendChild(msg);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Enviar mensaje al hacer click
chatSend.addEventListener("click", sendMessage);

// Enviar con Enter
chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage();
});

// Función principal
async function sendMessage() {
    const userText = chatInput.value.trim();
    if (userText === "") return;

    addMessage(userText, "user");
    chatInput.value = "";

    // Indicador de escribiendo...
    const loadingMsg = document.createElement("p");
    loadingMsg.classList.add("ai-msg");
    loadingMsg.textContent = "Escribiendo...";
    chatWindow.appendChild(loadingMsg);

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini", 
                messages: [
                    { role: "system", content: "Eres un asistente amable que ayuda a diseñar lámparas." },
                    { role: "user", content: userText }
                ]
            })
        });

        const data = await response.json();
        loadingMsg.remove();

        const aiReply = data.choices?.[0]?.message?.content || "Lo siento, hubo un problema.";
        addMessage(aiReply, "ai");

    } catch (error) {
        loadingMsg.remove();
        addMessage("Error de conexión con la IA.", "ai");
    }
}
