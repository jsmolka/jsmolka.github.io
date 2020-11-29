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

### Undefined Behavior
code in Sapphire
```c
void sub_80560AC(struct MapHeader *mapHeader) {
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

code in Emerald
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
