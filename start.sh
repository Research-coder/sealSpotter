#!/bin/bash

# For running a site as a container
# the image includes apache, and php with mysqli
# on the command line, run `sudo bash start.sh`



# get the current directory
# method from https://stackoverflow.com/a/246128
dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

# start the docker server
docker run \
    -p 8004:80 \
    --name test-area \
    -v $dir:/var/www/html/ \
    -d \
    --rm \
    php:apache-mysqli
