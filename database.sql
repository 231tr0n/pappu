CREATE USER IF NOT EXISTS 'pappu'@'localhost' IDENTIFIED BY '********';
ALTER USER 'pappu'@'localhost' IDENTIFIED BY '*******';
CREATE DATABASE IF NOT EXISTS pappu;
GRANT ALL PRIVILEGES ON pappu.* TO 'pappu'@'localhost';
flush privileges;
