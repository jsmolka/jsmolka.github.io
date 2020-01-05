---
title: "Progress Report #4"
date: 2020-01-04
type: posts
draft: true
---
Hello there! It has been quite a while since the last progress report, two months to be exact. Development of the emulator has slowed down a little during that time because I started working as a JavaScript developer. Apart from cleaning up my codebase, I also fixed and implemented some things which might be of interest to some people.

### Bitmap Modes
The GBA has six different background modes which are evenly split into three tile-based and three bitmap modes. One would assume that games utilize bitmaps as much as tiles, but that's not the case in reality. Tiles tend to be faster and easier to understand and are therefore used in most games. One rare example of a game using bitmap modes is DOOM II, which uses them to display the scene created by its internal software renderer. Due to this kind of games being so rare, I didn't notice bugs in the bitmap implementation until very recently, when I was going through some of the demos on [gbadev.org](https://www.gbadev.org/).

{{<figures>}}
  {{<figure src="yeti-demo.png" caption="Figure 1 - Yeti demo" class="full left">}}
  {{<figure src="yeti-demo-bug.png" caption="Figure 2 - Yeti demo bug" class="full right">}}
{{</figures>}}

Figure 1 shows the technically impressive Yeti demo. It's a first-person shooter with a custom 3D engine and uses background mode 5 to display the scene. The dimensions of the bitmap are 160x128 (the screens dimensions are 240x160). Figure 2 shows an old version of the emulator which simply copied the bitmap to the screen without further processing. This was incorrect because bitmaps can make use of the rotation / scaling matrix.

```cpp
void PPU::renderBgMode5(int bg) {
  // Maximum dimensions of this bitmap
  static constexpr Dimensions dims(160, 128);
  // Iterate over horizontal screen pixels
  for (int x = 0; x < SCREEN_W; ++x) {
    // Map current pixel to bitmap coordiantes
    // Remove fractional portion with shift
    const auto texture = transform(x, bg) >> 8;
    // Invalid coordinates are transparent
    if (!dims.contains(texture)) {
      backgrounds[bg][x] = TRANSPARENT;
      continue;
    }
    // Bitmap offset = 16-bit color * (160 * texture.y + texture.x)
    int offset = sizeof(u16) * texture.offset(dims.w);
    // Read and mask (explained in next section) color
    backgrounds[bg][x] = mmu.vram.readHalfFast(
      io.dispcnt.base_frame + offset) & 0x7FF;
  }
}
```

The fixed version of the renderer applies the `transform` function to the current pixel, which returns the coordinates inside the bitmap. Those are then used to determine the pixels color. The matrix used in the Yeti demo scales the bitmap by two and thus fills the entire screen. The black pixels on the right are caused by the game and not by the emulator.

### Color Masking
The GBA uses the BGR555 format to encode colors and stores them in 16-bit units. Most colors are stored in the palette RAM which is a dedicated area in memory with a size of 0x400 bytes. It consists of two halves which are used to store background and sprite colors. The first color in each half can be used to draw transparent pixels. An obvious use case for this are sprites, which aren't always perfect squares. If a pixel has been marked as transparent, the next pixel in the drawing order will be displayed.

{{<figures>}}
  {{<figure src="safety-screen.png" caption="Figure 3 - Safety screen" class="full left">}}
  {{<figure src="safety-screen-bug.png" caption="Figure 4 - Safety screen bug" class="full right">}}
{{</figures>}}

Since the drawing process is separated from combining the backgrounds and sprites into the final scene, transparent pixels must be marked as such. Luckily the most significant bit in each color doesn't carry information and can be used for this purpose. This means that transparent pixels are represented by the color 0x8000. This approach worked well until I booted the game Mother 3. Its intro screen uses 0x8000 to display white and messed up my whole system (figure 4).

```cpp
u16 Palette::colorBGOpaque(int index, int bank) {
  return readHalfFast(0x20 * bank + 2 * index) & 0x7FF;
}

u16 Palette::colorBG(int index, int bank) {
  return index == 0
    ? TRANSPARENT
    : colorBGOpaque(index, bank);
}
```

This problem can be eliminated with a quite simple solution. Every color read from the palette needs to be masked with 0x7FFF in order to clear the most significant bit. This prevents confusing transparent pixels with malformed white pixels (figure 3).

### Sprite Address Limit
<!-- Pokemon Series -->

### Register List Iterator
<!-- 20% set by default -->

### Super Mario Bros. 6-6

### Linux Support

### Conclusion
<!-- Doom II? -->
