---
title: "Static Syntax Highlighting"
author: "Julian Smolka"
summary: "An approach to customizable static syntax highlighting in Hugo"
date: 2020-10-16
type: post
draft: true
---
Syntax highlighting is a must have for every programming related blog and there are many ways to achieve it in a dynamic or static manner. Of course Hugo comes with its own syntax highligther based on [chroma](https://github.com/alecthomas/chroma). It is more than enough for your everyday programming languages but lacks the necessary extensibility when working with custom stuff.

Let's take my posts about GBA emulation as an example. The GBA processor is based on the ARMv4T instruction set which is 20 years old at this point. Of course no sane syntax highlighting library out there supports that out of the box. The result is a bland character soup:

```none
multiply:               ; Label
    mov     r0, 4       ; r0 = 4
    mov     r1, 8       ; r1 = 8
    mul     r0, r0, r1  ; r0 = r0 * r1
    cmp     r0, 32      ; r0 == 32?
    beq     multiply    ; Jump if true
```

<!--
- prism
- extend prism
- conditionally include prism
- node script
- deploy script
--!>
