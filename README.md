## Description


## Install Docker and Docker-compose in the AWS EC2

```bash
$ sudo apt update
$ sudo apt-get install apt-transport-https ca-certificates curl software-properties-common
$ curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
$ sudo apt-get install docker-ce
$ sudo systemctl status docker
$ sudo curl -L "https://github.com/docker/compose/releases/download/$(curl -s https://api.github.com/repos/docker/compose/releases/latest | grep tag_name | cut -d '"' -f 4)/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
$ sudo chmod +x /usr/local/bin/docker-compose
```

## Configuration

To set up your environment, create a `.env` file in the root directory of your project and define the following settings:

### Database Configuration

- `DATABASE_TYPE`: The type of your database (`mysql`).
- `DATABASE_HOST`: The host address of your database server.
- `DATABASE_PORT`: The port number on which your database is running.
- `DATABASE_USERNAME`: The username for connecting to your database.
- `DATABASE_PASSWORD`: The password for connecting to your database.
- `DATABASE_NAME`: The name of your database.

### AWS S3 Configuration

- `ACCESS_KEY_ID`: Your AWS access key ID for S3.
- `SECRET_ACCESS_KEY`: Your AWS secret access key for S3.
- `REGION`: The AWS region where your S3 bucket is hosted.
- `BUCKET`: The name of your S3 bucket.

### JWT Configuration

- `JWT_SECRET`: The secret key used for signing JSON Web Tokens (JWT).

### Server Configuration

- `SERVER_PORT`: The port number on which your server will run.

**Example `.env` file:**

```plaintext
DATABASE_TYPE=mysql
DATABASE_HOST=mysql
DATABASE_PORT=3306
DATABASE_USERNAME=your_username
DATABASE_PASSWORD=your_password
DATABASE_NAME=your_database

ACCESS_KEY_ID=your_access_key_id
SECRET_ACCESS_KEY=your_secret_access_key
REGION=your_region
BUCKET=your_bucket_name

JWT_SECRET=your_jwt_secret
SERVER_PORT=3000
```

### NGINX Configuration 
- In the `nginx/conf.d/default.conf` file, change the `server_name` field to your domain

### Docker Configuration
- In the `docker-compose.yml` file, set the same data for the database container as specified in `.env`.
## Running the app


#### 1) Launching the containers
```bash
$ docker-compose up -d
```
#### 2) Review the build logs to know when the application will be knocked down and ready to run.
```bash
$ docker logs -f shpp-nodejs-star-wars-nodejs-1
```
#### 3) Uncomment line 21 and comment 20 in the `docker-compose.yml`
#### 4) Rebuild the assembly
```bash
$ docker-compose down
$ docker-compose up -d
```
####  5) Open the site by your domain
