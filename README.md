## Description


## Install Docker and Docker-compose in the AWS EC2

```bash
$ sudo apt update
$ sudo apt install docker.io docker-compose
$ sudo systemctl start docker
$ sudo systemctl enable docker
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
- In the `nginx/conf.d/default.conf` file, change the ``server_name` field to your domain

### Docker Configuration
- In the `docker-compose.yml` file, set the same data for the database container as specified in `.env`.
## Running the app


#### 1) Запускаем контейнеры
```bash
$ docker-compose up -d
```
#### 2) Просматриваем логи сборки что бы знать когда приложение сбилдится и будет готово к запуску
```bash
$ docker logs -f nest-app-nodejs-1
```
#### 3) Разкоменитируем 21 строку и коментируем 20 в `docker-compose.yml`
#### 4) Перезапускаем контейнер с нодой
```bash
$ docker restart nest-app-nodejs-1
```
####  5) Открываем сайт по вашему домену
