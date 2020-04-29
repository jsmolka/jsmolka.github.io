function extendPrism() {
  Prism.languages.armasm = {
    comment: {
      pattern: /;.*/,
      greedy: true
    },
    keyword: /\b(?:r0|r1|r2|r3|r4|r5|r6|r7|r8|r9|r10|r11|r12|r13|r14|r15|pc|lr|sp|mov|mul|cmp|bne|beq)\b/,
    number: /\b0x[\da-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:e[+-]?\d+)?/i
  };

  function extendRegex(regex, item) {
    const items = regex.source.split('|');
    items.splice(1, 0, item);

    return new RegExp(items.join('|'));
  }

  Prism.languages.cpp.keyword = extendRegex(Prism.languages.cpp.keyword, 'u8|u16|u32|u64|s8|s16|s32|s64|uint');
  Prism.languages.cpp['class-name'].pattern = extendRegex(Prism.languages.cpp['class-name'].pattern, 'enum class');
}

extendPrism();
