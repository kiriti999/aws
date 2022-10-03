FROM ubuntu:latest
LABEL maintainer="Kiriti Komaragiri"
RUN rm /bin/sh && ln -s /bin/bash /bin/sh
RUN echo 'debconf debconf/frontend select Noninteractive' | debconf-set-selections
RUN apt-get install -y -q && \
apt-get update && \
apt-get install wget curl -y && \
apt install apt-transport-https ca-certificates software-properties-common -y && \
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -
RUN add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu bionic stable"

RUN apt-get update && \
apt-cache policy docker-ce && \
apt install docker-ce -y && \
apt install docker-compose -y && \
apt install default-jre -y && \
apt install awscli -y && \
apt install python3-pip -y --fix-missing && \
pip install --upgrade awscli && \
pip install aws-sam-cli

#RUN gem install compass
RUN wget -P /opt https://github.com/liquibase/liquibase/releases/download/v3.8.1/liquibase-3.8.1.tar.gz
RUN cd /opt && tar -xvzf liquibase-3.8.1.tar.gz
ENV PATH=$PATH:/opt/
RUN wget -P /liquibase/lib/ https://jdbc.postgresql.org/download/postgresql-42.3.3.jar
ENV PATH="$PATH:/liquibase/lib/"

ENV NVM_DIR /usr/local/.nvm
# ENV NODE_VERSION stable

# Install nvm
RUN git clone https://github.com/creationix/nvm.git $NVM_DIR && \
cd $NVM_DIR && \
git checkout $(git describe --abbrev=0 --tags)

# Add nvm.sh to .bashrc for startup...
RUN echo "source ${NVM_DIR}/nvm.sh" >$HOME/.bashrc && \
source $HOME/.bashrc

# Set the path.
# ENV NODE_PATH $NVM_DIR/v$NODE_VERSION/lib/node_modules
# ENV PATH $NVM_DIR/v$NODE_VERSION/bin:$PATH
ENV PATH="$PATH:/liquibase/lib/"

CMD ["/bin/bash"]
