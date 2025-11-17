

// Función para hacer cualquier elemento arrastrable
function hacerElementoArrastrable(elemento){
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    // al hacer click en el elemento (inicio del arrastre)
    elemento.onmousedown = dragMouseDown;

    function dragMouseDown(e){
        e = e || window.event;
        e.preventDefault();
        
        // obtener la posición inicial del ratón
        pos3 = e.clientX;
        pos4 = e.clientY;
        
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        
        // calcular la nueva posición del cursor
        pos1 = pos3 - e.clientX; 
        pos2 = pos4 - e.clientY; 
        pos3 = e.clientX;
        pos4 = e.clientY;
        
        // Establecer la nueva posición del elemento
        elemento.style.top = (elemento.offsetTop - pos2) + "px";
        elemento.style.left = (elemento.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        
        document.onmouseup = null;
        document.onmousemove = null;
    }
}


// variables del dom 


const video = document.getElementById('liveCameraFeed');
const canvas = document.getElementById('photoCanvas');
const simuladorArea = document.getElementById('simuladorArea');

const activateButton = document.getElementById('activateCameraButton');
const stopButton = document.getElementById('stopCameraButton');
const takePhotoButton = document.getElementById('takePhotoBtn');
const clearPhotoButton = document.getElementById('clearPhotoBtn');
const saveLampButton = document.getElementById('saveLamp-Btn');

errorMessage.textContent = ''; // Limpia el mensaje de error al iniciar

const lamparaSelectionDiv = document.getElementById('lamparaSeleccion');


const lampButtons = document.querySelectorAll('.lampara-card'); 

let mediaStream = null // Variable global para detener la camara

// Variables para el escalado de la lámpara
const scaleControls = document.getElementById('scale-controls'); 
const zoomInBtn = document.getElementById('zoomInBtn');
const zoomOutBtn = document.getElementById('zoomOutBtn');

let currentScale = 1.0; // Escala inicial 
const scaleStep = 0.1; // Cuánto se agranda/achica en cada paso





// Logica de activacion de camara 
activateButton.addEventListener('click', async () => {
    try {
        errorMessage.textContent = '';

        mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });

        // asignar el stream al elemento <video>
        video.srcObject = mediaStream;
        video.style.display = 'block';

        // ocultar botones y mostrar controles de foto
        activateButton.style.display = 'none';
        stopButton.style.display = 'inline-block';
        takePhotoButton.style.display = 'inline-block';

    } catch (err) {
        console.error('Error al acceder a la camara', err);
        errorMessage.textContent = 'No se puede acceder a la camara. Revisa los permisos.';
    }
});

// logica de detener camara
stopButton.addEventListener('click', () => {
    if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
    }
    video.style.display = 'none';

    // resetear los botones
    activateButton.style.display = 'inline-block';
    stopButton.style.display = 'none';
    takePhotoButton.style.display = 'none';
});

// logica de tomar foto y reemplazar el video
takePhotoButton.addEventListener('click', () => {
    // configurar el canvas para el tamaño exacto del video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // dibujar el frame actual del video en el canvas
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // detener el video y obtener la imagen base64
    mediaStream.getTracks().forEach(track => track.stop());
    const photoURL = canvas.toDataURL('image/png');

    // crear la imagen permanente y reemplazar el video
    video.style.display = 'none' // oculta el video

    // crear el elemento de imagen capturada
    const capturedImage = document.createElement('img');
    capturedImage.id = 'capturedPhoto';
    capturedImage.src = photoURL;
    capturedImage.style.cssText = 'width: 100%; height: 100%; object-fit:cover;'; // estilos de fondo

    // limpiar el area de añadir la foto (por si hay una lampara)
    simuladorArea.innerHTML = '';
    simuladorArea.appendChild(capturedImage);

    // mostrar los botones de simulacion
    takePhotoButton.style.display = 'none';
    stopButton.style.display = 'none';
    clearPhotoButton.style.display = 'inline-block';
    saveLampButton.style.display = 'inline-block';
    lamparaSelectionDiv.style.display = 'block'; 
});

// logica para borrar foto
clearPhotoButton.addEventListener('click', () => {
    // Restaurar el contenido original
    simuladorArea.innerHTML = `<video id="liveCameraFeed" autoplay playsinline></video>
                              <canvas id="photoCanvas" style="display: none;"></canvas>`;
    
  
 //limpiar mensaje de la lampara
    errorMessage.textContent = '';

    
    // Restablecer los botones
    clearPhotoButton.style.display = 'none';
    saveLampButton.style.display = 'none';
    scaleControls.style.display = 'none'; 
    lamparaSelectionDiv.style.display = 'none';
    activateButton.style.display = 'inline-block';
});


// logica de seleccion de lamparas



lampButtons.forEach(card => {
    card.addEventListener('click', (e) => {
        
        const nuevaLamparaSrc = e.currentTarget.getAttribute('data-lampara-src');
        
        let lampara = document.getElementById('lampara-draggable');
        
        if (lampara) {
            lampara.src = nuevaLamparaSrc;
        } else {
            lampara = document.createElement('img');
            lampara.src = nuevaLamparaSrc; 
            lampara.className = 'lampara-superpuesta'; 
            lampara.id = 'lampara-draggable'; 
            lampara.alt = 'Lámpara de prueba';

            // inicializar la escala y posicion
            currentScale = 1.0;
            lampara.style.transform = `scale(${currentScale})`; 
            lampara.style.top = '100px';
            lampara.style.left = '250px';
            
            // Insertams  la lámpara y activamos el arrastre
            simuladorArea.appendChild(lampara);
            hacerElementoArrastrable(lampara);
        }

        errorMessage.textContent = '¡Lámpara lista! Arrástrala para colocarla.';
       
        scaleControls.style.display = 'block'; 
    });
});


// logica de escalado de lamparas


if (zoomInBtn && zoomOutBtn) { 
    zoomInBtn.addEventListener('click', () => {
        const lampara = document.getElementById('lampara-draggable');
        if (lampara) {
            currentScale += scaleStep;
            lampara.style.transform = `scale(${currentScale})`;
        }
    });

    zoomOutBtn.addEventListener('click', () => {
        const lampara = document.getElementById('lampara-draggable');
        // Aseguramos que no se achique demasiado con una condicional
        if (lampara && currentScale > 0.3) { 
            currentScale -= scaleStep;
            lampara.style.transform = `scale(${currentScale})`;
        }
    });
}