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
    renderer: new marked.Renderer(),
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