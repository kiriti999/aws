FROM node:16

# Create app directory
WORKDIR /usr/src/app


RUN apk update
RUN echo "http://dl-cdn.alpinelinux.org/alpine/edge/testing" >>/etc/apk/repositories
RUN apk add bash liquibase curl wget
RUN curl -L https://git.io/n-install | bash -s -- -y

RUN touch ~/.bashrc
RUN wget -P /liquibase/lib/ https://jdbc.postgresql.org/download/postgresql-42.3.3.jar
ENV PATH="$PATH:/liquibase/lib/"

# Bundle app source
COPY . .

CMD ["/bin/bash"]
