ARG NODE_VERSION=18-alpine

FROM node:${NODE_VERSION}
LABEL name="easy-invoice"
LABEL license="MIT"
LABEL description="Easy Invoice app build with MERN stack"

ENV NODE_ENV=development

ARG APP_HOME=/app

WORKDIR ${APP_HOME}

RUN addgroup --system invoice \
  && adduser --system --ingroup invoice invoice

COPY package*.json ./

RUN npm install

COPY --chown=invoice:invoice . ${APP_HOME}

RUN chown invoice:invoice ${APP_HOME}

USER invoice

CMD [ "npm","run","dev" ]