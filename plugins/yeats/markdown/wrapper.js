/*\
title: $:/plugins/yeats/markdown/wrapper.js
type: application/javascript
module-type: parser

Wraps up the marked parser for use in TiddlyWiki5
Originally fork from http://bjtools.tiddlyspot.com

\*/
(function(){

  /*jslint node: true, browser: true */
  /*global $tw: false */
  "use strict";


  var hljs = require("$:/plugins/tiddlywiki/highlight/highlight.js");
  var marked = require("$:/plugins/yeats/markdown/markdown.js");
  var renderer = new marked.Renderer();

  renderer.link = function (href, title, text) {
    if (this.options.sanitize) {
      try {
        var prot = decodeURIComponent(unescape(href))
          .replace(/[^\w:]/g, '')
          .toLowerCase();
      } catch (e) {
        return '';
      }
      if (prot.indexOf('javascript:') === 0 || prot.indexOf('vbscript:') === 0 || prot.indexOf('data:') === 0) {
        return '';
      }
    }
    const attrs = [
      `href=${href}`
    ]
    if (title) {
      attrs.push(`title=${title}`)
    }
    if (href[0] === '#') {
      attrs.push('class="tc-tiddlylink tc-tiddlylink-resolves"')
    } else {
      attrs.push(`target="_blank"`)
      attrs.push(`rel="noopener noreferrer"`)
      attrs.push('class="tc-tiddlylink-external"')
    }

    return `<a ${attrs.join(' ')}>${text}</a>`;
  }

  var HighLighter = function(str, lang) {
    try {
      if (lang && hljs.getLanguage(lang))
        return hljs.highlight(lang, str).value;
      else
        return hljs.highlightAuto(str).value;
    } catch (err) {
      return '';
    }
  };

  marked.setOptions({
    highlight: HighLighter,
    renderer: renderer,
    gfm: true,
    tables: true,
    breaks: true,
    pedantic: false,
    sanitize: false,
    smartLists: true,
    smartypants: false
  });

  var MarkdownParser = function(type, text, options) {
    this.tree = [{type: "raw", html: marked(text)}];
  };

  exports["text/x-markdown"] = MarkdownParser;

})();