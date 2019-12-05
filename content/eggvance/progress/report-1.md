---
title: "Progress Report #1"
date: 2019-08-31
draft: false
type: posts
---
At the end of last year I finished my introduction project to C++. Since then, I read a couple of books about the language and I really started to like it. Finishing my previous project also meant looking for a new one. The idea of creating a GBA emulator originated in a C++ class where one of my fellow students asked if the emulator I was playing on was the project for the class. I said no but the idea got stuck in my head (thanks Robert). 

After writing a basic [Chip-8](https://github.com/jsmolka/sandbox-cpp/tree/master/chip8) emulator and a less than half finished [GB](https://github.com/jsmolka/egg-gb) emulator, I moved on to the GBA because that's what I really wanted to do. Now, exactly seven months after the initial commit, I feel like the emulator in a state that is worth writing about.

{{<figures>}}
  {{<figure src="/img/pokemon_emerald.png" caption="Figure 1 - Pokemon Emerald" class="figure-left">}}
  {{<figure src="/img/yoshis_island.png" caption="Figure 2 - Yoshi's Island" class="figure-right">}}
{{</figures>}}

### Early Steps

The first thing I did was implement the CPU, an ARM7TDMI to the precise, which took me a couple months. My main sources for this were the official ARM datasheet and [GBATEK](https://problemkaputt.de/gbatek.htm). The most important thing I did during all that time was writing CPU tests which covered pretty much all common and uncommon cases (at one point my repository consisted of around 30% assembly). This turned out to be a great decision because I could rely on my CPU implementation when debugging errors of any type. The tests have only failed me once so far and I hope it stays that way.

After three months I finally had a working and relatively robust CPU implementation (missing things like hardware and software interrupts). It was time to implement some of the graphics. The GBA uses up to four different background and object (Nintendos word for sprite) layers with various priorities. GBATEK can be used for gathering information but due to its nature of being a reference document it is lacking visual examples and detailed explanations. That’s why I went along TONC’s GBA programming tutorials and reverse engineered all the given examples for graphics, effects, timers, interrupts and DMA.

{{<figures>}}
  {{<figure src="/img/tonc_sbb_aff.png" caption="Figure 3 - Affine tiled background" class="figure-left">}}
  {{<figure src="/img/tonc_obj_aff.png" caption="Figure 4 - Affine sprite" class="figure-right">}}
{{</figures>}}

The last thing I did was clean up the memory interface. I implemented things like bus widths, memory mirroring and read / write only registers. This actually fixed some of the bugs I had and allowed me to play through Pokemon Emerald. A precondition for playing through a whole game was implementing cartridge backup types like SRAM, EEPROM and Flash. Finding out which save type to use and wrapping my head around how they all work took some time but I managed to figure it out.


### Milestones

- 30/01/19: Initial commit
- 20/04/19: Passes [armwrestler](https://github.com/Emu-Docs/Emu-Docs/tree/master/Game%20Boy%20Advance/test_roms/arm_wrestler) tests
- 02/05/19: Displays [tonc](https://www.coranac.com/tonc/text/) bitmap demos
- 29/05/19: Displays tonc regular sprite and background demos
- 08/06/19: Displays tonc affine sprite and background demos
- 27/06/19: Displays tonc graphic effect demos
- 03/07/19: Displays tonc interrupt and bios call demos
- 11/07/19: Displays tonc mode 7 demos
- 14/07/19: Runs Kirby - Nightmare In Dreamland
- 16/07/19: Displays the BIOS
- 07/08/19: Displays all tonc demos
- 17/08/19: Runs Pokemon Emerald

### Some Working Games

- Advance Wars
- Castlevania - Aria of Sorrow
- Mario Kart - Super Circuit
- Mega Man Zero
- Metroid Fusion
- Pokemon - Emerald
- Pokemon Mystery Dungeon - Red Rescue Team
- Super Mario Advance 3 - Yoshi's Island
- The Legend of Zelda - A Link To The Past & Four Swords

### Conclusion

All of this progress sounds great. Sadly you can't hear it because there is no audio implementation just yet. That's the last thing I'll do. Before that I need to improve accuracy and performance (it's not bad but I could be better) of the emulator. This report will serve as a baseline and I'll make more of those with specific progress information in the future.
