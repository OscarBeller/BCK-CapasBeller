const addToCart = async (pid) => {
  let cid = "6633a148908d0e9e27814a8a";
  let res = await fetch(
    `http://localhost:8081/api/carts/${cid}/product/${pid}`,
    { method: "post" }
  );
  if (res.status === 200) {
    Toastify({
      text: `Product ${pid} added`,
      style: {
        background: "linear-gradient(to right, #00b09b, #96c93d)",
      },
      duration: 3000,
    }).showToast();
  }
};
