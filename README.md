## EnergyApp

This is the code base for backend server for the project EnergyApp

**More informations about EnergyApp is given [here][EnergyAppManuals.md]**

### **Required applications**

*   **[Docker](https://www.docker.com/products/docker-desktop)** is a set of platform as a service product that uses OS-level virtualization to deliver software in packages called containers. Containers are isolated from one another and bundle their own software, libraries and configuration files; they can communicate with each other through well-defined channels.
*   **[Node.js](https://nodejs.org/en/)** is a platform built on Chrome’s JavaScript runtime for easily building fast and scalable network applications. Node.js is an open-source, cross-platform runtime environment for developing server-side and networking applications.


### **Run the MySQL server**

1.  Install Docker (Learn more about docker installation [here](https://docs.docker.com/install/))
2.  Enter on the project root directory 
3.  Run the docker `docker-compose up -d`

*   Access phpmyadmin

your\_ip:8183
Server: mysql
Username: root/root
Password: root/pass

*   Access mysql on terminal(if needed)

 docker exec -it mysql_server mysql -u root -p

Running Nodejs server
1. Install Nodejs (Download installer from [here](https://nodejs.org/en/download/))

2. RUN : `npm install`

3. Now let’s run the app by running the following command : `node server.js`.

Tips:

After testing you can stop docker by `docker stop mysql_server phpmyadmin`
Confirm no container is running by `docker ps -a`