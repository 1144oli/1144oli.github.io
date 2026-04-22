---
title: Homelab Control Panel
date: 18/04/2026
---

## The idea
The main idea with this was to have a control panel-style dashboard on my wall to see stats about my homelab, as well as perform basic controls. I'd also like to integrate it with my friend Sam's security camera project.

But how will I achieve this?

The plan at the minute is to buy a cheap tablet from eBay and make a website for it. I found a 1st gen iPad for £10! There were other approaches I considered as well. One was using a Raspberry Pi with a display. This is what my friend and housemate Sean did with an e-ink display but this had some limitations. It isn't touchscreen, and it's more expensive than the tablet option. Another idea was an old monitor with a Pi, but this also had similar limitations. I also thought of using an ESP32 or another microcontroller, but I haven't fully researched this yet.

#### Mock-up
I want to make a simple mock-up display. I will use Excalidraw for this. I want separate sections, and obviously I should be able to add more if needed. The current ideas are a stats section, a Proxmox iframe, a camera section, and then a section for items such as the weather and ORCS.

ORCS is a system in my house to know when someone is home. We have it displayed on a dot matrix in our living room and on our phones. It was developed by Sam and is an acronym of our names: Oliver, Raya (Sean), Caiden, Sam. We each have scripts on our phones; Caiden and I have iPhones, so we use Shortcuts to know when we leave the house. If you want to know more, there's a section on it in [Small Thoughts](https://cyberoli.uk/posts.html?post=Small_Thoughts).

![mockup](photos/basic.png align=center rotate=0)

### Build log 
17/04 - I researched ways to do the project. I have not yet decided if I want this to just be a dashboard or if it should have some functionality with a touchscreen, etc.  
18/04 - I decided on an iPad because this gives me the most flexibility. It has been ordered and should arrive between the 21st and 27th of this month (April).
22/04 - The iPad Air has arrived. Quick and only cost me £10 I will probably hold off on the project until after my assignments need to be in on the 7th of may. 
