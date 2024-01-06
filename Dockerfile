FROM archlinux:latest

RUN pacman -Syu nodejs --noconfirm
RUN pacman -Syu npm --noconfirm

COPY . /root/pappu

WORKDIR /root/pappu

RUN npm install

ENTRYPOINT ["node", "."]
