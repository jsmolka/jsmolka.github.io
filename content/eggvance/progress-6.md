---
title: "Progress Report #6"
author: "Julian Smolka"
summary: "The sixth progress report of the eggvance GBA emulator."
date: 2021-01-09
type: post
draft: true
---
<!-- Pokemon é -->
2020 came to an end and left me with an output of two progress reports and a simple, short release note. That's less than I was hoping for but most time this year went into improving the code base and some peformance tinkering for personal plesure. In my defense the last progress report had much higher quality than the previous ones and I'd like to keep it this way!

### Undefined Behavior
In that spirit, let's start with an [issue](https://github.com/jsmolka/eggvance/issues/4) which has been reported by fleroviux in June last year. He tried to play Pokemon Sapphire and his game froze right after the intro sequence when the character shrinks in size and then enters the world in a moving truck. The same also happens in Ruby because they are essentially the same game.

{{<figures>}}
  {{<figure src="eggvance/sapphire-bad-bios-bug.png" caption="Figure 1: Freezing during intro sequence">}}
  {{<figure src="eggvance/sapphire-bad-bios.png" caption="Figure 2: In the truck where we belong">}}
{{</figures>}}

He used the bundled replacement BIOS where bugs in games are to be expected. I tried it with the original one and the freezing stopped happening. So I closed the issue and blamed the BIOS for doing some unexpected things but he quickly reassured me that the bug wasn't happening in his emulator or mGBA when using the same BIOS. I verified that and was left scatching my head about the possible origin of this problem.

I figured it had something to do with the BIOS implementation but I couldn't find anything wrong with it. Many failed attemps later GitHub suggested me the [pret](https://github.com/pret) project which is the decompilation of all GB, GBA and even some NDS Pokemon games. I can't believe how people do such things but I'll gladly use their work to fix bugs in my emulator. I skimmed through the into sequence related parts of the code and [this function](https://github.com/pret/pokeruby/blob/master/src/fieldmap.c#L87):

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

At first glance there seems to be nothing wrong this it but this comment doesn't agree:

> BUG: This results in a null pointer dereference when mapHeader->connections is NULL, causing count to be assigned a garbage value. This garbage value just so happens to have the most significant bit set, so it is treated as negative and the loop below thankfully never executes in this scenario.

I never ran into this bug during testing because it has been fixed in [Pokemon Emerald](https://github.com/pret/pokeemerald/blob/master/src/fieldmap.c#L114) and that's the game I usually use for quick testing (and pure nostalgia). The deferenced null pointer returns something they call garbage, which is quite offensive to the poor BIOS in my opinion. Why the BIOS? Because it starts at address 0 and that's where a dereferenced null pointer reads from.

```
00000000-00003FFF   BIOS - System ROM
00004000-01FFFFFF   Not used
02000000-0203FFFF   WRAM - On-board Work RAM
02040000-02FFFFFF   Not used
03000000-03007FFF   WRAM - On-chip Work RAM
03008000-03FFFFFF   Not used
04000000-040003FE   I/O Registers
04000400-04FFFFFF   Not used
```

The BIOS in the Game Boy Advance is read protected to prevent dumping (guess how that turned out). It means that we can only read from the BIOS if the program counter is inside of it. Otherwise it will return the last read value which will the be the one located at address

- 0x0DC+8 after startup
- 0x188+8 after SWI
- 0x134+8 during IRQ
- 0x13C+8 after IRQ

In the case of our dereferenced null pointer we've just returned from a SWI. The code for this in the original BIOS looks like the following:

```armv4t
movs      pc, lr          ; addr: 00000188  data: E1B0F00E
mov       r12, 0x4000000  ; addr: 0000018C  data: E3A0C301
mov       r2, 0x4         ; addr: 00000190  data: E3A02004
```

It uses the instruction `movs pc, lr` to move the link register into the program counter. The link register contains the next instruction after a function call so it pretty much acts your typical `return`. Because of the GBAs two staged instruction pipeline we've already fetched the value at address 0x190 and it's value will be returned for future protected BIOS reads (like dereferenced nullpointers). In this case the value has it's sign bit set and the loop is never excuted.

```armv4t
movs      pc, lr                ; addr: 000000AC  data: E1B0F00E
andeq     r1, r0, r4, lsl 0x10  ; addr: 000000B0  data: 00001804
andeq     r1, r0, r4, lsr 0xA   ; addr: 000000B4  data: 00001524
```

Unfortunately the replacement BIOS doesn't reproduce this behavior. Here we return with the same instruction but the prefetched value now is positive and we run the loop 1524 times. Up until this point the emulator did every correctly and the bug hunt ends with an anticlimactic result.

I fixed the bug when working on something completely different. Reads from unused memory regions return values based on prefetched values in the CPUs pipeline. There were some small issues in that code which were fixed in [this commit](https://github.com/jsmolka/eggvance/commit/213c7ab0a18502125b725536c433da3bf90d0b84). It seems that the game tries to access unused memory regions at some point when running the loop with the wrong loop counter and returnig "proper bad value" fixes the freezing behavior.

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
- Prefetch emulation (not perfect)

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

### Conclusion
<!-- Roadmap -->
