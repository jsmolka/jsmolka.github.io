---
title: "Progress Report #6"
author: "Julian Smolka"
summary: "The sixth progress report of the eggvance GBA emulator."
date: 2020-11-04
type: post
draft: true
---
### Undefined Behavior
code in [Sapphire](https://github.com/pret/pokeruby/blob/master/src/fieldmap.c#L87)
```c
static void InitBackupMapLayoutConnections(struct MapHeader *mapHeader) {
  int count = mapHeader->connections->count;
  struct MapConnection *connection = mapHeader->connections->connections;
  int i;

  gMapConnectionFlags = sDummyConnectionFlags;
  for (i = 0; i < count; i++, connection++) {
    // Handle
  }
}
```

> BUG: This results in a null pointer dereference when mapHeader->connections is NULL, causing count to be assigned a garbage value. This garbage value just so happens to have the most significant bit set, so it is treated as negative and the loop below thankfully never executes in this scenario.

code in [Emerald](https://github.com/pret/pokeemerald/blob/master/src/fieldmap.c#L114)
```c
static void InitBackupMapLayoutConnections(struct MapHeader *mapHeader) {
  int count;
  struct MapConnection *connection;
  int i;

  if (mapHeader->connections) {
    count = mapHeader->connections->count;
    connection = mapHeader->connections->connections;
    gMapConnectionFlags = sDummyConnectionFlags;

    for (i = 0; i < count; i++, connection++) {
      // Handle
    }
  }
}
```

with real BIOS (post SWI)
```armv4t
movs      pc, lr          ; addr: 00000188  data: E1B0F00E
mov       r12, 0x4000000  ; addr: 0000018C  data: E3A0C301
mov       r2, 0x4         ; addr: 00000190  data: E3A02004
```


with Normmatt BIOS (post SWI)

```armv4t
movs      pc, lr                ; addr: 000000AC  data: E1B0F00E
andeq     r1, r0, r4, lsl 0x10  ; addr: 000000B0  data: 00001804
andeq     r1, r0, r4, lsr 0xA   ; addr: 000000B4  data: 00001524
```

Fixed by improving the `readUnused` function in [this](https://github.com/jsmolka/eggvance/commit/213c7ab0a18502125b725536c433da3bf90d0b84) commit.

{{<figures>}}
  {{<figure src="eggvance/sapphire-bad-bios-bug.png" caption="">}}
  {{<figure src="eggvance/sapphire-bad-bios.png" caption="">}}
{{</figures>}}

### Sprite Render Cycles
- credit [issue](https://github.com/jsmolka/eggvance/issues/2)

{{<figures>}}
  {{<figure src="eggvance/gunstar-sprite-cycles-bug.png" caption="">}}
  {{<figure src="eggvance/gunstar-sprite-cycles.png" caption="">}}
{{</figures>}}

### Real-Time Clock
{{<figures>}}
  {{<figure src="eggvance/emerald-berry-1.png" caption="">}}
  {{<figure src="eggvance/emerald-berry-2.png" caption="">}}
{{</figures>}}

- credit [issue](https://github.com/fleroviux/NanoboyAdvance/issues/136)

{{<figures>}}
  {{<figure src="eggvance/sennen-rtc-bug.png" caption="">}}
  {{<figure src="eggvance/sennen-rtc.png" caption="">}}
{{</figures>}}

- describe steps and what changed

```diff-cpp
 switch (state) {
   case State::InitOne:
-    if (port.cs.low() && port.sck.high())
+    if (port.cs.low())
       setState(State::InitTwo);
     break;

   // ...
 }
```

### Test Coverage
- DMA bus
- Memory read improvements
- Interrupt delay
- Timer delay
- Prefetch emulation

| Test           | eggvance 0.2 | eggvance 0.3 | mGBA 0.8.4 | higan v115 | Total |
|----------------|--------------|--------------|------------|------------|-------|
| Memory         | 1456         | 1552         | 1552       | 1552       | 1552  |
| I/O read       | 123          | 123          | 114        | 123        | 123   |
| Timing         | 404          | 1496         | 1520       | 1424       | 1660  |
| Timer count-up | 365          | 496          | 610        | 449        | 936   |
| Timer IRQ      | 28           | 65           | 70         | 36         | 90    |
| Shifter        | 140          | 140          | 132        | 132        | 140   |
| Carry          | 93           | 93           | 93         | 93         | 93    |
| Multiply long  | 52           | 52           | 52         | 52         | 72    |
| DMA            | 1048         | 1220         | 1232       | 1136       | 1256  |
| Edge case      | 1            | 2            | 6          | 1          | 10    |

Performance (Emerald Littleroot Town)
- 615 eggvance-786-0.2
- 635 eggvance-880-pre-prefetch
- 485 eggvance-902-prefetch
- 575 eggvance-906-inline
- 580 eggvance-913-0.3
