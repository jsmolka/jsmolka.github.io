---
title: "Progress Report #5"
author: "Julian Smolka"
summary: "Progress report #5 of the eggvance GBA emulator."
date: 2020-05-11
type: post
draft: true
---
Over four months have passed since the last progress report. During that period I invested a lot of time into cleaning up the current codebase, improving performance and adding some nice features. Unfortunately there were no fixes to broken games so please don't expect nice screenshots of before / after comparisons.

### State Dependent Dispatching
During development I made some performance tradeoffs in favor of clean and readable code (writing clean code is still something I am struggling with). On the other hand I am also a performance junky so every frame per seconds counds and makes me feel better about the emulator.

| Commit | Hash                                                                                            | Improvement           | Pokémon Emerald | Yoshi's Island |
|--------|-------------------------------------------------------------------------------------------------|-----------------------|-----------------|----------------|
| 441    | [368955c0](https://github.com/jsmolka/eggvance/commit/368955c02f911243aaf2b2e8dfc9ce9d849b8f93) | Baseline              | 432.1 fps       | 455.0 fps      |
| 462    | [7007ab8a](https://github.com/jsmolka/eggvance/commit/7007ab8a2a9721cf47c437fb20d4f1e2e560fc43) | GPR class removed     | 460.8 fps       | 481.7 fps      |
| 479    | [fc00b845](https://github.com/jsmolka/eggvance/commit/fc00b845df0963aca0ddfcf4598a5672ac930d8f) | Instruction templates | 489.4 fps       | 511.7 fps      |
| 482    | [a3a8fca2](https://github.com/jsmolka/eggvance/commit/a3a8fca2c0ee01024668d77e817e05470b4eac94) | Basic dispatching     | 522.8 fps       | 542.1 fps      |
| 483    | [326b4809](https://github.com/jsmolka/eggvance/commit/326b4809b398f051807a93b2bc4e9879fef60567) | Improved dispatching  | 556.9 fps       | 574.4 fps      |

### Efficient Bit Iteration
The emulation of some processor instructions requires iterating all bits of an integer. Those instructions are used to load / store multiple registers at the same time. Each register is assigned to one bit which results in

```cpp
uint rlist = 0b1010'0110'1110'1010;
for (uint x = 0; rlist != 0; ++x, rlist >>= 1) {
  if (rlist & 0x1) {
    // Do something
  }
}
```

The function is sufficient for most use cases but it can be optimized in some areas. The number of iterations will be almost equal to the number of bits of the integer type. Some of them are removed by the loop condition which stops early if the value is zero. The other problem is the branch inside the loop. Using random data, like in an emulator, will result mispredictions.

```cpp
uint rlist = 0b1010'0110'1110'1010;
for (; rlist != 0; rlist &= rlist - 1) {
  uint x = bits::ctz(rlist);
  // Do something
}
```

The optimized function might be confusion to people without a deeper understanding of bit operations. It starts with the same `rlist` like the naive variant and then uses `ctz` to count the trailing zeros (the ones on the right side) which happen to be the equal to the index of the lowest set bit. `ctz` can be represented by a single processor instruction on most architectures (like [bsf](https://www.felixcloutier.com/x86/bsf) on x86) and is very efficient.

It can also be written as a combination of a [custom C++ iterator](https://github.com/jsmolka/eggvance/blob/9cae4676ed9927064c43a68cd178d265baf7e28b/eggvance/src/base/bits.h#L168) and a range-based for loop.

```cpp
for (uint x : bits::iter(rlist)) {
  // Do something
}
```

In the end this whole section could be titled 'premature optimization'. Implementing efficient bit iteration had a minuscule performance impact on two of many processor instructions and the overall performance impact was barely (if at all) noticable. However it was fun to think about.

### Emscripten

### Improving Tests

```cpp
u32 zero[2] = { 0x7E76663C, 0x003C666E };

// 0b00111100 -> ⬜⬜⬛⬛⬛⬛⬜⬜
// 0b01100110 -> ⬜⬛⬛⬜⬜⬛⬛⬜
// 0b01110110 -> ⬜⬛⬛⬜⬛⬛⬛⬜
// 0b01111110 -> ⬜⬛⬛⬛⬛⬛⬛⬜
// 0b01101110 -> ⬜⬛⬛⬛⬜⬛⬛⬜
// 0b01100110 -> ⬜⬛⬛⬜⬜⬛⬛⬜
// 0b00111100 -> ⬜⬜⬛⬛⬛⬛⬜⬜
// 0b00000000 -> ⬜⬜⬜⬜⬜⬜⬜⬜
```

```armasm
text_glyph_data:
        ; r0:   data, modified
        ; r1:   pointer, modified
        stmfd   sp!, {r2-r4, lr}        ; Function prologue
        mov     r2, 0                   ; Loop counter
.loop:
        and     r3, r0, 1               ; First bit
        lsr     r0, 1                   ; Advance in data
        and     r4, r0, 1               ; Second bit
        lsr     r0, 1                   ; Advance in data
        orr     r3, r4, ror 24          ; Move second bit
        strh    r3, [r1], 2             ; Write data, advance pointer
        add     r2, 2                   ; Advance loop counter
        tst     r2, 7                   ; Check for glyph line end
        addeq   r1, 232                 ; Move to next line
        cmp     r2, 32                  ; Check for loop end
        bne     .loop                   ; Loop or exit
        ldmfd   sp!, {r2-r4, pc}        ; Function epilogue
```
