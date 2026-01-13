document.addEventListener("DOMContentLoaded", async () => {

  const contenedor = document.getElementById("favoritos");
  contenedor.innerHTML = "";

  const token = localStorage.getItem("token");

  if (!token) {
    alert("Debes iniciar sesión para ver tus favoritos.");
    return;
  }

  try {
    // Traer IDs favoritos
    const respFav = await fetch("http://localhost:3000/favoritos", {
      headers: { "Authorization": "Bearer " + token }
    });

    const favoritosIds = await respFav.json();

    // Si no hay favoritos
    if (favoritosIds.length === 0) {
      contenedor.innerHTML = `<p style="text-align:center;">Todavía no agregaste favoritos ❤️</p>`;
      return;
    }

    // Traer lámparas
    const respLamparas = await fetch("http://localhost:3000/api/lamparas");
    const lamparas = await respLamparas.json();

    // Filtrar las que están en favoritos
    const favoritos = lamparas.filter(l => favoritosIds.includes(l.id));

    // Mostrar cards
    favoritos.forEach(l => {
      const card = document.createElement("article");
      card.classList.add("location-listing");

      card.innerHTML = `
        <div class="location-image" style="position: relative;">
          <img src="${l.ruta_imagen}" alt="${l.nombre}">

          <button class="favorito-remove" data-id="${l.id}" style="
            position:absolute;
            top:10px;
            right:10px;
            background:rgba(255,255,255,0.8);
            border:none;
            cursor:pointer;
            width:40px;
            height:40px;
            border-radius:50%;
            font-size:20px;
          ">
            <i class="fa-solid fa-heart"></i>
          </button>
        </div>

        <a class="location-title" href="#">${l.nombre}</a>
      `;

      contenedor.appendChild(card);

      setTimeout(() => card.classList.add("visible"), 50);
    });

    // Evento para eliminar
    contenedor.addEventListener("click", async (e) => {
      const btn = e.target.closest(".favorito-remove");
      if (!btn) return;

      const lamparaId = btn.dataset.id;

      if (!confirm("¿Eliminar de favoritos?")) return;

      const res = await fetch(`http://localhost:3000/favoritos/${lamparaId}`, {
        method: "DELETE",
        headers: {
          "Authorization": "Bearer " + token
        }
      });

      const data = await res.json();

      if (data.eliminado) {
        btn.closest(".location-listing").remove();
      }
    });

  } catch (err) {
    console.error("❌ Error en favoritos:", err);
  }
});

