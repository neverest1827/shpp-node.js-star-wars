## Description


## Dependency installation

```bash
$ npm install
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
DATABASE_HOST=localhost
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

## Running the app

```bash
# perform migration
$ npm run typeorm:run

# compilation
$ npm run build

# fill the database
$ npm run fill-db

# start app
$ npm run start
```