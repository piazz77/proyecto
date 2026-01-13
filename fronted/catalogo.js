// document.addEventListener("DOMContentLoaded", async () => {
//   const contenedor = document.getElementById("catalogo");

//   // Limpia los artículos fijos
//   contenedor.innerHTML = "";

//   try {
//     console.log("🔍 Cargando lámparas desde el backend...");

//     const respuesta = await fetch("http://localhost:3000/api/lamparas");
//     const lamparas = await respuesta.json();

//     console.log("🔦 LÁMPARAS DESDE EL BACK:", lamparas);

//     if (!Array.isArray(lamparas)) {
//       console.error("❌ La API no devolvió un array.");
//       return;
//     }

//     lamparas.forEach((l) => {
//       const card = document.createElement("article");
//       card.classList.add("location-listing");

//       card.innerHTML = `
//         <a class="location-title" href="#">${l.nombre}</a>
//         <div class="location-image">
//             <img src="${l.ruta_imagen}" alt="${l.nombre}">
//         </div>
//       `;

//       contenedor.appendChild(card);
//       setTimeout(() => {
//         card.classList.add("visible");
//       }, 50);

//     });

//   } catch (error) {
//     console.error("❌ Error cargando lámparas:", error);
//   }
// });

// document.addEventListener("DOMContentLoaded", async () => {
//   const contenedor = document.getElementById("catalogo");

//   // Limpia los artículos fijos
//   contenedor.innerHTML = "";

//   try {
//     console.log("🔍 Cargando lámparas desde el backend...");

//     // Traer lámparas
//     const respuesta = await fetch("http://localhost:3000/api/lamparas");
//     const lamparas = await respuesta.json();
//     console.log("🔦 LÁMPARAS DESDE EL BACK:", lamparas);

//     // Traer favoritos del usuario
//     const favRes = await fetch("http://localhost:3000/favoritos", {
//       method: "GET",
//       credentials: "include"
//     });
//     const favoritos = await favRes.json();

//     lamparas.forEach((l) => {
//       const esFavorito = favoritos.includes(l.id);
//       const card = document.createElement("article");
//       card.classList.add("location-listing");

//       card.innerHTML = `
//         <div class="location-image" style="position: relative;">
//           <img src="${l.ruta_imagen}" alt="${l.nombre}">
//           <span class="favorito-icon" data-id="${l.id}" style="
//             position: absolute;
//             top: 10px;
//             right: 10px;
//             font-size: 24px;
//             cursor: pointer;
//             z-index: 10;
//              background: rgba(255,255,255,0.7);
//             border-radius: 50%;
//             width: 40px;
//             height: 40px;
//             display: flex;
//             align-items: center;
//             justify-content: center;
//           ">${esFavorito ? '❤️' : '🤍'}</span>
//         </div>
//         <a class="location-title" href="#">${l.nombre}</a>
//       `;

//       contenedor.appendChild(card);
//       setTimeout(() => {
//         card.classList.add("visible");
//       }, 50);
//     });

//     // Agregar listener a los corazones
//     contenedor.addEventListener("click", async (e) => {
//       if (e.target.classList.contains("favorito-icon")) {
//         const lamparaId = parseInt(e.target.dataset.id);

//         try {
//           const res = await fetch("http://localhost:3000/favoritos", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             credentials: "include",
//             body: JSON.stringify({ lampara_id: lamparaId })
//           });

//           const data = await res.json();
//           // Actualizar icono
//           e.target.textContent = data.agregado ? "❤️" : "🤍";

//         } catch (err) {
//           console.error("❌ Error al toggle favorito:", err);
//         }
//       }
//     });

//   } catch (error) {
//     console.error("❌ Error cargando lámparas:", error);
//   }
// });



// document.addEventListener("DOMContentLoaded", async () => {
//   const contenedor = document.getElementById("catalogo");

//   // LIMPIAR CONTENIDO
//   contenedor.innerHTML = "";

//   // 🔐 OBTENER TOKEN DEL LOGIN
//   const token = localStorage.getItem("token");

//   if (!token) {
//     console.warn("⚠ No hay token. El usuario no está logueado.");
//   }

//   try {
//     console.log("🔍 Cargando lámparas desde el backend...");

//     // 📌 TRAER LÁMPARAS
//     const respuesta = await fetch("http://localhost:3000/api/lamparas");
//     const lamparas = await respuesta.json();
//     console.log("🔦 LÁMPARAS DESDE EL BACK:", lamparas);

//     // 📌 TRAER FAVORITOS DEL USUARIO
//     let favoritos = [];
//     if (token) {
//       const favRes = await fetch("http://localhost:3000/favoritos", {
//         method: "GET",
//         headers: {
//           Authorization: "Bearer " + token,
//         },
//       });

//       if (favRes.ok) {
//         favoritos = await favRes.json();
//       } else {
//         console.warn("⚠ No se pudieron obtener favoritos");
//       }
//     }

//     // 📌 MOSTRAR TARJETAS
//     lamparas.forEach((l) => {
//       const esFavorito = favoritos.includes(l.id);

//       const card = document.createElement("article");
//       card.classList.add("location-listing");

//       card.innerHTML = `
//         <div class="location-image" style="position: relative;">
//           <img src="${l.ruta_imagen}" alt="${l.nombre}">
          
//          <span class="favorito-icon" data-id="${l.id}" style="
//           position:absolute;
//           top:10px;
//           right:10px;
//           background:rgba(255,255,255,0.8);
//            border-radius:50%;
//            width:40px;
//            height:40px;
//            display:flex;
//           align-items:center;
//           justify-content:center;
//           cursor:pointer;
//           font-size:20px;
//            ">
//            <i class="${esFavorito ? "fa-solid fa-heart" : "fa-regular fa-heart"}"></i>
//          </span>

//         </div>

//         <a class="location-title" href="#">${l.nombre}</a>
//       `;

//       contenedor.appendChild(card);

//       setTimeout(() => {
//         card.classList.add("visible");
//       }, 50);
//     });

//     // ❤️ MANEJAR CLICK EN CORAZONES
//     contenedor.addEventListener("click", async (e) => {
//       if (!e.target.classList.contains("favorito-icon")) return;

//       if (!token) {
//         alert("Debes iniciar sesión para guardar favoritos.");
//         return;
//       }

//       const lamparaId = parseInt(e.target.dataset.id);

//       try {
//         const res = await fetch("http://localhost:3000/favoritos", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: "Bearer " + token,
//           },
//           body: JSON.stringify({ lampara_id: lamparaId }),
//         });

//         const data = await res.json();

//         // Actualiza el ícono
//         const icon = e.target.querySelector("i") || e.target;
//         icon.className = data.agregado
//        ? "fa-solid fa-heart"
//        : "fa-regular fa-heart";

//       } catch (err) {
//         console.error("❌ Error al toggle favorito:", err);
//       }
//     });
//   } catch (error) {
//     console.error("❌ Error cargando lámparas:", error);
//   }
// });







document.addEventListener("DOMContentLoaded", async () => {

  const contenedor = document.getElementById("catalogo");
  contenedor.innerHTML = "";

  // 🔐 Token del login
  const token = localStorage.getItem("token");

  try {
    console.log("🔍 Cargando lámparas…");

    // ✔ Obtener lámparas
    const respLamparas = await fetch("http://localhost:3000/api/lamparas");
    const lamparas = await respLamparas.json();

    // ✔ Obtener favoritos del usuario
    let favoritos = [];
    if (token) {
      const respFav = await fetch("http://localhost:3000/favoritos", {
        method: "GET",
        headers: {
          "Authorization": "Bearer " + token
        }
      });

      if (respFav.ok) favoritos = await respFav.json();
    }

    // ✔ Mostrar cards
    lamparas.forEach(l => {
      const esFavorito = favoritos.includes(l.id);

      const card = document.createElement("article");
      card.classList.add("location-listing");

      card.innerHTML = `
        <div class="location-image" style="position: relative;">
          <img src="${l.ruta_imagen}" alt="${l.nombre}">

          <button class="favorito-btn" data-id="${l.id}" style="
              position:absolute;
              top:10px;
              right:10px;
              background:rgba(255,255,255,0.8);
              border:none;
              cursor:pointer;
              width:40px;
              height:40px;
              display:flex;
              align-items:center;
              justify-content:center;
              border-radius:50%;
              font-size:20px;
          ">
            <i class="${esFavorito ? "fa-solid fa-heart" : "fa-regular fa-heart"}"></i>
          </button>
        </div>

        <a class="location-title" href="#">${l.nombre}</a>
      `;

      contenedor.appendChild(card);

      setTimeout(() => card.classList.add("visible"), 50);
    });

    // ❤️ CLICK DEL CORAZÓN
    contenedor.addEventListener("click", async (e) => {

      const btn = e.target.closest(".favorito-btn");
      if (!btn) return;

      if (!token) {
        alert("Debes iniciar sesión para guardar favoritos.");
        return;
      }

      const lamparaId = btn.dataset.id;

      try {
        const res = await fetch("http://localhost:3000/favoritos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
          },
          body: JSON.stringify({ lampara_id:lamparaId })
        });

        const data = await res.json();

        const icon = btn.querySelector("i");
        icon.className = data.agregado ?
          "fa-solid fa-heart" :
          "fa-regular fa-heart";

      } catch (err) {
        console.error("❌ Error:", err);
      }
    });

  } catch (error) {
    console.error("❌ Error:", error);
  }


//logica y animaciones para el footer




gsap.from(".animated-footer", {
    opacity: 0,
    y: 50,
    duration: 1,
    ease: "power3.out",
    scrollTrigger: {
        trigger: ".animated-footer",
        start: "top 80%", 
        toggleActions: "play none none reverse",
         // Reproduce la animación una vez y la revierte al salir
         
    }
});

// Animación de los elementos individuales dentro del footer
gsap.timeline({
    scrollTrigger: {
        trigger: ".animated-footer",
        start: "top 80%",
        toggleActions: "play none none reverse",
        
    }
})
.from(".footer-logo", {
    opacity: 0,
    y: 20,
    duration: 0.8,
    ease: "power2.out"
}, "<")
.from(".footer-divider", {
    opacity: 0,
    scaleX: 0,
    duration: 0.8,
    ease: "power2.out"
}, "-=0.4") 
.from(".footer-heading-redes", {
    opacity: 0,
    x: -20,
    duration: 0.6,
    ease: "power2.out"
}, "-=0.3")
.from(".container-footerRedes .social-icon", {
    opacity: 0,
    y: 20,
    stagger: 0.15, 
    duration: 0.5,
    ease: "back.out(1.7)" 
}, "-=0.2")
.from(".footer-heading-contact", {
    opacity: 0,
    x: 20,
    duration: 0.6,
    ease: "power2.out"
}, "-=0.3");



document.querySelectorAll(".social-icon").forEach(icon => {
    icon.addEventListener("mouseenter", () => {
        gsap.to(icon, {
            y: -5,
            scale: 1.1,
            duration: 0.3,
            ease: "power2.out"
        });
    });

    icon.addEventListener("mouseleave", () => {
        gsap.to(icon, {
            y: 0,
            scale: 1,
            duration: 0.3,
            ease: "power2.out"
        });
    });
});
});
