# ---------- Stage 1: Build ----------
FROM node:18-alpine AS build

WORKDIR /app

# 🔑 FIX for ERR_OSSL_EVP_UNSUPPORTED
ENV NODE_OPTIONS=--openssl-legacy-provider

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build


# ---------- Stage 2: Nginx ----------
FROM nginx:alpine

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist/Requirement /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
