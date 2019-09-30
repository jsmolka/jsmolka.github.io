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

### Color Backend Changes

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

### Collapser

The pixel processing unit (PPU) can use up to four different background layers and an additional object layer. Each layer has a priority which determines the drawing order of the backgrounds. The objects inside the object layer can have different priorities.

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
