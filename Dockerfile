# Dockerfile para el backend
FROM node:18-alpine

# Crear directorio de trabajo
WORKDIR /app/backend

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el código fuente
COPY . .

# Exponer el puerto
EXPOSE 5000

# Comando para ejecutar la aplicación
CMD ["npm", "start"]