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
  let _options

  renderer.image = function (href, title, text) {
    var tag = "img", src = "",
      tiddler = _options.wiki.getTiddler(href);
    if(!tiddler) {
      // The source isn't the title of a tiddler, so we'll assume it's a URL
      src = _options.widget.getVariable("tv-get-export-image-link",{params: [{name: "src",value: href}],defaultValue: href});
    } else {
      // Check if it is an image tiddler
      if(_options.wiki.isImageTiddler(href)) {
        var type = tiddler.fields.type,
          text = tiddler.fields.text,
          _canonical_uri = tiddler.fields._canonical_uri;
        // If the tiddler has body text then it doesn't need to be lazily loaded
        if(text) {
          // Render the appropriate element for the image type
          switch(type) {
            case "application/pdf":
              tag = "embed";
              src = "data:application/pdf;base64," + text;
              break;
            case "image/svg+xml":
              src = "data:image/svg+xml," + encodeURIComponent(text);
              break;
            default:
              src = "data:" + type + ";base64," + text;
              break;
          }
        } else if(_canonical_uri) {
          switch(type) {
            case "application/pdf":
              tag = "embed";
              src = _canonical_uri;
              break;
            case "image/svg+xml":
              src = _canonical_uri;
              break;
            default:
              src = _canonical_uri;
              break;
          }
        } else {
          // Just trigger loading of the tiddler
          _options.wiki.getTiddlerText(href);
        }
      }
    }
    const attrs = [
      `src="${src}"`
    ]
    if (title) {
      attrs.push(`title="${title}"`)
    }
    if (text) {
      attrs.push(`alt="${text}"`)
    }
    return `<${tag} ${attrs.join(' ')}></${tag}>`;
  }

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
    _options = options
    this.tree = [{type: "raw", html: marked(text)}];
  };

  exports["text/x-markdown"] = MarkdownParser;

})();