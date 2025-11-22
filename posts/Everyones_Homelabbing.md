---
title: Why is EVERYONE Homelabbing?
date: 22/11/2025
---
# Homelabbing: a new trend

## What is Homelabbing?
A homelab is a personal server used for learning, experimentation, and most importantly self hosting services.
In recent years this has become more and more popular, but especially in the past few months.

The graph below shows the google trends data for "homelab" since 2004
![GoogleTrends](/photos/googletrends.png)

## Why?
People homelab for lots of different reasons however, I think the most popular is for freedom, freedom to own your own data, and not have it on someone elses computer (the cloud). But really homelabbing can do alot more; from hosting your own minecraft server to having your own SMD share (like google drive) to even having your own MS office hosted locally (nextcloud) everything is yours, you control it, you own it, and (if you set it up right) only you can see it. 

## What do I use?
My homelab consists of proxmox OS which has multiple VMs and LXCs inside it. I use proxmox as it keeps everything neat and tidy and lets me have a good overview of my whole system. It also makes SSH easier as I only need to [tailscale](https://tailscale.com/) IP and I have access to every service running seperately with little overhead on my system.

### Zipline
I'll start with the LXCs. LXCs are lightweight containers similar to docker, they only take afew minutes to set up, the community maintains lots of [Proxmox LXC Healper Scripts](https://community-scripts.github.io/ProxmoxVE/scripts) which are very useful for setting up almost anything you can imagine.
