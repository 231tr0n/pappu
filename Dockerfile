FROM archlinux:latest

RUN pacman -Syu nodejs npm gcc --noconfirm --needed

COPY . /root/pappu

WORKDIR /root/pappu

RUN npm install

ENTRYPOINT ["node", "."]
