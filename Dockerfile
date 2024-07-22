# # Use the official Node.js image as the base image
# FROM node:20
#
# # Set the working directory
# WORKDIR /home/server/
#
# # Copy package.json and package-lock.json to the working directory
# COPY package*.json ./
#
# # Install dependencies
# RUN npm install
#
# # Copy the rest of the application code
# COPY . .
#
# RUN npx prisma generate
#
# # Build the NestJS application
# RUN npm run build
#
# # Expose the port the app runs on
# EXPOSE 3090
#
# CMD ["npm", "run", "start:prod"]


FROM node:alpine

WORKDIR /usr/src/app

COPY . .

RUN npm install

RUN npm run build

EXPOSE 3090

CMD [ "node", "dist/main.js" ]
