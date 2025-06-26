# Usamos una imagen oficial de Node.js
FROM node:18-alpine

# Establecemos el directorio de trabajo
WORKDIR /app

# Copiamos package.json y package-lock.json (si existe)
COPY package*.json ./

# Instalamos las dependencias
RUN npm install --production

# Copiamos todo el código de la app
COPY . .

# Exponemos el puerto que usas (5000)
EXPOSE 5000

# Comando para iniciar la app
CMD ["npm", "start"]
