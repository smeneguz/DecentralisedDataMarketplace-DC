# Usa un'immagine di Node.js come base
FROM node:18

# Crea una directory di lavoro all'interno del container
WORKDIR /app

# Copia il package.json e il package-lock.json nella directory di lavoro
COPY package*.json ./

# Installa le dipendenze
RUN npm install

# Copia il codice sorgente nell'immagine
COPY . .

# Esponi la porta su cui il server NestJS ascolta (la porta predefinita di NestJS è 3000)
EXPOSE 3000

# Comando per avviare l'applicazione
CMD ["npm", "start"]