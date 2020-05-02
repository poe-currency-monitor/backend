#!/bin/bash
echo "[poe-currency-monitor-tool] Updating poe-currency-monitor-backend..."

# Create git up alias because it's harmful to use git pull to update a repo,
# this will add noise to git log in case of branch merging.
# https://stackoverflow.com/a/17101140
git config --global alias.up '!git remote update -p; git merge --ff-only @{u}'

echo "[poe-currency-monitor-tool] Updating local repository from remote..."
git checkout master && git up

echo "[poe-currency-monitor-tool] Running yarn to install dependencies and build"
yarn install --frozen-lockfile
yarn build

echo "[poe-currency-monitor-tool] Restarting systemd process"
systemctl restart poecurrencymonitor
systemctl status poecurrencymonitor
