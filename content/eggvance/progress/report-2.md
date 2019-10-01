---
title: "Progress Report #2"
date: 2019-09-30
draft: true
tags:
    - eggvance
    - emulation
    - progress-report
---
One month has passed since the last update and I'm back with another progress report. This month I've focused on improving the accuracy and the performance of the pixel processing unit (PPU). It's main purpose is converting the data stored inside memory, like VRAM and OAM (Object Attribute Memory), into pixel you can see on the screen.

### Rendering Engine

Let's begin with the most interesting thing I've done during the last month: rewriting the rendering engine. The Game Boy Advance uses up to four backgrounds and an object layer. Each background and object has its own priority which determines the drawing order. Backgrounds with high priority are drawn in front of backgrounds with low priority. Backgrounds can also contain transparent areas which will be used to display the next background in the drawing order.

When talking about the rendering engine I really mean the part of the emulator which combines the different layers into the final picture you can see on the screen. The internally used name for this part changed during development and ended up being `collapse`.

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

The code above shows the parts of the PPU (Pixel Processing Unit) which are used to render the Pokemon Emerald title screen. The used backgrounds and the rendering function used for each background is dependent on the selected video mode (found in the DISPCNT register). The results produced by the renderers are show in figures 2 to 5.

<div style="display: flex; justify-content: space-evenly">
    <figure style="width: 45%">
        <img src="/img/collapse_bg0.png">
        <figcaption>Figure 2 - Background layer 0</figcaption>
    </figure>
    <figure style="width: 45%">
        <img src="/img/collapse_bg1.png">
        <figcaption>Figure 3 - Background layer 1</figcaption>
    </figure>
</div>

<div style="display: flex; justify-content: space-evenly">
    <figure style="width: 45%">
        <img src="/img/collapse_bg2.png">
        <figcaption>Figure 4 - Background layer 2</figcaption>
    </figure>
    <figure style="width: 45%">
        <img src="/img/collapse_obj.png">
        <figcaption>Figure 5 - Object layer</figcaption>
    </figure>
</div>

One of the hardest parts of emulating the PPU is combining the different layers to the final frame. That's what the `collapse` function is doing. It uses the generated data to produce the final frame. The process itself is pretty straight forward for simple images. Just loop over the layers from highest to lowest priority and use the first opaque pixel you find. This process gets much harder when dealing with effects like windows and color blending which need to look at multiple predefined layers at the same time. An example for color blending can be found in figure 6.

<div style="display: flex; justify-content: space-evenly">
    <figure style="width: 45%">
        <img src="/img/collapse_blend.png">
        <figcaption>Figure 6 - Blending background 0 and 1</figcaption>
    </figure>
    <figure style="width: 45%">
        <img src="/img/pokemon_emerald.png">
        <figcaption>Figure 7 - Final frame</figcaption>
    </figure>
</div>

The collapser itself ended up being a heavily templated monster to improve performance as much as possible ([GitHub](https://github.com/jsmolka/eggvance/blob/d89f078a1ecf74c98837cc26b8f9ee2c6a1980f5/eggvance/src/ppu/collapse.inl)). Compared to the old rendering engine I saw a performance increase of roughly 30-35%. As a side effect I also fixed severals bugs with had something to do with objects windows.

### Forced Blank

Even though the Game Boy Advance is using an LCD display, its hardware behaves like it's using an CRT display. In a CRT display the electron beam has to return to the start of the line after drawing. Returning to the start of the line causes a small delay between line drawing which is called horizontal blank (or H-Blank). Once the whole frame has been drawn the beam has to return to the beginning of the frame which is called vertical blank (or V-Blank). A visual representation of this process can be found in figure 1 (with line numbers of the classic Game Boy).

<div style="display: flex; justify-content: space-evenly">
    <figure style="width: 45%">
        <img src="/img/blanking_intervals.png">
        <figcaption>Figure 1: Blanking intervals (<a href=http://imrannazar.com/GameBoy-Emulation-in-JavaScript:-GPU-Timings">source</a>)</figcaption>
    </figure>
</div>

Most of the game logic and graphics processing is done during V-Blank because some of the memory areas are not accessible while the line is being drawn. Examples for that are VRAM, palette RAM and OAM. Forcing a blank draws a white line and allows access to the restricted memory areas. This can be used for quickly setting up the game. Emulating this effect simply requires filling the current scanline with white pixels. The code should be pretty self-explanatory.

```cpp
if (mmio.dispcnt.force_blank)
{
    u32* scanline = &backend.buffer[WIDTH * mmio.vcount];
    std::fill_n(scanline, WIDTH, 0xFFFFFFFF);
    return;
}
```

### SDL Backend Changes

The GBA uses one halfword (16-bits) to encode colors in a BGR555 format. This effectively wastes one bit but that doesn't seem to be a problem. Modern color formats use that extra bit for more green values BGR565 because the human eye can see many shades of green. I'm using the SDL2 library for video, audio and user input. It allows the creation of texture in the desired RGB555 format which can be used for hardware accelerated rendering. The problem is that modern hardware tends to use the ARGB8888 for colors which made SDL convert to whole frame from one format to the other. Removing this implicit conversion by converting the color myself resulted in a 10-15% performance increase.

```cpp
u32 PPU::argb(u16 color)
{
    return 0xFF000000               // Alpha
        | (color & 0x001F) << 19    // Red
        | (color & 0x03E0) <<  6    // Green
        | (color & 0x7C00) >>  7;   // Blue
}
```

The function for converting colors from BGR555 to ARGB8888 seems quite cryptic but it just moves the bits to the correct position.

### High Resolution Timer
Timing an emulator can be quite hard. If the frame has been finished and rendered early there isn't much you can do aside from waiting. The GBA has a refresh rate of 59.737 Hz (280896 cycles per frame on a 16.78 MHz CPU). The ideal frame time for this scenario are 16740 microseconds. 

Using components of the C++ STL will result in inaccuracies which accumlate over time. Luckily I found an [answer](https://stackoverflow.com/a/41862592) on stackoverflow which solves this problem with platform specific code. Using this as a base for the microsecond clock in my emulator resulted in really consistent frames per second which tend to stay in the range 59.7 - 59.8 at all time.

### Summy

Apart from the things talked about in the progress report there are many small bug fixed and accuracy improvements. My current goals are adding an editable config file and fixing severals bugs in games. After that I want to release the first version of my emulator with compiled binaries.
