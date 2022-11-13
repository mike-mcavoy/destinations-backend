#! /usr/bin/bash

dev_container_folder="$(cd $(dirname "${BASH_SOURCE[0]}") && pwd)"
backend_folder="$(cd "${dev_container_folder}/../backend" && pwd)"
web_folder="$(cd "${dev_container_folder}/../web" && pwd)"

cd ${web_folder}
yarn

cd ${backend_folder}
yarn
