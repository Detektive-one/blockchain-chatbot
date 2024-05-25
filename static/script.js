import {
    createNewChat,
    sendMessage,
    viewChatHistory,
    viewChatList,
    renameChat,
    deleteChat
} from './contract.js';

document.addEventListener("DOMContentLoaded", async function() {
    const chatInput = document.querySelector("#chat-input");
    const sendButton = document.querySelector("#send-btn");
    const chatContainer = document.querySelector(".chat-container");
    const themeButton = document.querySelector("#theme-btn");
    const deleteButton = document.querySelector("#delete-btn");
    const newChatButton = document.querySelector("#new-chat-btn");
    const chatList = document.querySelector(".chat-list");
    const renameButton = document.querySelector("#rename-btn");

    let currentChat = null;

    const loadDataFromLocalstorage = async () => {
        const themeColor = localStorage.getItem("themeColor");

        document.body.classList.toggle("light-mode", themeColor === "light_mode");
        themeButton.innerText = document.body.classList.contains("light-mode") ? "dark_mode" : "light_mode";

        const defaultText = `<div class="default-text">
        <h1>Autonomous ChatBot</h1>
        <p>Running on Blockchain Technology.<br> Your chats are all secure.</p>
    </div>`;

        const chats = await viewChatList();
        chatContainer.innerHTML = defaultText;
        chatContainer.scrollTo(0, chatContainer.scrollHeight);

        chatList.innerHTML = '';
        chats.forEach(chat => {
            const chatListItem = createChatListItem(chat.name, chat.identifier);
            chatList.appendChild(chatListItem);
        });
    };

    const createChatElement = (content, className) => {
        const chatDiv = document.createElement("div");
        chatDiv.classList.add("chat", className);
        chatDiv.innerHTML = content;
        return chatDiv;
    };

     

    const handleOutgoingChat = async () => {
        const userText = chatInput.value.trim();
        

        if (!userText || !currentChat) return;
        
        chatInput.value = "";
        chatInput.style.height = `${initialInputHeight}px`;

        const html = `<div class="chat-content">
                        <div class="chat-details">
                            <img src="static/images/user.jpg" alt="user-img">
                            <p>${userText}</p>
                        </div>
                    </div>`;

        const outgoingChatDiv = createChatElement(html, "outgoing");
        chatContainer.querySelector(".default-text")?.remove();
        chatContainer.appendChild(outgoingChatDiv);
        chatContainer.scrollTo(0, chatContainer.scrollHeight);

        await sendMessage(currentChat, userText, false);

        
        setTimeout(() => showTypingAnimation(), 500);
        
    };

    const copyResponse = (copyBtn) => {
        const reponseTextElement = copyBtn.parentElement.querySelector("p");
        navigator.clipboard.writeText(reponseTextElement.textContent);
        copyBtn.textContent = "done";
        setTimeout(() => copyBtn.textContent = "content_copy", 1000);
    };
    const showTypingAnimation = async () => {
        const html = `<div class="chat-content">
                        <div class="chat-details">
                            <img src="static/images/chatbot.jpg" alt="chatbot-img">
                            <div class="typing-animation">
                                <div class="typing-dot" style="--delay: 0.2s"></div>
                                <div class="typing-dot" style="--delay: 0.3s"></div>
                                <div class="typing-dot" style="--delay: 0.4s"></div>
                            </div>
                        </div>
                        <span class="material-symbols-rounded">content_copy</span>
                    </div>`;
    
        const incomingChatDiv = createChatElement(html, "incoming");
        chatContainer.appendChild(incomingChatDiv);
        chatContainer.scrollTo(0, chatContainer.scrollHeight);
        
        setTimeout(() => {
            const typingAnimation = document.querySelector('.typing-animation');
            if (typingAnimation) {
                typingAnimation.remove();
                setTimeout(() => {
                    const currentChatTab = document.querySelector('.chat-list-item.active');
                    if (currentChatTab) {
                        currentChatTab.click(); // Trigger click event
                    }
                }, 500); 
            }
        }, 2000);
      
    };
    

    const loadChat = async (id) => {
        const messages = await viewChatHistory(id);
        if (!messages.length) {
            chatContainer.innerHTML = '<div class="default-text">   <h1>Autonomous ChatBot</h1> <p>Running on Blockchain Technology.<br> Your chats are all secure.</p></div>';
        } else {
            chatContainer.innerHTML = '';
            messages.forEach(message => {
                const html = `<div class="chat-content">
                                <div class="chat-details">
                                    <img src="static/images/${message.fromBot ? 'chatbot.jpg' : 'user.jpg'}" alt="${message.fromBot ? 'chatbot-img' : 'user-img'}">
                                    <p>${message.text}</p>
                                </div>
                                <span class="material-symbols-rounded">content_copy</span>
                              </div>`;
                const chatDiv = createChatElement(html, message.fromBot ? 'incoming' : 'outgoing');
                chatContainer.appendChild(chatDiv);
            });
        }
        chatContainer.scrollTo(0, chatContainer.scrollHeight);
    };
    

    deleteButton.addEventListener("click", async () => {
        if (currentChat && confirm("Are you sure you want to delete the current chat?")) {
            await deleteChat(currentChat);
    
            // Remove the chat from the chat list in local storage
            let savedChats = JSON.parse(localStorage.getItem("chat-list")) || [];
            savedChats = savedChats.filter(chat => chat.id !== currentChat);
            localStorage.setItem("chat-list", JSON.stringify(savedChats));
    
            // Remove the chat history
            localStorage.removeItem(`chat-${currentChat}`);
    
            // Reset the chat container and current chat variable
            currentChat = null;
            chatContainer.innerHTML = '<div class="default-text"><h1>Autonomous ChatBot</h1><p>Running on Blockchain Technology.<br> Your chats are all secure.</p></div>';
            
            // Refresh the chat list UI
            loadDataFromLocalstorage();
        }
    });
    

    const initialInputHeight = chatInput.scrollHeight;

    chatInput.addEventListener("input", () => {
        chatInput.style.height = `${initialInputHeight}px`;
        chatInput.style.height = `${chatInput.scrollHeight}px`;
    });

    chatInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
            e.preventDefault();
            handleOutgoingChat();
        }
    });

    const createChatListItem = (name, id) => {
        const chatListItem = document.createElement("li");
        chatListItem.classList.add("chat-list-item");
        chatListItem.textContent = name;
        chatListItem.dataset.id = id;

        chatListItem.addEventListener("click", async () => {
            // Save current chat state
            if (currentChat !== null) {
                saveCurrentChat();
            }

            // Load selected chat
            currentChat = id;
            await loadChat(id);

            // Highlight active chat
            document.querySelectorAll(".chat-list-item").forEach(item => item.classList.remove("active"));
            chatListItem.classList.add("active");
        });

        return chatListItem;
    };

    newChatButton.addEventListener("click", async () => {
        const chatName = prompt("Enter a name for the new chat:");
        if (!chatName) return;

        const chatId = await createNewChat(chatName);
        const chatListItem = createChatListItem(chatName, chatId);
        chatList.appendChild(chatListItem);

        // Switch to the new chat
        if (currentChat !== null) {
            saveCurrentChat();
        }
        currentChat = chatId;
        chatContainer.innerHTML = '<div class="default-text">   <h1>Autonomous ChatBot</h1> <p>Running on Blockchain Technology.<br> Your chats are all secure.</p></div>';
        chatContainer.scrollTo(0, chatContainer.scrollHeight);

        // Highlight new chat
        document.querySelectorAll(".chat-list-item").forEach(item => item.classList.remove("active"));
        chatListItem.classList.add("active");
    });

    const saveCurrentChat = async () => {
  
    };



    themeButton.addEventListener("click", () => {
        document.body.classList.toggle("light-mode");
        localStorage.setItem("themeColor", document.body.classList.contains("light-mode") ? "light_mode" : "dark_mode");
    });
    
    renameButton.addEventListener("click", async () => {
        const newChatName = prompt("Enter the new name for the chat:");
        if (newChatName) {
            try {
                // Call the renameChat function
                await renameChat(currentChat, newChatName);

                // Update UI
                loadDataFromLocalstorage();
            } catch (error) {
                console.error("Error renaming chat:", error);
                alert("An error occurred while renaming the chat. Please try again.");
            }
        }
    });
    
    await loadDataFromLocalstorage();
    sendButton.addEventListener("click", handleOutgoingChat);
});
