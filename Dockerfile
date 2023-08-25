### Node ###
FROM node:16.13 AS frontend
WORKDIR /usr/src/app
COPY . /usr/src/app
RUN npm install
RUN npm run build
# delete everything except dist folder
# RUN rm -rf !("dist")
# move dist, delete everything, then copy it back in
# RUN mv dist ../dist
# RUN rm -rf ./*
# RUN mv ../dist dist

### Nginx ###
FROM nginx:alpine
# Remove the default Nginx configuration
RUN rm -rf /etc/nginx/conf.d/*
# Copy the custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/
# Copy dist from build
COPY --from=frontend /usr/src/app/dist /usr/share/nginx/html
# Expose port 80
EXPOSE 80
# Start Nginx when the container starts
CMD ["nginx", "-g", "daemon off;"]