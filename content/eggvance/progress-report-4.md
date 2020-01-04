---
title: "Progress Report #4"
date: 2020-01-04
type: posts
draft: true
---
Hello there! It have been around two months since the last progress

<!-- Hello there! I have been around two months since the last progress report but there wasn't much to report about. The work slowed down a bit because I startet working. -->

### Improving Bitmaps
Bitmap modes make up half of the available display modes in the GBA. One would assume that they are used in all kind of games, but that's a wrong assumption. Games tend to used tile based modes because they are fasted and more convenient to program. Bitmaps are used in games like DOOM II because it renderes the whole scene in software. Due to them being so rare, I didn't notice bugs in my implementation. Figure 1 shows one of those bugs.

{{<figures>}}
  {{<figure src="yeti-demo-bug.png" caption="Figure 1 - Yeti demo bug" class="full left">}}
  {{<figure src="yeti-demo.png" caption="Figure 2 - Yeti demo" class="full right">}}
{{</figures>}}

<!-- Demo https://www.gbadev.org/ -->

```cpp
void PPU::renderBgMode5(int bg) {
  // Maximum dimensions of this bitmap
  static constexpr Dimensions dims(160, 128);
  // Iterate over horizontal screen pixels
  for (int x = 0; x < SCREEN_W; ++x) {
    // Map current pixel to bitmap coordiantes
    // Remove decimal places with shift
    const auto texture = transform(x, bg) >> 8;
    // Invalid coordinates are transparent
    if (!dims.contains(texture)) {
      backgrounds[bg][x] = TRANSPARENT;
      continue;
    }
    // Bitmap offset = 16-bit color * (160 * texture.y + texture.x)
    int offset = sizeof(u16) * texture.offset(dims.w);
    // Read and mask (explained in later paragraph) color
    backgrounds[bg][x] = mmu.vram.readHalfFast(
      io.dispcnt.base_frame + offset) & COLOR_MASK;
  }
}
```
