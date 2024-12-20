#!/bin/bash

# Variables
EC2_HOST="ubuntu@ec2-52-90-115-184.compute-1.amazonaws.com"
KEY_PATH="../cred/newTest.pem"

# Copy the docker-swarm.yaml to EC2
scp -i $KEY_PATH docker-swarm.yaml $EC2_HOST:~/docker-swarm.yaml

# Deploy the stack
ssh -i $KEY_PATH $EC2_HOST "\
    docker stack deploy -c docker-swarm.yaml my-three-tier-app"