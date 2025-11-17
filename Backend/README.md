# Backend de sugerencias IA

1. Instalar dependencias:

   npm install

2. Crear un archivo `.env` en esta carpeta con:

   OPENAI_API_KEY=tu_api_key_aqui

3. Iniciar el servidor:

   npm start

El servidor expondrá `POST /api/suggest` que acepta JSON { design: { base, shade, bulb, price } } y devolverá { suggestion }.

Nota: este es un ejemplo mínimo. No expongas claves en repositorios públicos.
