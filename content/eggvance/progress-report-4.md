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
      io.dispcnt.base_frame + offset) & COLOR_MASK;
  }
}
```

The fixed version of the renderer applies the `transform` function to the current pixel, which returns the coordinates inside the bitmap. Those are then used to determine the pixels color. The matrix used in the Yeti demo scales the bitmap by two and thus fills the entire screen. The black pixels on the right are caused by the game and not by the emulator.

### Color Masking
<!-- Mother 3 -->

### Sprite Address Limit
<!-- Pokemon Series -->

### Register List Iterator
<!-- 20% set by default -->

### Super Mario Bros. 6-6

### Linux Support

### Replacement BIOS

### Conclusion
<!-- Doom II? -->
