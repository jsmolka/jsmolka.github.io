---
title: "Progress Report #3"
date: 2019-11-02
draft: true
tags:
    - eggvance
    - emulation
    - progress-report
---
This month in an average emulator: a complete rewrite. That's what happens when you aren't satisfied with your project and you have a whole month of spare time. Some parts have been reused but the almost every area has been improved to some extent, accurarcy and performance-wise.

### Function Pointer LUT
The old version of the emulator used a combination of decode function and switch-case for decoding and execution. The new version uses a function pointer LUT (lookup table)

### Initializing Registers
At some point in development the emulator was able to boot every tested game apart from the Sonic Advance titles. Resolving issues like this usually involves running my emulator against established emulators like No$GBA (which has an absolutely awesome debug version). After around two hours of comparing I ended up noticing that a different value of the register RCNT (which is used for multiplayer functionality) caused a chain of events which led to the screen shown in figure 1.

<div style="display: flex; justify-content: space-evenly">
    <figure style="width: 45%">
        <img src="/img/sonic_bug.png">
        <figcaption>Figure 1 - Uninitialized RCNT</figcaption>
    </figure>
    <figure style="width: 45%">
        <img src="/img/sonic.png">
        <figcaption>Figure 2 - Initalized RCNT</figcaption>
    </figure>
</div>

Source of this problem was not running the BIOS first and directly jumping inside the ROM. Aside from showing the animated intro, the BIOS also initializes registers like RCNT, DISPCNT and KEYINPUT to their default values. RCNT is one of the unimplemented registers and wasn't taken into consideration. I resolved this issue by properly initializing all registers when not starting inside the BIOS.

### ADC / SBC / RSC
Running mGBA's [test suite](https://github.com/mgba-emu/suite) made be realize that I was using a wrong method for carry detection, which, in retrospect, caused sprite flickering bugs in games like Mario Kart.

### Config

### Summary? End? Closer? Conclusion?

<div style="display: flex; justify-content: space-evenly">
    <figure style="width: 45%">
        <img src="/img/doom_swr1.png">
        <figcaption>Figure ?? - DOOM Software Renderer 1</figcaption>
    </figure>
    <figure style="width: 45%">
        <img src="/img/doom_swr2.png">
        <figcaption>Figure ?? - DOOM Software Renderer 2</figcaption>
    </figure>
</div>
