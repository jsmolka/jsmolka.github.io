/* PrismJS 1.17.1
https://prismjs.com/download.html#themes=prism-solarizedlight&languages=clike+c+cpp+toml */
var _self = (typeof window !== 'undefined')
  ? window   // if in browser
  : (
    (typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope)
    ? self // if in worker
    : {}   // if in node js
  );

/**
 * Prism: Lightweight, robust, elegant syntax highlighting
 * MIT license http://www.opensource.org/licenses/mit-license.php/
 * @author Lea Verou http://lea.verou.me
 */

var Prism = (function (_self){

// Private helper vars
var lang = /\blang(?:uage)?-([\w-]+)\b/i;
var uniqueId = 0;


var _ = {
  manual: _self.Prism && _self.Prism.manual,
  disableWorkerMessageHandler: _self.Prism && _self.Prism.disableWorkerMessageHandler,
  util: {
    encode: function (tokens) {
      if (tokens instanceof Token) {
        return new Token(tokens.type, _.util.encode(tokens.content), tokens.alias);
      } else if (Array.isArray(tokens)) {
        return tokens.map(_.util.encode);
      } else {
        return tokens.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\u00a0/g, ' ');
      }
    },

    type: function (o) {
      return Object.prototype.toString.call(o).slice(8, -1);
    },

    objId: function (obj) {
      if (!obj['__id']) {
        Object.defineProperty(obj, '__id', { value: ++uniqueId });
      }
      return obj['__id'];
    },

    // Deep clone a language definition (e.g. to extend it)
    clone: function deepClone(o, visited) {
      var clone, id, type = _.util.type(o);
      visited = visited || {};

      switch (type) {
        case 'Object':
          id = _.util.objId(o);
          if (visited[id]) {
            return visited[id];
          }
          clone = {};
          visited[id] = clone;

          for (var key in o) {
            if (o.hasOwnProperty(key)) {
              clone[key] = deepClone(o[key], visited);
            }
          }

          return clone;

        case 'Array':
          id = _.util.objId(o);
          if (visited[id]) {
            return visited[id];
          }
          clone = [];
          visited[id] = clone;

          o.forEach(function (v, i) {
            clone[i] = deepClone(v, visited);
          });

          return clone;

        default:
          return o;
      }
    },

    /**
     * Returns the Prism language of the given element set by a `language-xxxx` or `lang-xxxx` class.
     *
     * If no language is set for the element or the element is `null` or `undefined`, `none` will be returned.
     *
     * @param {Element} element
     * @returns {string}
     */
    getLanguage: function (element) {
      while (element && !lang.test(element.className)) {
        element = element.parentElement;
      }
      if (element) {
        return (element.className.match(lang) || [, 'none'])[1].toLowerCase();
      }
      return 'none';
    },

    /**
     * Returns the script element that is currently executing.
     *
     * This does __not__ work for line script element.
     *
     * @returns {HTMLScriptElement | null}
     */
    currentScript: function () {
      if (typeof document === 'undefined') {
        return null;
      }
      if ('currentScript' in document) {
        return document.currentScript;
      }

      // IE11 workaround
      // we'll get the src of the current script by parsing IE11's error stack trace
      // this will not work for inline scripts

      try {
        throw new Error();
      } catch (err) {
        // Get file src url from stack. Specifically works with the format of stack traces in IE.
        // A stack will look like this:
        //
        // Error
        //    at _.util.currentScript (http://localhost/components/prism-core.js:119:5)
        //    at Global code (http://localhost/components/prism-core.js:606:1)

        var src = (/at [^(\r\n]*\((.*):.+:.+\)$/i.exec(err.stack) || [])[1];
        if (src) {
          var scripts = document.getElementsByTagName('script');
          for (var i in scripts) {
            if (scripts[i].src == src) {
              return scripts[i];
            }
          }
        }
        return null;
      }
    }
  },

  languages: {
    extend: function (id, redef) {
      var lang = _.util.clone(_.languages[id]);

      for (var key in redef) {
        lang[key] = redef[key];
      }

      return lang;
    },

    /**
     * Insert a token before another token in a language literal
     * As this needs to recreate the object (we cannot actually insert before keys in object literals),
     * we cannot just provide an object, we need an object and a key.
     * @param inside The key (or language id) of the parent
     * @param before The key to insert before.
     * @param insert Object with the key/value pairs to insert
     * @param root The object that contains `inside`. If equal to Prism.languages, it can be omitted.
     */
    insertBefore: function (inside, before, insert, root) {
      root = root || _.languages;
      var grammar = root[inside];
      var ret = {};

      for (var token in grammar) {
        if (grammar.hasOwnProperty(token)) {

          if (token == before) {
            for (var newToken in insert) {
              if (insert.hasOwnProperty(newToken)) {
                ret[newToken] = insert[newToken];
              }
            }
          }

          // Do not insert token which also occur in insert. See #1525
          if (!insert.hasOwnProperty(token)) {
            ret[token] = grammar[token];
          }
        }
      }

      var old = root[inside];
      root[inside] = ret;

      // Update references in other language definitions
      _.languages.DFS(_.languages, function(key, value) {
        if (value === old && key != inside) {
          this[key] = ret;
        }
      });

      return ret;
    },

    // Traverse a language definition with Depth First Search
    DFS: function DFS(o, callback, type, visited) {
      visited = visited || {};

      var objId = _.util.objId;

      for (var i in o) {
        if (o.hasOwnProperty(i)) {
          callback.call(o, i, o[i], type || i);

          var property = o[i],
              propertyType = _.util.type(property);

          if (propertyType === 'Object' && !visited[objId(property)]) {
            visited[objId(property)] = true;
            DFS(property, callback, null, visited);
          }
          else if (propertyType === 'Array' && !visited[objId(property)]) {
            visited[objId(property)] = true;
            DFS(property, callback, i, visited);
          }
        }
      }
    }
  },
  plugins: {},

  highlightAll: function(async, callback) {
    _.highlightAllUnder(document, async, callback);
  },

  highlightAllUnder: function(container, async, callback) {
    var env = {
      callback: callback,
      container: container,
      selector: 'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'
    };

    _.hooks.run('before-highlightall', env);

    env.elements = Array.prototype.slice.apply(env.container.querySelectorAll(env.selector));

    _.hooks.run('before-all-elements-highlight', env);

    for (var i = 0, element; element = env.elements[i++];) {
      _.highlightElement(element, async === true, env.callback);
    }
  },

  highlightElement: function(element, async, callback) {
    // Find language
    var language = _.util.getLanguage(element);
    var grammar = _.languages[language];

    // Set language on the element, if not present
    element.className = element.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language;

    // Set language on the parent, for styling
    var parent = element.parentNode;
    if (parent && parent.nodeName.toLowerCase() === 'pre') {
      parent.className = parent.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language;
    }

    var code = element.textContent;

    var env = {
      element: element,
      language: language,
      grammar: grammar,
      code: code
    };

    function insertHighlightedCode(highlightedCode) {
      env.highlightedCode = highlightedCode;

      _.hooks.run('before-insert', env);

      env.element.innerHTML = env.highlightedCode;

      _.hooks.run('after-highlight', env);
      _.hooks.run('complete', env);
      callback && callback.call(env.element);
    }

    _.hooks.run('before-sanity-check', env);

    if (!env.code) {
      _.hooks.run('complete', env);
      callback && callback.call(env.element);
      return;
    }

    _.hooks.run('before-highlight', env);

    if (!env.grammar) {
      insertHighlightedCode(_.util.encode(env.code));
      return;
    }

    if (async && _self.Worker) {
      var worker = new Worker(_.filename);

      worker.onmessage = function(evt) {
        insertHighlightedCode(evt.data);
      };

      worker.postMessage(JSON.stringify({
        language: env.language,
        code: env.code,
        immediateClose: true
      }));
    }
    else {
      insertHighlightedCode(_.highlight(env.code, env.grammar, env.language));
    }
  },

  highlight: function (text, grammar, language) {
    var env = {
      code: text,
      grammar: grammar,
      language: language
    };
    _.hooks.run('before-tokenize', env);
    env.tokens = _.tokenize(env.code, env.grammar);
    _.hooks.run('after-tokenize', env);
    return Token.stringify(_.util.encode(env.tokens), env.language);
  },

  matchGrammar: function (text, strarr, grammar, index, startPos, oneshot, target) {
    for (var token in grammar) {
      if (!grammar.hasOwnProperty(token) || !grammar[token]) {
        continue;
      }

      var patterns = grammar[token];
      patterns = Array.isArray(patterns) ? patterns : [patterns];

      for (var j = 0; j < patterns.length; ++j) {
        if (target && target == token + ',' + j) {
          return;
        }

        var pattern = patterns[j],
          inside = pattern.inside,
          lookbehind = !!pattern.lookbehind,
          greedy = !!pattern.greedy,
          lookbehindLength = 0,
          alias = pattern.alias;

        if (greedy && !pattern.pattern.global) {
          // Without the global flag, lastIndex won't work
          var flags = pattern.pattern.toString().match(/[imsuy]*$/)[0];
          pattern.pattern = RegExp(pattern.pattern.source, flags + 'g');
        }

        pattern = pattern.pattern || pattern;

        // Don’t cache length as it changes during the loop
        for (var i = index, pos = startPos; i < strarr.length; pos += strarr[i].length, ++i) {

          var str = strarr[i];

          if (strarr.length > text.length) {
            // Something went terribly wrong, ABORT, ABORT!
            return;
          }

          if (str instanceof Token) {
            continue;
          }

          if (greedy && i != strarr.length - 1) {
            pattern.lastIndex = pos;
            var match = pattern.exec(text);
            if (!match) {
              break;
            }

            var from = match.index + (lookbehind && match[1] ? match[1].length : 0),
                to = match.index + match[0].length,
                k = i,
                p = pos;

            for (var len = strarr.length; k < len && (p < to || (!strarr[k].type && !strarr[k - 1].greedy)); ++k) {
              p += strarr[k].length;
              // Move the index i to the element in strarr that is closest to from
              if (from >= p) {
                ++i;
                pos = p;
              }
            }

            // If strarr[i] is a Token, then the match starts inside another Token, which is invalid
            if (strarr[i] instanceof Token) {
              continue;
            }

            // Number of tokens to delete and replace with the new match
            delNum = k - i;
            str = text.slice(pos, p);
            match.index -= pos;
          } else {
            pattern.lastIndex = 0;

            var match = pattern.exec(str),
              delNum = 1;
          }

          if (!match) {
            if (oneshot) {
              break;
            }

            continue;
          }

          if(lookbehind) {
            lookbehindLength = match[1] ? match[1].length : 0;
          }

          var from = match.index + lookbehindLength,
              match = match[0].slice(lookbehindLength),
              to = from + match.length,
              before = str.slice(0, from),
              after = str.slice(to);

          var args = [i, delNum];

          if (before) {
            ++i;
            pos += before.length;
            args.push(before);
          }

          var wrapped = new Token(token, inside? _.tokenize(match, inside) : match, alias, match, greedy);

          args.push(wrapped);

          if (after) {
            args.push(after);
          }

          Array.prototype.splice.apply(strarr, args);

          if (delNum != 1)
            _.matchGrammar(text, strarr, grammar, i, pos, true, token + ',' + j);

          if (oneshot)
            break;
        }
      }
    }
  },

  tokenize: function(text, grammar) {
    var strarr = [text];

    var rest = grammar.rest;

    if (rest) {
      for (var token in rest) {
        grammar[token] = rest[token];
      }

      delete grammar.rest;
    }

    _.matchGrammar(text, strarr, grammar, 0, 0, false);

    return strarr;
  },

  hooks: {
    all: {},

    add: function (name, callback) {
      var hooks = _.hooks.all;

      hooks[name] = hooks[name] || [];

      hooks[name].push(callback);
    },

    run: function (name, env) {
      var callbacks = _.hooks.all[name];

      if (!callbacks || !callbacks.length) {
        return;
      }

      for (var i=0, callback; callback = callbacks[i++];) {
        callback(env);
      }
    }
  },

  Token: Token
};

_self.Prism = _;

function Token(type, content, alias, matchedStr, greedy) {
  this.type = type;
  this.content = content;
  this.alias = alias;
  // Copy of the full string this token was created from
  this.length = (matchedStr || '').length|0;
  this.greedy = !!greedy;
}

Token.stringify = function(o, language) {
  if (typeof o == 'string') {
    return o;
  }

  if (Array.isArray(o)) {
    return o.map(function(element) {
      return Token.stringify(element, language);
    }).join('');
  }

  var env = {
    type: o.type,
    content: Token.stringify(o.content, language),
    tag: 'span',
    classes: ['token', o.type],
    attributes: {},
    language: language
  };

  if (o.alias) {
    var aliases = Array.isArray(o.alias) ? o.alias : [o.alias];
    Array.prototype.push.apply(env.classes, aliases);
  }

  _.hooks.run('wrap', env);

  var attributes = Object.keys(env.attributes).map(function(name) {
    return name + '="' + (env.attributes[name] || '').replace(/"/g, '&quot;') + '"';
  }).join(' ');

  return '<' + env.tag + ' class="' + env.classes.join(' ') + '"' + (attributes ? ' ' + attributes : '') + '>' + env.content + '</' + env.tag + '>';
};

if (!_self.document) {
  if (!_self.addEventListener) {
    // in Node.js
    return _;
  }

  if (!_.disableWorkerMessageHandler) {
    // In worker
    _self.addEventListener('message', function (evt) {
      var message = JSON.parse(evt.data),
        lang = message.language,
        code = message.code,
        immediateClose = message.immediateClose;

      _self.postMessage(_.highlight(code, _.languages[lang], lang));
      if (immediateClose) {
        _self.close();
      }
    }, false);
  }

  return _;
}

//Get current script and highlight
var script = _.util.currentScript();

if (script) {
  _.filename = script.src;

  if (script.hasAttribute('data-manual')) {
    _.manual = true;
  }
}

if (!_.manual) {
  function highlightAutomaticallyCallback() {
    if (!_.manual) {
      _.highlightAll();
    }
  }

  // If the document state is "loading", then we'll use DOMContentLoaded.
  // If the document state is "interactive" and the prism.js script is deferred, then we'll also use the
  // DOMContentLoaded event because there might be some plugins or languages which have also been deferred and they
  // might take longer one animation frame to execute which can create a race condition where only some plugins have
  // been loaded when Prism.highlightAll() is executed, depending on how fast resources are loaded.
  // See https://github.com/PrismJS/prism/issues/2102
  var readyState = document.readyState;
  if (readyState === 'loading' || readyState === 'interactive' && script && script.defer) {
    document.addEventListener('DOMContentLoaded', highlightAutomaticallyCallback);
  } else {
    if (window.requestAnimationFrame) {
      window.requestAnimationFrame(highlightAutomaticallyCallback);
    } else {
      window.setTimeout(highlightAutomaticallyCallback, 16);
    }
  }
}

return _;

})(_self);

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Prism;
}

// hack for components to work correctly in node.js
if (typeof global !== 'undefined') {
  global.Prism = Prism;
}
;
Prism.languages.clike = {
  'comment': [
    {
      pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
      lookbehind: true
    },
    {
      pattern: /(^|[^\\:])\/\/.*/,
      lookbehind: true,
      greedy: true
    }
  ],
  'string': {
    pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
    greedy: true
  },
  'class-name': {
    pattern: /(\b(?:class|interface|extends|implements|trait|instanceof|new)\s+|\bcatch\s+\()[\w.\\]+/i,
    lookbehind: true,
    inside: {
      'punctuation': /[.\\]/
    }
  },
  'keyword': /\b(?:if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/,
  'boolean': /\b(?:true|false)\b/,
  'function': /\w+(?=\()/,
  'number': /\b0x[\da-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:e[+-]?\d+)?/i,
  'operator': /[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/,
  'punctuation': /[{}[\];(),.:]/
};

Prism.languages.c = Prism.languages.extend('clike', {
  'class-name': {
    pattern: /(\b(?:enum|struct)\s+)\w+/,
    lookbehind: true
  },
  'keyword': /\b(?:_Alignas|_Alignof|_Atomic|_Bool|_Complex|_Generic|_Imaginary|_Noreturn|_Static_assert|_Thread_local|asm|typeof|inline|auto|break|case|char|const|continue|default|do|double|else|enum|extern|float|for|goto|if|int|long|register|return|short|signed|sizeof|static|struct|switch|typedef|union|unsigned|void|volatile|while)\b/,
  'operator': />>=?|<<=?|->|([-+&|:])\1|[?:~]|[-+*/%&|^!=<>]=?/,
  'number': /(?:\b0x(?:[\da-f]+\.?[\da-f]*|\.[\da-f]+)(?:p[+-]?\d+)?|(?:\b\d+\.?\d*|\B\.\d+)(?:e[+-]?\d+)?)[ful]*/i
});

Prism.languages.insertBefore('c', 'string', {
  'macro': {
    // allow for multiline macro definitions
    // spaces after the # character compile fine with gcc
    pattern: /(^\s*)#\s*[a-z]+(?:[^\r\n\\]|\\(?:\r\n|[\s\S]))*/im,
    lookbehind: true,
    alias: 'property',
    inside: {
      // highlight the path of the include statement as a string
      'string': {
        pattern: /(#\s*include\s*)(?:<.+?>|("|')(?:\\?.)+?\2)/,
        lookbehind: true
      },
      // highlight macro directives as keywords
      'directive': {
        pattern: /(#\s*)\b(?:define|defined|elif|else|endif|error|ifdef|ifndef|if|import|include|line|pragma|undef|using)\b/,
        lookbehind: true,
        alias: 'keyword'
      }
    }
  },
  // highlight predefined macros as constants
  'constant': /\b(?:__FILE__|__LINE__|__DATE__|__TIME__|__TIMESTAMP__|__func__|EOF|NULL|SEEK_CUR|SEEK_END|SEEK_SET|stdin|stdout|stderr)\b/
});

delete Prism.languages.c['boolean'];

Prism.languages.cpp = Prism.languages.extend('c', {
  'class-name': {
    pattern: /(\b(?:class|enum|struct)\s+)\w+/,
    lookbehind: true
  },
  'keyword': /\b(?:u8|u16|u32|u64|s8|s16|s32|s64|alignas|alignof|asm|auto|bool|break|case|catch|char|char16_t|char32_t|class|compl|const|constexpr|const_cast|continue|decltype|default|delete|do|double|dynamic_cast|else|enum|explicit|export|extern|float|for|friend|goto|if|inline|int|int8_t|int16_t|int32_t|int64_t|uint8_t|uint16_t|uint32_t|uint64_t|long|mutable|namespace|new|noexcept|nullptr|operator|private|protected|public|register|reinterpret_cast|return|short|signed|sizeof|static|static_assert|static_cast|struct|switch|template|this|thread_local|throw|try|typedef|typeid|typename|union|unsigned|using|virtual|void|volatile|wchar_t|while)\b/,
  'number': {
    pattern: /(?:\b0b[01']+|\b0x(?:[\da-f']+\.?[\da-f']*|\.[\da-f']+)(?:p[+-]?[\d']+)?|(?:\b[\d']+\.?[\d']*|\B\.[\d']+)(?:e[+-]?[\d']+)?)[ful]*/i,
    greedy: true
  },
  'operator': />>=?|<<=?|->|([-+&|:])\1|[?:~]|[-+*/%&|^!=<>]=?|\b(?:and|and_eq|bitand|bitor|not|not_eq|or|or_eq|xor|xor_eq)\b/,
  'boolean': /\b(?:true|false)\b/
});

Prism.languages.insertBefore('cpp', 'string', {
  'raw-string': {
    pattern: /R"([^()\\ ]{0,16})\([\s\S]*?\)\1"/,
    alias: 'string',
    greedy: true
  }
});

(function (Prism) {

  // pattern: /(?:[\w-]+|'[^'\n\r]*'|"(?:\.|[^\\"\r\n])*")/
  var key = "(?:[\\w-]+|'[^'\n\r]*'|\"(?:\\.|[^\\\\\"\r\n])*\")";

  Prism.languages.toml = {
    'comment': {
      pattern: /#.*/,
      greedy: true
    },
    'table': {
      pattern: RegExp("(^\\s*\\[\\s*(?:\\[\\s*)?)" + key + "(?:\\s*\\.\\s*" + key + ")*(?=\\s*\\])", "m"),
      lookbehind: true,
      greedy: true,
      alias: 'class-name'
    },
    'key': {
      pattern: RegExp("(^\\s*|[{,]\\s*)" + key + "(?:\\s*\\.\\s*" + key + ")*(?=\\s*=)", "m"),
      lookbehind: true,
      greedy: true,
      alias: 'property'
    },
    'string': {
      pattern: /"""(?:\\[\s\S]|[^\\])*?"""|'''[\s\S]*?'''|'[^'\n\r]*'|"(?:\\.|[^\\"\r\n])*"/,
      greedy: true
    },
    'date': [
      {
        // Offset Date-Time, Local Date-Time, Local Date
        pattern: /\d{4}-\d{2}-\d{2}(?:[T\s]\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})?)?/i,
        alias: 'number'
      },
      {
        // Local Time
        pattern: /\d{2}:\d{2}:\d{2}(?:\.\d+)?/i,
        alias: 'number'
      }
    ],
    'number': /(?:\b0(?:x[\da-zA-Z]+(?:_[\da-zA-Z]+)*|o[0-7]+(?:_[0-7]+)*|b[10]+(?:_[10]+)*))\b|[-+]?\d+(?:_\d+)*(?:\.\d+(?:_\d+)*)?(?:[eE][+-]?\d+(?:_\d+)*)?\b|[-+]?(?:inf|nan)\b/,
    'boolean': /\b(?:true|false)\b/,
    'punctuation': /[.,=[\]{}]/
  };
}(Prism));
