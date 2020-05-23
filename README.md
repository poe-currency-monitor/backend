# PoE Currency Monitor back-end

> Generated from the [Node Express REST-API template](https://github.com/TotomInc/node-express-mongo-rest-api).

## Getting started

To get the server running locally:

- Clone the repo.
- `yarn` to install all the dependencies.
- Copy `.env.example` file as `.env` and edit the environment variables.
- `yarn dev` to run the server locally.

## Overview

### Dependencies

- typescript: JavaScript superset to scale large applications
- mongoose: MongoDB object modeling for Node.js
- express: HTTP server for handling routing
- express-jwt: JSON Web Token authentication middleware
- celebrate: express middleware for handling validation
- body-parser: express body parsing middleware
- cors: express middleware to enable cors on specific routes
- helmet: secure express apps with various HTTP headers
- jsonwebtoken: JSON Web Token implement for Node
- uuid: generate RFC4122 (v1, v4, and v5) UUIDs
- dotenv: load environment variables from a `.env` file
- module-aliases: create aliases of directories and register custom module paths (used for TypeScript custom paths)

### Structure

- `.env.example` an example of environment variables that are used.
- `index.ts` entry point of the application.
- `build/` scripts used for deployment.
- `config/` various configuration files (express and environment variables).
- `interfaces/` contains various TypeScript interfaces.
- `server/` contains a folder for every route, this is the main Express logic for all of your routes.
- `types/` override specific modules `*.d.ts.` typings.
- `scripts/` various bash scripts.

### Commands

- `yarn build`: build TypeScript source-files into the `/dist` directory.
- `yarn dev`: run Nodemon, hot-reload the development server.
- `yarn lint`: run ESLint, print warnings and errors (doesn't auto-fix).
- `yarn lint:fix`: run ESLint and fix all auto-fixable ESLint rules.
- `yarn serve-coverage`: start an HTTP server for the coverage directory.
- `yarn start`: execute the compiled app (from `/dist`) in production environment.

### Error-handling

There are multiple error handlers already provided in the `config/express.ts` file.

- The first error-handler is the one provided by `celebrate` which will be triggered in case of an invalid HTTP request (invalid headers, body, query parameters, ...).
- A second error-handler for anything that is 404.
- A third error-handler for all the other errors.

If in development, the returned error (as a JSON response) will show the stacktrace to help you debug.

### Linting + formatting

Linting is done with ESLint and formatting with Prettier.

There are already a set of ESLint rules which includes TypeScript best-practices, the `.eslintrc.js` extends the [`@totominc/eslint-config-typescript`](https://www.npmjs.com/package/@totominc/eslint-config-typescript) configuration.

## Deployment

Deployment have been tested on Ubuntu 18.04 LTS, using `systemd`. Please, do not use [`pm2`](https://pm2.keymetrics.io/) as there are some issues when accessing _root_ files such as SSL keys.

### Setup environment

1. Create a `node` user to run the process and switch to that user:

   - `sudo adduser node`
   - `su - node`

2. Install [`build-essential`](https://packages.ubuntu.com/bionic/build-essential), [`mongodb`](https://www.mongodb.com/) and [`nginx`](https://www.nginx.com/):

   - `sudo apt install build-essential mongodb nginx -y`

3. Install [`nvm`](https://github.com/nvm-sh/nvm#installing-and-updating) with latest v12 LTS:

   - `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash`
   - `nvm install --lts`

4. Install [`yarn`](https://classic.yarnpkg.com/en/docs/install/#debian-stable):

   - `curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -`
   - `echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list`
   - `sudo apt update && sudo apt install yarn`

5. Clone the repository, run `yarn && yarn build`.

6. Make sure to setup SSL and edit their path in the `.env` file.

### Setup Node process

1. Create a process configuration file `/etc/systemd/system/poecurrencymonitor.service` containing the following:

   ```systemd
   [Unit]
   Description=PoE Currency Monitor - Backend for the PoE Currency Monitor webapp. [poecurrencymonitor.cf]

   [Service]
   EnvironmentFile=-/etc/default/poecurrencymonitor
   ExecStart=/home/node/.nvm/versions/node/<your-node-lts-version>/bin/node /home/node/poe-currency-monitor-backend/dist/index.js
   WorkingDirectory=/home/node/poe-currency-monitor-backend
   LimitNOFILE=4096
   IgnoreSIGPIPE=false
   KillMode=process
   User=node
   SyslogIdentifier=poecurrencymonitor-node

   [Install]
   WantedBy=multi-user.target
   ```

2. Create an environment file `/etc/default/poecurrencymonitor` containing the following:

   ```
   NODE_ENV=production
   ```

3. Make all the scripts executable with `chmod +x ./scripts/*.sh`
4. Enable the process on startup `systemctl enable poecurrencymonitor`
5. Start the process `systemctl start poecurrencymonitor`
6. Verify everything is working well `systemctl status poecurrencymonitor --l --no-pager`
   - You can also use `lsof -i -p <api-port>` to verify the Node process is actually listening on the specified port

### Nginx and firewall configuration

#### UFW configuration

1. Allow SSH and Nginx HTTP + HTTPS ports:

   - `sudo ufw allow ssh` (this is needed as we don't want to be locked out the SSH session).
   - `sudo ufw allow "Nginx Full"` (allow Nginx HTTP + HTTPS)

2. Reload UFW `sudo ufw reload`

3. View rules before enabling UFW `sudo ufw status numbered`

   - If you want to remove a rule, you can `sudo ufw delete <rule-number>`.

4. Enable UFW `sudo ufw enable`

#### Nginx configuration

This Nginx configuration used will redirect all HTTP request to HTTPS. Also make sure to replace the port used in the `location /` block with the one you setup in the project `.env` file (it's 8443 by default).

1. Create a configuration file for the domain `sudo nano /etc/nginx/sites-available/poecurrencymonitor.cf`

2. Add the following content to the Nginx configuration:

   ```
   server {
     listen 80;

     server_name poecurrencymonitor.cf www.poecurrencymonitor.cf;

     return 301 https://$host$request_uri;
   }

   server {
     listen 443 ssl http2;

     server_name poecurrencymonitor.cf www.poecurrencymonitor.cf;

     ssl_certificate /etc/letsencrypt/live/poecurrencymonitor.cf/cert.pem;
     ssl_certificate_key /etc/letsencrypt/live/poecurrencymonitor.cf/privkey.pem;
     ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
     ssl_ciphers HIGH:!aNULL:!MD5;

     location / {
       proxy_pass https://localhost:8443;
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection 'upgrade';
       proxy_set_header Host $host;
       proxy_cache_bypass $http_upgrade;
     }
   }
   ```

### Restarting the API

- Run `scripts/update.sh` to automatically pull changes, install dependencies, build from source and restart `systemctl` process.

## Endpoints

### Unprotected endpoints

All the endpoints are protected excepted the 2 routes below:

- `/api/heartbeat/`: unprotected, check if API is up.
- `/api/login/`: unprotected, used to login and generate a client JWT.

### PoE-related endpoints

- `/api/poe/:accountName/characters/?poesessid`: retrieve a list of character for the specified account-name.
- `/api/poe/:accountName/stash-tabs/?poesessid&league&realm`: retrieve all stash-tabs for the specified account-name.
- `/api/poe/:accountName/stash-items/?poesessid&league&realm&tabIndex`: retrieve all items of specific stash-tabs for the specified account-name.

### poe.ninja-related endpoints

- `/api/poe-ninja/currency-rates/?league&language&type`: retrieve currency-rates of specific currency type for specified league.
- `/api/poe-ninja/item-rates/?league&language&type`: retrieve items-rates of specific item type for specified league.

## License

Project licensed under GPL v3, please see the LICENSE file.
