// Safe console polyfill
(function(){
  try {
    if (!window.console) window.console = {};
    const methods = ['log','debug','info','warn','error','assert','clear','count','dir','dirxml','exception','group','groupCollapsed','groupEnd','profile','profileEnd','time','timeEnd','trace'];
    methods.forEach(m => { if(!window.console[m]) window.console[m] = function(){}; });
  } catch(e){}
})();

// --- VARIABLES GLOBALES ---
const baseImg = document.getElementById("lamp-base");
const shadeImg = document.getElementById("lamp-shade");
const bulbImg = document.getElementById("lamp-bulb");
const optionButtons = document.querySelectorAll(".option-btn");
const addToCartBtn = document.getElementById("add-to-cart-btn");
const receiptEl = document.getElementById("receipt");
const askAiBtn = document.getElementById('ask-ai');
const clearAiBtn = document.getElementById('clear-ai');
const suggestionsOutput = document.getElementById('suggestions-output');

const chatInput = document.getElementById("chat-input");
const chatSend = document.getElementById("chat-send");
const chatWindow = document.getElementById("chat-window");

// Ruta base para las imágenes grandes (fallbacks a archivos reales en /foto)
const imagePaths = {
  base: {
    "base-modern": "foto/Basemoderna.png",
    "base-classic": "foto/lamparaclasica.png",
    "base-wood": "foto/basedemadera.jpeg",
  },
  shade: {
    "shade-cone": "foto/pantallaconica.jpg",
    "shade-drum": "foto/pantalla tambor.webp",
    "shade-fabric": "foto/pantalla tela.jpg",
  },
  bulb: {
    "bulb-led": "foto/bombillaled.webp",
    "bulb-incandescent": "foto/bombillaincandescente.png",
  },
};

// --- ESTADO DEL DISEÑO ---
let currentDesign = {
  base: null,
  shade: null,
  bulb: null,
  totalPrice: 0,
};

// --- FUNCIONES AUXILIARES ---
function getThumbSrc(btn, part, value){
  const thumb = btn.querySelector('img');
  if(thumb && thumb.src) return encodeURI(thumb.src);
  return imagePaths[part]?.[value] || '';
}

function updateTotalPrice(){
  let total = 0;
  ["base","shade","bulb"].forEach(part=>{
    if(currentDesign[part]) total += currentDesign[part].price;
  });
  currentDesign.totalPrice = total;

  let priceDisplay = document.getElementById("price-display");
  if(!priceDisplay){
    priceDisplay = document.createElement("div");
    priceDisplay.id = "price-display";
    document.querySelector(".lamp-preview").appendChild(priceDisplay);
  }
  priceDisplay.textContent = `Precio total: $${total.toFixed(2)}`;
}

function localSuggestion(design){
  const parts = [];
  if(design.base) parts.push(`base: ${design.base}`);
  if(design.shade) parts.push(`pantalla: ${design.shade}`);
  if(design.bulb) parts.push(`bombilla: ${design.bulb}`);
  const lines = [];
  lines.push(`Sugerencias para tu lámpara (${parts.join(', ')}):`);
  if(design.shade && design.shade.includes('fabric')){
    lines.push('- Usa una bombilla LED cálida para realzar las texturas de la pantalla de tela.');
  } else {
    lines.push('- Considera una pantalla de tela si buscas luz difusa y ambiental.');
  }
  if(design.base && design.base.includes('wood')){
    lines.push('- La base de madera queda bien con tonos cálidos; prueba una pantalla clara.');
  }
  lines.push(`- Precio estimado: $${(design.price || 0).toFixed(2)}.`);
  return lines.join('\n');
}

// --- MANEJADOR DE SELECCIÓN ---
optionButtons.forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const part = btn.dataset.part;
    const value = btn.dataset.value;
    const price = parseFloat(btn.dataset.price || '0');

    document.querySelectorAll(`.option-btn[data-part="${part}"]`).forEach(b=>b.classList.remove('selected'));
    btn.classList.add('selected');

    const imgEl = part==='base'?baseImg:part==='shade'?shadeImg:bulbImg;
    // Prefer a known mapping in imagePaths (avoid thumbnail path issues with spaces)
    const mapped = imagePaths[part] && imagePaths[part][value] ? imagePaths[part][value] : '';
    if (mapped) {
      imgEl.src = mapped;
    } else {
      imgEl.src = getThumbSrc(btn, part, value);
    }
    imgEl.onload = ()=>imgEl.style.display='block';
    imgEl.onerror = ()=>{imgEl.src=''; imgEl.style.display='none';};

    currentDesign[part] = {value, price};
    updateTotalPrice();
  });
});

// --- AÑADIR AL CARRITO ---
addToCartBtn?.addEventListener('click', ()=>{
  if(!currentDesign.base || !currentDesign.shade || !currentDesign.bulb){
    alert("Por favor selecciona todas las partes antes de añadir al carrito.");
    return;
  }
  renderReceipt(currentDesign);
});

// --- RENDER DE RECEIPT ---
function renderReceipt(design){
  if(!receiptEl) return;
  const date = new Date().toLocaleString();
  const getSelectedThumb = (part)=>{
    const sel = document.querySelector(`.option-btn[data-part="${part}"].selected`);
    if(sel){ const img = sel.querySelector('img'); if(img && img.src) return img.src; }
    const val = currentDesign[part]?.value;
    if(val){ const btn = document.querySelector(`.option-btn[data-part="${part}"][data-value="${val}"]`);
      if(btn){ const img = btn.querySelector('img'); if(img && img.src) return img.src; } }
    return '';
  };
  const baseSrc = baseImg.src.trim() || getSelectedThumb('base');
  const shadeSrc = shadeImg.src.trim() || getSelectedThumb('shade');
  const bulbSrc = bulbImg.src.trim() || getSelectedThumb('bulb');

  const html = `
    <div class="receipt-card">
      <h3>Comprobante de armado</h3>
      <div class="receipt-row"><strong>Fecha:</strong> ${date}</div>
      <div class="receipt-thumbs">
        ${baseSrc?`<div class="thumb"><img src="${baseSrc}" alt="Base"></div>`:''}
        ${shadeSrc?`<div class="thumb"><img src="${shadeSrc}" alt="Pantalla"></div>`:''}
        ${bulbSrc?`<div class="thumb"><img src="${bulbSrc}" alt="Bombilla"></div>`:''}
      </div>
      <div class="receipt-row"><strong>Base:</strong> ${design.base.value} - $${design.base.price.toFixed(2)}</div>
      <div class="receipt-row"><strong>Pantalla:</strong> ${design.shade.value} - $${design.shade.price.toFixed(2)}</div>
      <div class="receipt-row"><strong>Bombilla:</strong> ${design.bulb.value} - $${design.bulb.price.toFixed(2)}</div>
      <div class="receipt-row"><strong>Total:</strong> $${design.totalPrice.toFixed(2)}</div>
      <div class="receipt-actions"><button id="print-receipt" type="button" onclick="window.print()">Imprimir</button></div>
    </div>
  `;

  let modal = document.getElementById('receipt-modal');
  if(!modal){ modal = document.createElement('div'); modal.id='receipt-modal'; modal.setAttribute('role','dialog'); modal.setAttribute('aria-modal','true'); document.body.appendChild(modal); }
  modal.innerHTML = `<div class="receipt-backdrop" id="receipt-backdrop"></div><div class="receipt" id="receipt-content">${html}</div>`;
  modal.style.cssText = 'position:fixed;left:0;top:0;width:100%;height:100%;z-index:9999;pointer-events:auto;';
  receiptEl.hidden = true;

  document.getElementById('receipt-backdrop').addEventListener('click', ()=>{ modal.remove(); });
}

// --- RESET DISEÑO ---
function resetDesign(){
  optionButtons.forEach(b=>b.classList.remove('selected'));
  if(baseImg) baseImg.src=''; if(shadeImg) shadeImg.src=''; if(bulbImg) bulbImg.src='';
  currentDesign = {base:null,shade:null,bulb:null,totalPrice:0};
  updateTotalPrice();
  if(receiptEl){ receiptEl.innerHTML=''; receiptEl.hidden=true; }
}

// --- SUGERENCIAS AI ---
async function askAiSuggestion(){
  if(!askAiBtn) return;
  const payload = { design: { base: currentDesign.base?.value||null, shade: currentDesign.shade?.value||null, bulb: currentDesign.bulb?.value||null, price: currentDesign.totalPrice||0 } };
  try {
    askAiBtn.disabled = true; askAiBtn.textContent='Cargando...'; suggestionsOutput.textContent='Solicitando sugerencia...';
    let res;
    try {
      res = await fetch('/api/suggest',{ method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload) });
      if(!res.ok) throw new Error('relative endpoint failed');
    } catch(e){
      try { res = await fetch('http://localhost:3001/api/suggest',{ method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload) }); } catch(e2){ suggestionsOutput.textContent=localSuggestion(payload.design); return; }
    }
    const data = await res.json();
    suggestionsOutput.textContent = data.suggestion || localSuggestion(payload.design);
  } catch(err){
    suggestionsOutput.textContent = 'Error: '+(err.message||err);
  } finally {
    askAiBtn.disabled=false; askAiBtn.textContent='Pedir sugerencia';
  }
}

askAiBtn?.addEventListener('click', askAiSuggestion);
clearAiBtn?.addEventListener('click', ()=>{ suggestionsOutput.textContent=''; });

// --- CHAT CON BACKEND ---
function addMessage(content, sender){
  const msg = document.createElement('p');
  msg.classList.add(sender==='user'?'user-msg':'ai-msg');
  msg.textContent = content;
  chatWindow.appendChild(msg);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

async function sendMessage(){
  const userText = chatInput.value.trim();
  if(!userText) return;
  addMessage(userText,'user'); chatInput.value='';
  const loadingMsg = document.createElement('p'); loadingMsg.classList.add('ai-msg'); loadingMsg.textContent='Escribiendo...'; chatWindow.appendChild(loadingMsg);

  try {
    const res = await fetch('http://localhost:3000/api/chat',{ method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({message:userText}) });
    const data = await res.json();
    loadingMsg.remove();
    addMessage(data.reply,'ai');
  } catch(err){
    loadingMsg.remove();
    addMessage('Error de conexión con el servidor.','ai');
  }
}

chatSend?.addEventListener('click', sendMessage);
chatInput?.addEventListener('keydown', (e)=>{ if(e.key==='Enter') sendMessage(); });

// --- INIT VISUAL CATALOG ---
(function(){ document.body.classList.add('catalog-look'); document.querySelectorAll('.catalog-card').forEach((c,i)=>setTimeout(()=>c.classList.add('visible'),i*80)); })();

// Export para onclick globales
window.askAiSuggestion = askAiSuggestion;
window.resetDesign = resetDesign;


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
