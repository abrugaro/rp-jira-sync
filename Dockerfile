FROM node:20
WORKDIR /usr/src/app

ENV REPORT_PORTAL_TOKEN=""
ENV REPORT_PORTAL_API_URL=""
ENV REPORT_PORTAL_PROJECT=""
ENV JIRA_ACCESS_TOKEN=""
ENV JIRA_API_URL=""
ENV JIRA_PROJECT=""

COPY . .
COPY env.example.ts env.ts
RUN npm install
RUN npm run build
EXPOSE 3000
CMD [ "node", "dist/bundle.js" ]