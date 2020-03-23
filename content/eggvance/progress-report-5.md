---
title: "Progress Report #5"
author: "Julian Smolka"
summary: "Progress report #1 of the eggvance GBA emulator."
date: 2020-02-16
type: posts
draft: true
---

### Improving ARM Performance

<table>
  <tr>
    <th style="width: 15%">Commit</th>
    <th style="width: 35%">Related change</th>
    <th style="width: 25%">Pokemon Emerald</th>
    <th style="width: 25%">Yoshi's Island</th>
  </tr>
  <tr>
    <td>441</td>
    <td>Baseline</td>
    <td>432.1 fps</td>
    <td>455.0 fps</td>
  </tr>
  <tr>
    <td>462</td>
    <td>GPR class removed</td>
    <td>460.8 fps</td>
    <td>481.7 fps</td>
  </tr>
  <tr>
    <td>479</td>
    <td>Instruction templates</td>
    <td>489.4 fps</td>
    <td>511.7 fps</td>
  </tr>
  <tr>
    <td>482</td>
    <td>Basic dispatching</td>
    <td>522.8 fps</td>
    <td>542.1 fps</td>
  </tr>
  <tr>
    <td>483</td>
    <td>Improved dispatching</td>
    <td>556.9 fps</td>
    <td>574.4 fps</td>
  </tr>
</table>
