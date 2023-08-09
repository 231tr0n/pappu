FROM archlinux:latest

RUN pacman -Syu nodejs --noconfirm
RUN pacman -Syu npm --noconfirm
RUN pacman -Syu mariadb --noconfirm
RUN pacman -Syu mariadb-clients --noconfirm

COPY . /root/pappu

WORKDIR /root/pappu

RUN npm install

CMD ["node", "."]
