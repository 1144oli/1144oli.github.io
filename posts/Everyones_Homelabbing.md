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
I'll start with the LXCs. LXCs are lightweight containers similar to Docker; they only take a few minutes to set up. The community maintains lots of [Proxmox LXC Helper Scripts](https://community-scripts.github.io/ProxmoxVE/scripts), which are very useful for setting up almost anything you can imagine. Anyway, onto [Zipline](https://zipline.diced.sh/) which is an amazing photo/file sharing service. Personally, I've set it up with my domain sa a subdomain so that I and others who I've given accounts to can automatically store photos, videos, and shorten links with total privacy. You can set it up using ShareX or in my case Flameshot so that screenshots are automatically uploaded to the Zipline and then copies a link that can be embedded into discord! Zipline is a very easy, beginner project that anyone with the slightest technical knowledge could set up in a matter of hours! I've seen the features that Zipline offers for free cost money on sites such as e-z.host, I would highly suggest this project. 

### Glance 
Glance is another LXC which is a dashboard, I have it set up so that it automatically directs me to the page when opening a new tab in my web browser. Its very customisable allowing you to change pretty much whatever you want about it.
![Glance dash](https://github.com/glanceapp/glance/blob/main/docs/images/readme-main-image.png) 

### PiHole 
[PiHole](https://pi-hole.net/) is a DNS sinkhole it provides network wide advertisement blocking I also have this set up on an LXC and it also provides an amazing dashboard to view all allowed and disallowed traffic and what devices are doing this, I would suggest thing project to anyone starting out in the homelabbing world. It provides skills in DNS, LXC, Networking, and most importantly gives you privacy from trackers and advertisements across the internet. 

### VMs
One VM I have is [Nextcloud](https://nextcloud.com/) this VM also is tailscaled, the best way to describe NextCloud is as MS office but privacy focused and self hosted, it offers features like video chatting, notes, photo storage, as a NAS, calendar, mail, and contacts. Overall its a very powerful piece of tech that I am amazed is FOSS (Free Open Source Software)

Another is [TrueNAS](https://www.truenas.com/) which unsurprisingly is Network Attached Storage, it also has a good UI desgin, it provides RAID for its disks and is a FOSS alternative to Unraid, if you really care about data storage this is a good option.

Games servers are also on my homelab, gone are the days of asking others to start the server or paying for a undoubtedly good server, but with less than customisation with it. With this you have full control over everything, from server software to mods, to domain. Everything. And it can run 24/7. Like with everything I've spoken about there is a certain level of risk involved especially port forwarding like you'd need to say for a minecraft server but its quite minimal, overall I would suggest reading up on the risks before fully commiting to this project. 

## At what cost?
The best way I've found to start homelabbing is with old desktops on facebook marketplace. I bought 2 desktops for my homelab and combined them, this cost a total of £70, 1 HP pavilion for £20, and a custom PC for £50. In hindsight this was abit over the top, and could have saved some money buying a perhaps a mini think centre. My homelab consists of 16gb of DDR3 at a resonable 1600Mhz, an Intel i5-3330 (4) @ 3.200GHz, and a GTX 760 (although getting GPU passthrough to work on proxmox is a pain) Anyone who doesnt pay a flat fee for elecrticity should probably take that into account too, most homelabs dont use more than afew pounds per day but if that is an issue you can look towards either arm based home servers, like raspberry pis or look towards a laptop server which should lower wattage.

