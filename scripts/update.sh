#!/bin/bash
echo -e "\e[1m\e[36m[poe-currency-monitor-tool] \e[0mUpdating poe-currency-monitor-backend..."

# Create git up alias because it's harmful to use git pull to update a repo,
# this will add noise to git log in case of branch merging.
# https://stackoverflow.com/a/17101140
git config --global alias.up '!git remote update -p; git merge --ff-only @{u}'

echo -e "\e[1m\e[36m[poe-currency-monitor-tool] \e[0mUpdating local repository from remote..."
git checkout master && git up

echo -e "\e[1m\e[36m[poe-currency-monitor-tool] \e[0mRunning yarn to install dependencies and build..."
yarn install --frozen-lockfile --silent
yarn build

echo -e "\e[1m\e[36m[poe-currency-monitor-tool] \e[0mRestarting systemd process..."
systemctl restart poecurrencymonitor
systemctl status poecurrencymonitor

echo -e "\e[1m\e[36m[poe-currency-monitor-tool] \e[0mSuccessfully restarted poecurrencymonitor backend!"
