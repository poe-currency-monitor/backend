# PoE Currency Monitor back-end

> Generated from the [Node Express REST-API template](https://github.com/TotomInc/node-express-mongo-rest-api).

- [PoE Currency Monitor back-end](#poe-currency-monitor-back-end)
  - [Getting started](#getting-started)
  - [Overview](#overview)
    - [Dependencies](#dependencies)
    - [Structure](#structure)
    - [Commands](#commands)
    - [Error-handling](#error-handling)
    - [Linting + formatting](#linting--formatting)
  - [Deployment](#deployment)
    - [Setup environment](#setup-environment)
    - [SSL HTTPS with Certbot from LetsEncrypt](#ssl-https-with-certbot-from-letsencrypt)
    - [Nginx and firewall configuration](#nginx-and-firewall-configuration)
      - [UFW configuration](#ufw-configuration)
      - [Nginx configuration](#nginx-configuration)
    - [Setup Node process as systemd](#setup-node-process-as-systemd)
    - [Updating the API](#updating-the-api)
  - [Endpoints](#endpoints)
    - [Unprotected endpoints](#unprotected-endpoints)
    - [PoE-related endpoints](#poe-related-endpoints)
    - [poe.ninja-related endpoints](#poeninja-related-endpoints)
  - [License](#license)

## Getting started

To get the server running locally:

- Clone the repo.
- `yarn` to install all the dependencies.
- `cp .env.example .env` and edit the environment variables.
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

1. Install [`build-essential`](https://packages.ubuntu.com/bionic/build-essential), [`mongodb`](https://www.mongodb.com/) and [`nginx`](https://www.nginx.com/):

   - `sudo apt install build-essential mongodb nginx -y`

2. Install [`yarn`](https://classic.yarnpkg.com/en/docs/install/#debian-stable):

   - `curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -`
   - `echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list`
   - `sudo apt update && sudo apt install yarn`

3. Create a `node` user to run the process and switch to that user:

   - `sudo adduser node`
   - `su - node`

4. Install [`nvm`](https://github.com/nvm-sh/nvm#installing-and-updating) with latest v12 LTS:

   - `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash`
   - `nvm install --lts`

5. Clone the repository, run `yarn && yarn build` (you may need to generate keys if the repo is private with `ssh-keygen`).

6. Make sure to setup SSL and edit their path in the `.env` file, **feel free to do this step at the end of the global setup for convenience**.

7. Once everything else is setup, you may encounter a CORS error. You need to add the domain-name(s) of your front-end to the `corsWhitelist` array variable in `config/express.ts`.

### SSL HTTPS with Certbot from LetsEncrypt

Before continuing on the Nginx and firewall configuration, make sure you have a SSL certificate with a valid domain-name.

I usually follow [this quick, dead-simple, tutorial](https://itnext.io/node-express-letsencrypt-generate-a-free-ssl-certificate-and-run-an-https-server-in-5-minutes-a730fbe528ca) to generate my free SSL certificate (using NodeJS + Express + LetsEncrypt (Certbot)). It takes less than 5 minutes if you have already mapped your VM IP to your domain-name DNS.

Some tips for this step:

- You may need to install `npm` for this step (`node` should already be there with a `v8`), but only for the root user with `sudo apt install npm`.

- I usually run the temporary ACME validation Express server with a `sudo` in order to have access to the port `80`: `sudo node ./index.js`.

- Make sure that the `node` user have access to the SSL keys, as the node process will need to _read_ those keys for the HTTPS server:

  - `setfacl -R -m u:node:rwx /etc/letsencrypt/`
  - `setfacl -R -m u:node:rwx /etc/letsencrypt/live/`

### Nginx and firewall configuration

#### UFW configuration

1. Allow SSH and Nginx HTTP + HTTPS ports:

   - `sudo ufw allow ssh` (this is needed as we don't want to be lgoged out of the SSH session)
   - `sudo ufw allow "Nginx Full"` (allow Nginx HTTP + HTTPS)

2. Enable UFW `sudo ufw enable`

3. Reload UFW `sudo ufw reload`

4. View UFW rules `sudo ufw status numbered`

   - If you want to remove a rule, you can `sudo ufw delete <rule-number>`

#### Nginx configuration

This Nginx configuration used will proxy all Node process request (from 8080 and 8443) to real HTTP and HTTPS ports (80 and 443). Nginx is highly recommended as the `node` user is not a sudo user (and running a node process with `sudo` is really bad) and will not have access to low-level ports such as 443 and 80.

1. Make sure to remove Apache2 or it will interfere with Nginx:

- `sudo apt-get purge apache2`
- `sudo apt-get remove --purge apache2 apache2-utils`

2. Create a configuration file for the domain `sudo nano /etc/nginx/sites-available/poecurrencymonitor.cf`

3. Add the following content to the Nginx configuration:

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

4. You can test if the Nginx config file doesn't contain any errors with `sudo nginx -t`

5. Make sure to symlink the `poecurrencymonitor.cf` site-available config to site-enabled directory: `sudo ln -sf /etc/nginx/sites-available/poecurrencymonitor.cf /etc/nginx/sites-enabled`

### Setup Node process as systemd

1. Create a process configuration file `/etc/systemd/system/poecurrencymonitor.service` containing the following:

   ```systemd
   [Unit]
   Description=PoE Currency Monitor - Backend for the PoE Currency Monitor webapp. [poecurrencymonitor.cf]

   [Service]
   EnvironmentFile=-/etc/default/poecurrencymonitor
   ExecStart=/home/node/.nvm/versions/node/v<your-node-lts-version>/bin/node /home/node/poe-currency-monitor-backend/dist/index.js
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

6. Verify everything is working well `systemctl status poecurrencymonitor -l --no-pager`

   - You can also use `lsof -i :<api-port>` to verify the Node process is actually listening on the specified port

### Updating the API

- Run `scripts/update.sh` to automatically pull changes, install dependencies, build from source and restart `systemctl` process.

## Endpoints

### Unprotected endpoints

All the endpoints are protected excepted the 2 routes below:

- `/api/heartbeat/`: unprotected, check if API is up.
- `/api/auth/`: unprotected, used to login and generate a client JWT.

### PoE-related endpoints

- `/api/poe/:accountName/characters/?poesessid`: retrieve a list of character for the specified account-name.
- `/api/poe/:accountName/stash-tabs/?poesessid&league&realm`: retrieve all stash-tabs for the specified account-name.
- `/api/poe/:accountName/stash-items/?poesessid&league&realm&tabIndex`: retrieve all items of specific stash-tabs for the specified account-name.

### poe.ninja-related endpoints

- `/api/poe-ninja/currency-rates/?league&language&type`: retrieve currency-rates of specific currency type for specified league.
- `/api/poe-ninja/item-rates/?league&language&type`: retrieve items-rates of specific item type for specified league.

## License

Project licensed under GPL v3, please see the LICENSE file.
