FROM alpine:latest

LABEL maintainer="Kiriti Komaragiri"

WORKDIR /usr/src/app

RUN apk update
RUN echo "http://dl-cdn.alpinelinux.org/alpine/edge/testing" >>/etc/apk/repositories
RUN apk add bash liquibase curl wget git make
RUN curl -L https://git.io/n-install | bash -s -- -y

RUN touch ~/.bashrc
RUN wget -P /liquibase/lib/ https://jdbc.postgresql.org/download/postgresql-42.3.3.jar
ENV PATH="$PATH:/liquibase/lib/"

CMD ["/bin/bash"]
