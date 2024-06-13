const socket = io();
let productsContainer = document.getElementById("productsContainer");
socket.emit("connectionServer", "websocket server connected");

socket.on("updateProducts", (products) => {
  productsContainer.innerHTML = "";
  products.forEach((p) => {
    productsContainer.innerHTML += `
    <tr>
      <td>${p.title}</td>
      <td>${p.description}</td>
      <td>${p.code}</td>
      <td>${p.price}</td>
      <td>${p.status}</td>
      <td>${p.stock}</td>
      <td>${p.category}</td>
      <td>${p.thumbnails}</td>
    </tr>`;
  });
});

socket.on("deleteProducts", (products) => {
  productsContainer.innerHTML = "";
  products.forEach((p) => {
    productsContainer.innerHTML += `
    <tr>
      <td>${p.title}</td>
      <td>${p.description}</td>
      <td>${p.code}</td>
      <td>${p.price}</td>
      <td>${p.status}</td>
      <td>${p.stock}</td>
      <td>${p.category}</td>
      <td>${p.thumbnails}</td>
    </tr>`;
  });
});
