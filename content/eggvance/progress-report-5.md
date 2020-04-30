---
title: "Progress Report #5"
author: "Julian Smolka"
summary: "Progress report #5 of the eggvance GBA emulator."
date: 2020-04-30
type: post
draft: true
---
### Improving Performance
| Commit | Hash                                                                                            | Improvement           | Pokémon Emerald | Yoshi's Island |
|--------|-------------------------------------------------------------------------------------------------|-----------------------|-----------------|----------------|
| 441    | [368955c0](https://github.com/jsmolka/eggvance/commit/368955c02f911243aaf2b2e8dfc9ce9d849b8f93) | Baseline              | 432.1 fps       | 455.0 fps      |
| 462    | [7007ab8a](https://github.com/jsmolka/eggvance/commit/7007ab8a2a9721cf47c437fb20d4f1e2e560fc43) | GPR class removed     | 460.8 fps       | 481.7 fps      |
| 479    | [fc00b845](https://github.com/jsmolka/eggvance/commit/fc00b845df0963aca0ddfcf4598a5672ac930d8f) | Instruction templates | 489.4 fps       | 511.7 fps      |
| 482    | [a3a8fca2](https://github.com/jsmolka/eggvance/commit/a3a8fca2c0ee01024668d77e817e05470b4eac94) | Basic dispatching     | 522.8 fps       | 542.1 fps      |
| 483    | [326b4809](https://github.com/jsmolka/eggvance/commit/326b4809b398f051807a93b2bc4e9879fef60567) | Improved dispatching  | 556.9 fps       | 574.4 fps      |

### Emscripten

### Efficient Bit Iteration
