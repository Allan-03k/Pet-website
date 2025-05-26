# Use node image to build frontend
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Use nginx to serve static files
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

#Enable custom nginx config to support React routing
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
