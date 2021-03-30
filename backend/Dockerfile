FROM node:14

WORKDIR /app
COPY package.json package-lock.json ./

RUN npm ci --ignore-scripts
COPY . ./

CMD ["npm", "run", "dev"]
