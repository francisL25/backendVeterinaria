# Usa una imagen liviana de Node.js
FROM node:18-slim

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de dependencias y los instala
COPY package*.json ./
RUN npm install --omit=dev

# Copia el resto del código fuente
COPY . .

# Expone el puerto definido en tu .env (5000 por defecto)
EXPOSE 5000

# Comando para iniciar el backend
CMD ["npm", "start"]
