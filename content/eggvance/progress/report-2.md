---
title: "Progress Report #2"
date: 2019-09-30
draft: false
tags:
    - eggvance
    - emulation
    - progress-report
---
One month has passed since the last update and I'm back with another progress report. This month I've focused on improving the accuracy and the performance of the pixel processing unit (PPU). Its main purpose is converting the data stored inside memory, like VRAM and OAM (Object Attribute Memory), into pixels you can see on the screen.

### Rendering Engine

Let's begin with the most interesting thing I've done during the last month: rewriting the rendering engine. The Game Boy Advance can use up to four different backgrounds and an object layer. Each background and object has its own priority which determines the drawing order. Backgrounds with high priority are drawn in front of backgrounds with low priority. Transparent areas inside backgrounds are used to display the background with the next highest priority.

When talking about the rendering engine, I really mean the part of the emulator which combines the different layers into the final scene you can see on the screen. The name of this part changed during development and ended up being `collapse`.

```cpp
renderObjects();

switch (mmio.dispcnt.mode)
{
case 1:
    renderBg(&PPU::renderBgMode0, 0);
    renderBg(&PPU::renderBgMode0, 1);
    renderBg(&PPU::renderBgMode2, 2);
    collapse(0, 3);
    break;
}
```

The code snippet above shows the parts of the PPU which contribute to rendering the Pokémon Emerald title screen. The used backgrounds and their rendering functions are dependent on the selected video mode found in the DISPCNT register. The produced layers can be seen in figures 1 to 4.

<div style="display: flex; justify-content: space-evenly">
    <figure style="width: 45%">
        <img src="/img/collapse_bg0.png">
        <figcaption>Figure 1 - Background layer 0</figcaption>
    </figure>
    <figure style="width: 45%">
        <img src="/img/collapse_bg1.png">
        <figcaption>Figure 2 - Background layer 1</figcaption>
    </figure>
</div>

<div style="display: flex; justify-content: space-evenly">
    <figure style="width: 45%">
        <img src="/img/collapse_bg2.png">
        <figcaption>Figure 3 - Background layer 2</figcaption>
    </figure>
    <figure style="width: 45%">
        <img src="/img/collapse_obj.png">
        <figcaption>Figure 4 - Object layer</figcaption>
    </figure>
</div>

One of the most challenging aspects of emulating the PPU is combining the different layers into the final scene. That's what the `collapse` function is doing. The process itself is rather straightforward for simple scenes. Just loop over the layers from highest to lowest priority and use the first opaque pixel you find. It gets much harder when dealing with effects like windows and color blending which need to look at multiple layers at the same time. An example for color blending can be found in figure 5.

<div style="display: flex; justify-content: space-evenly">
    <figure style="width: 45%">
        <img src="/img/collapse_blend.png">
        <figcaption>Figure 5 - Blending backgrounds 0 and 1</figcaption>
    </figure>
    <figure style="width: 45%">
        <img src="/img/pokemon_emerald.png">
        <figcaption>Figure 6 - Final scene</figcaption>
    </figure>
</div>

The previous version of the collapser ate an unnecessarily high amount of CPU time and was one of the things that definitely needed to be reworked. The new one is heavily templated ([GitHub](https://github.com/jsmolka/eggvance/blob/d89f078a1ecf74c98837cc26b8f9ee2c6a1980f5/eggvance/src/ppu/collapse.inl)) and improved performance by roughly 30-35% in total. It also fixed several bugs that had something to do with object windows.

### Forced Blank

Even though the GBA uses an LCD display, its hardware behaves like a CRT (Cathode Ray Tube). In those displays the electron beam has to return to the start of the next line after drawing the current one. This time period is called horizontal blank (or H-Blank). Once the whole frame has been drawn the beam has to return to the beginning of the frame which is called vertical blank (or V-Blank). A visual representation of this process can be found in figure 7 (with line numbers of the classic Game Boy).

<div style="display: flex; justify-content: space-evenly">
    <figure style="width: 45%">
        <img src="/img/blanking_intervals.png">
        <figcaption>Figure 7: Blanking intervals (<a href=http://imrannazar.com/GameBoy-Emulation-in-JavaScript:-GPU-Timings">source</a>)</figcaption>
    </figure>
</div>

Most of the game logic and graphics processing is done during V-Blank because some of the memory areas are not accessible while the line is being drawn. Examples for that are VRAM, palette RAM and OAM. Forcing a blank draws a white line and allows access to the restricted memory areas. This can be used for quickly setting up the game. Emulating this effect requires filling the current scanline with white pixels (access limitations are not emulated yet). The code should be pretty self-explanatory.

```cpp
if (mmio.dispcnt.force_blank)
{
    u32* scanline = &backend.buffer[WIDTH * mmio.vcount];
    std::fill_n(scanline, WIDTH, 0xFFFFFFFF);
    return;
}
```

### SDL Texture Changes

The GBA uses one halfword (16-bits) to encode colors in a BGR555 format. This effectively wastes one bit but that doesn't seem to be a problem. Modern 16-bit color formats tend to use that extra bit for more green values (RGB565) because the human eye can distinguish shades of green the easiest.

I'm using the SDL2 library for video, audio and user input. It allows the creation of textures in the desired BGR555 format which can be used for hardware accelerated rendering. The only problem with this approach is the fact that modern hardware tends to use the ARGB8888 color format which causes SDL to convert the whole frame from one format to the other. Removing this implicit conversion by converting the colors myself resulted in a 10-15% performance increase.

```cpp
u32 PPU::argb(u16 color)
{
    return 0xFF000000               // Alpha
        | (color & 0x001F) << 19    // Red
        | (color & 0x03E0) <<  6    // Green
        | (color & 0x7C00) >>  7;   // Blue
}
```

### High Resolution Clock
Timing an emulator can be quite hard. If the frame has been rendered early, there isn't much you can do aside from waiting. The GBA has a refresh rate of 59.737 Hz (280896 cycles per frame on a 16.78 MHz CPU). The ideal frame time for this scenario are 16740 microseconds. 

Using components of the C++ STL would result in inaccuracies which accumlate over time. Luckily I found an [answer](https://stackoverflow.com/a/41862592) on stackoverflow which solves this problem with platform specific code. Using this as a base for the high resolution clock in my emulator resulted in consistent frames per second which tend to stay in the range 59.7 - 59.8 all the time.

### Conclusion

Aside from the things talked about in this progress report there are many small bug fixes and accuracy improvements. The overall performance of the emulator has been increased by a fair bit. My next goal is creating the first release version with compiled Windows binaries. This means adding an editable configuration file and fixing several bugs in games.
