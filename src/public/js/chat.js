Swal.fire({
  title: "Ingrese su nombre",
  input: "text",
  inputValidator: (value) => {
    return !value && "Debe ingresar un nombre";
  },
  allowOutsideClick: false,
}).then((datos) => {
  const socket = io();
  let name = datos.value;
  document.title = "Chat de " + name;
  socket.emit("newConnection", `Se conecto: ${name}`);

  let inputMessage = document.getElementById("message");
  let divMessage = document.getElementById("messages");
  inputMessage.focus();

  socket.emit("id", name);
  socket.on("newUser", (name) => {
    Toastify({
      text: `${name} conectado`,
      style: {
        background: "linear-gradient(to right, #00b09b, #96c93d)",
      },
      duration: 3000,
    }).showToast();
  });

  inputMessage.addEventListener("keyup", (e) => {
    e.preventDefault();
    if (e.code === "Enter" && e.target.value.trim().length > 0) {
      socket.emit("newMessage", name, e.target.value.trim());
      e.target.value = "";
      e.target.focus();
    }
  });

  socket.on("sendMessage", (userName, message) => {
    let className = userName === name ? "me" : "others";
    divMessage.innerHTML += `
    <div class="msg">
      <div class="${className}">
      <strong>${userName}</strong>
      <p>${message}</p>
      </div>
    </div>
    `;
    divMessage.scrollTop = divMessage.scrollHeight;
  });

  socket.on("previousMessages", (messages) => {
    messages.forEach((messagesList) => {
      let className = messagesList.user === name ? "me" : "others";
      divMessage.innerHTML += `
      <div class="msg ${className}">
        <strong>${messagesList.user}</strong>
        <p>${messagesList.message}</p>
      </div>
      `;
      divMessage.scrollTop = divMessage.scrollHeight;
    });
  });
});
