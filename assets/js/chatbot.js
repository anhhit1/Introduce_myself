/* ============================================
   Chatbot Modal — Open / Close
   ============================================ */
function toggleChat() {
  var modal = document.getElementById("chat-modal");
  if (!modal) return;

  modal.classList.toggle("hidden");
  modal.classList.toggle("flex");

  if (!modal.classList.contains("hidden")) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }
}

/* ============================================
   Chatbot Interaction Logic
   ============================================ */
document.addEventListener("DOMContentLoaded", () => {
  const chatModal = document.getElementById("chat-modal");
  if (!chatModal) return;

  const chatInput = chatModal.querySelector('input[type="text"]');
  const chatSendBtn = chatModal.querySelector(".relative button");
  const chatMessages = document.getElementById("chat-messages");

  if (!chatInput || !chatSendBtn || !chatMessages) return;

  // Load chat history from sessionStorage
  let chatHistory = JSON.parse(sessionStorage.getItem("ai_chat_history")) || [];

  // Function to append a message to the chat
  function appendMessage(sender, text, save = true) {
    const isBot = sender === "bot";

    const wrapper = document.createElement("div");
    wrapper.className = isBot ? "flex gap-3" : "flex gap-3 justify-end";

    const avatar = isBot
      ? `
      <div class="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
        <i class="text-primary w-4 h-4" data-lucide="bot"></i>
      </div>
    `
      : "";

    const bubble = document.createElement("div");
    bubble.className = isBot
      ? "bg-slate-100 dark:bg-white/5 p-3 rounded-2xl rounded-tl-none border border-slate-200 dark:border-white/5 text-sm max-w-[80%] text-slate-800 dark:text-slate-200"
      : "bg-primary text-white p-3 rounded-2xl rounded-tr-none text-sm max-w-[80%]";

    // Convert newlines to breaks
    bubble.innerHTML = text.replace(/\n/g, "<br/>");

    if (isBot) {
      wrapper.innerHTML = avatar;
      wrapper.appendChild(bubble);
    } else {
      wrapper.appendChild(bubble);
    }

    chatMessages.appendChild(wrapper);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Save to session history
    if (save) {
      chatHistory.push({ sender, text });
      sessionStorage.setItem("ai_chat_history", JSON.stringify(chatHistory));
    }

    // re-initialize lucide icons inside the new message
    if (typeof lucide !== "undefined") {
      lucide.createIcons({ root: wrapper });
    }
  }

  // Function to send the message
  async function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;

    // Clear input field
    chatInput.value = "";

    // Render user message instantly
    appendMessage("user", message);

    // Show temporary typing indicator
    const typingId = "typing-" + Date.now();
    const typingWrapper = document.createElement("div");
    typingWrapper.className = "flex gap-3";
    typingWrapper.id = typingId;
    typingWrapper.innerHTML = `
      <div class="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
        <i class="text-primary w-4 h-4" data-lucide="bot"></i>
      </div>
      <div class="bg-slate-100 dark:bg-white/5 p-3 rounded-2xl rounded-tl-none border border-slate-200 dark:border-white/5 text-sm flex gap-1 items-center">
        <span class="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
        <span class="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></span>
        <span class="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></span>
      </div>
    `;

    chatMessages.appendChild(typingWrapper);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    if (typeof lucide !== "undefined")
      lucide.createIcons({ root: typingWrapper });

    try {
      // POST request to backend
      const response = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: message }),
      });

      const data = await response.json();

      // Remove typing indicator
      const typingElem = document.getElementById(typingId);
      if (typingElem) typingElem.remove();

      // Render bot response
      if (response.ok) {
        appendMessage("bot", data.reply);
      } else {
        appendMessage(
          "bot",
          "Xin lỗi, có lỗi từ máy chủ: " +
            (data.detail || "Lỗi không xác định"),
        );
      }
    } catch (error) {
      const typingElem = document.getElementById(typingId);
      if (typingElem) typingElem.remove();

      appendMessage(
        "bot",
        "Xin lỗi, không thể kết nối tới server. Vui lòng thử lại sau.",
      );
      console.error(error);
    }
  }

  // Event Listeners for sending message
  chatSendBtn.addEventListener("click", sendMessage);
  chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  });
});
