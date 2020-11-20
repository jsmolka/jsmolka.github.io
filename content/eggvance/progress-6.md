---
title: "Progress Report #6"
author: "Julian Smolka"
summary: "The sixth progress report of the eggvance GBA emulator."
date: 2020-11-04
type: post
draft: true
---
### Sprite Render Cycles
- credit [issue](https://github.com/jsmolka/eggvance/issues/2)

{{<figures>}}
  {{<figure src="eggvance/sprite-cycles-bug.png" caption="">}}
  {{<figure src="eggvance/sprite-cycles.png" caption="">}}
{{</figures>}}

### Real-Time Clock

{{<figures>}}
  {{<figure src="eggvance/emerald-berry-1.png" caption="">}}
  {{<figure src="eggvance/emerald-berry-2.png" caption="">}}
{{</figures>}}

- credit [issue](https://github.com/fleroviux/NanoboyAdvance/issues/136)

{{<figures>}}
  {{<figure src="eggvance/sennen-rtc-bad.png" caption="">}}
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

### Unused ROM Access
