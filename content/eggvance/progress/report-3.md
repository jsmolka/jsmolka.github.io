---
title: "Progress Report #3"
date: 2019-11-03
draft: false
tags:
    - eggvance
    - emulation
    - progress-report
---
This month in an average emulator: a complete rewrite. That’s what happens when you aren’t satisfied with your project and you have a whole month of spare time. Some parts have been reused but almost every area has been improved to some extent, accuracy and performance-wise.

### Optimizing Instruction Execution
The GBA's processor can execute either 16-bit Thumb or 32-bit Arm instructions. The most significant byte (see figure 1) of a Thumb instruction is sufficient for figuring out its format. The entire least significant and parts of the most significant byte are used to encode things like flags, registers and immediate values.

<div style="display: flex; justify-content: space-evenly">
    <figure style="width: 95%">
        <img src="/img/thumb_format.png">
        <figcaption>Figure 1 - Thumb format (extract)</figcaption>
    </figure>
</div>

In the previous version of the emulator decoding and executing an instruction were two separate steps. First a static array of enumerations was used to identify the instruction format and then a switch-case executed the matching function. This approach can be optimized by storing template function pointers inside the array. Flags, registers and immediate values which occur inside the ten (extended from eight) most significant bits can be passed as template parameters and are therefore optimized by the compiler.

```cpp
std::array<void(ARM::*)(u16), 1024> ARM::instr_thumb =
{
    &ARM::Thumb_MoveShiftedRegister<0, 0>,
    &ARM::Thumb_MoveShiftedRegister<1, 0>,
    &ARM::Thumb_MoveShiftedRegister<2, 0>,
    &ARM::Thumb_MoveShiftedRegister<3, 0>,
    &ARM::Thumb_MoveShiftedRegister<4, 0>,
    &ARM::Thumb_MoveShiftedRegister<5, 0>,
    &ARM::Thumb_MoveShiftedRegister<6, 0>,
    &ARM::Thumb_MoveShiftedRegister<7, 0>,
    &ARM::Thumb_MoveShiftedRegister<8, 0>,
    &ARM::Thumb_MoveShiftedRegister<9, 0>,
    // ...
}
```

### Initializing (Unused) Registers
At some point in development the emulator was able to boot every tested game apart from the Sonic Advance titles. Resolving issues like this usually involves running my emulator against established emulators like No$GBA (which has an awesome debug version). After two hours of comparing I ended up noticing that a different value of the register RCNT (which is used for multiplayer functionality) caused a chain of events which led to the screen shown in figure 2.

<div style="display: flex; justify-content: space-evenly">
    <figure style="width: 45%">
        <img src="/img/sonic_bug.png">
        <figcaption>Figure 2 - Uninitialized RCNT</figcaption>
    </figure>
    <figure style="width: 45%">
        <img src="/img/sonic.png">
        <figcaption>Figure 3 - Initalized RCNT</figcaption>
    </figure>
</div>

Source of this problem was not running the BIOS first and directly jumping inside the ROM. Apart from showing the animated intro, the BIOS also initializes registers like RCNT, DISPCNT and KEYINPUT to their default values. RCNT is currently not used in the emulator and was forgotten when setting registers to their post-BIOS values. Running the BIOS could've spared me those hours but that isn't something I usually do during development.

### Fixing Arithmetic Operations
Running mGBA's [test suite](https://github.com/mgba-emu/suite) made be realize flaws in my carry / overflow detection mechanism for arithmetic operations, which caused sprite flickering bugs in games like Mario Kart. The basic add, subtract and reverse subtract operations were doing fine, but their "[operation] with carry" counterparts resulted in a wrong carry or overflow flag. I found a nice [website](http://teaching.idallen.com/dat2343/10f/notes/040_overflow.txt) which explains overflow detection for basic addition and subtraction.

```cpp
#define ZERO(x) x == 0
#define SIGN(x) x >> 31

#define CARRY_ADD(op1, op2) op2 > 0xFFFFFFFF - op1
#define CARRY_SUB(op1, op2) op2 <= op1

#define OVERFLOW_ADD(op1, op2, res) SIGN(op1) == SIGN(op2) && SIGN(res) != SIGN(op1)
#define OVERFLOW_SUB(op1, op2, res) SIGN(op1) != SIGN(op2) && SIGN(res) == SIGN(op2)
```

The macros shown above can be used to set flags of the CPSR (Current Program Status Register). They work perfectly fine for simple add and subtract operations.

```cpp
u32 ARM::add(u32 op1, u32 op2, bool flags)
{
    u32 result = op1 + op2;

    if (flags)
    {
        cpsr.z = ZERO(result);
        cpsr.n = SIGN(result);
        cpsr.c = CARRY_ADD(op1, op2);
        cpsr.v = OVERFLOW_ADD(op1, op2, result);
    }
    return result;
}
```

I used the function above for addition with and without carry. It worked most of the time (I thought all the time) and didn't cause any major bugs in the tested games. Now imagine adding the carry to a value of `0xFFFF'FFFF`. It overflows if the carry is set, and we pass `0` to the `add` function which produces the correct result but calculates wrong carry and overflow flags for certain operands.

```cpp
u32 ARM::adc(u64 op1, u64 op2, bool flags)
{
    u64 opc = op2 + cpsr.c;

    u32 result = static_cast<u32>(op1 + opc);

    if (flags)
    {
        cpsr.z = ZERO(result);
        cpsr.n = SIGN(result);
        cpsr.c = CARRY_ADD(op1, opc);
        cpsr.v = OVERFLOW_ADD(op1, op2, result);
    }
    return result;
}
```

Changing the argument types of the `add` function from 32-bit to 64-bit integers fixed some of the bugs, but not all. Comparing my results to the expected results made me realize that the carry flag is only taken into consideration for carry detection and completely ignored for overflow detection. The code above shows my final `adc` function (note the usage of `opc`).

<div style="display: flex; justify-content: space-evenly">
    <figure style="width: 45%">
        <img src="/img/carry_pre.png">
        <figcaption>Figure 4 - Carry tests pre fix</figcaption>
    </figure>
    <figure style="width: 45%">
        <img src="/img/carry_post.png">
        <figcaption>Figure 5 - Carry tests post fix</figcaption>
    </figure>
</div>

### Config
One thing is really wanted to have in the first release version was a customizable config. In terms of format I decided to go with [TOML](https://github.com/toml-lang/toml) because I really like its general structure and clarity. The config allows the user freely configure keyboard and controller mappings for general input and shortcuts like fullscreen and different emulation speeds. A snippet of the general options is shown below and the full version can be found on [GitHub](https://github.com/jsmolka/eggvance/blob/f2a1e0311e5467b3b91fa69b6ab4a7ddc292f525/eggvance/eggvance.toml).

```
[general]
# Relative or absolute BIOS file.
bios_file = "bios.bin"
# Skips the BIOS intro.
bios_skip = false
# Relative or absolute save directory.
# An empty value stores save files next to the ROM.
save_dir = ""
# Controller deadzone.
deadzone = 16000
```

### Conclusion

That's all for this progress report. A Windows build for the latest version can be found [here](https://github.com/jsmolka/eggvance/releases). I used profile guided optimization to squeeze out the last drop of performance (most games can be played at 10x the normal speed). Of course the current version is not perfect and bug free, audio is still missing and there are crashes and visual bugs in a few games like DOOM II.

<div style="display: flex; justify-content: space-evenly">
    <figure style="width: 45%">
        <img src="/img/doom_swr1.png">
        <figcaption>Figure 6 - DOOM Software Renderer 1</figcaption>
    </figure>
    <figure style="width: 45%">
        <img src="/img/doom_swr2.png">
        <figcaption>Figure 7 - DOOM Software Renderer 2</figcaption>
    </figure>
</div>
