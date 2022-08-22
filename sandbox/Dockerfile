FROM ubuntu:latest
RUN apt-get update && apt-get upgrade -y && apt-get install -y sudo curl software-properties-common
RUN sudo add-apt-repository -y ppa:longsleep/golang-backports
RUN sudo apt-get update
RUN sudo apt-get install -y golang-go
RUN curl -sL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
RUN sudo apt-get update
RUN sudo apt-get install -y nodejs
RUN sudo npm install -g npm@latest
RUN sudo apt-get install -y python3 python3-pip
RUN useradd -m -s /bin/bash -G sudo -p $(echo "password" | openssl passwd -1 -stdin) user
RUN echo "user ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers
USER newuser
WORKDIR /home/newuser
