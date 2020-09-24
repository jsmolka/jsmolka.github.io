(function() {
  Prism.languages.armv4 = {
    comment: {
      pattern: /;.*/,
      greedy: true
    },
    keyword: /\b(?:r(\d+)|pc|lr|sp)\b/,
    number: /\b0x[\da-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:e[+-]?\d+)?/i
  };

  const keywords = Prism.languages.cpp.keyword.source.split('|');
  keywords.splice(1, 0, 'u8|u16|u32|u64|s8|s16|s32|s64|uint');
  Prism.languages.cpp.keyword = new RegExp(keywords.join('|'));
})();
