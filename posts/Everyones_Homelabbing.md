---
title: Why is EVERYONE Homelabbing?
date: 22/11/2025
---
# Homelabbing: a new trend
## What is Homelabbing?
A homelab is a personal server used for learning, experimentation, and most importantly self self-hosting services. In recent years, this has become more and more popular, but especially in the past few months.

The graph below shows the Google Trends data for "homelab" since 2004  
![GoogleTrends](/photos/googletrends.png)

## Why?
People homelab for lots of different reasons; however, I think the most popular is for freedom, freedom to own your own data, and not have it on someone else's computer (the cloud). But really, homelabbing can do a lot more; from hosting your own Minecraft server to having your own SMD share (like Google Drive) to even having your own MS Office hosted locally (Nextcloud), everything is yours, you control it, you own it, and (if you set it up right) only you can see it.

## What do I use?
My homelab consists of Proxmox OS, which has multiple VMs and LXCs inside it. I use Proxmox as it keeps everything neat and tidy and lets me have a good overview of my whole system. It also makes SSH easier as I only need to [Tailscale](https://tailscale.com/), and I have access to every service running separately with little overhead on my system.

### Zipline
I'll start with the LXCs. LXCs are lightweight containers similar to Docker; they only take a few minutes to set up. The community maintains lots of [Proxmox LXC Helper Scripts](https://community-scripts.github.io/ProxmoxVE/scripts), which are very useful for setting up almost anything you can imagine. Anyway, onto [Zipline](https://zipline.diced.sh/) which is an amazing photo/file sharing service. Personally, I've set it up with my domain sa a subdomain so that I, and others who I've given accounts to can automatically store photos, videos, and shorten links with total privacy. You can set it up using ShareX or in my case Flameshot so that screenshots are automatically uploaded to the Zipline and then copies a link that can be embeded into discord! Zipline is a very easy, beginner project that anyone with the slightest technical knowledge could set up in a matter of hours! I've seen the features that Zipline offers for free cost money on sites such as e-z.host, I would highly suggest this project. 
