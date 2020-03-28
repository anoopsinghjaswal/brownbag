FROM node:alpine
COPY . /apps/
WORKDIR apps/
RUN ls -ltr
RUN npm install
RUN npm run compile
CMD ["npm","start"]