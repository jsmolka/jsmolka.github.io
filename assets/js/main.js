function extendPrism() {
  Prism.languages.armasm = {
    comment: {
      pattern: /;.*/,
      greedy: true
    },
    keyword: /\b(?:r(\d+)|pc|lr|sp)\b/,
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
