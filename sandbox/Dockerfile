FROM ubuntu:20.04
RUN apt-get update && apt-get install --no-install-recommends -y curl software-properties-common
RUN add-apt-repository -y ppa:longsleep/golang-backports
RUN apt-get update
RUN apt-get install --no-install-recommends-y golang-go
RUN curl -sL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
RUN apt-get update
RUN apt-get install --no-install-recommends -y nodejs
RUN npm install --no-install-recommends -g npm@latest
RUN apt-get install --no-install-recommends -y python3 python3-pip
RUN useradd -u 8877 newuser
USER newuser
CMD /bin/bash
