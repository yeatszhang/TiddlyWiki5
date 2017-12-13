## Description

a [tiddlywiki5](https://github.com/Jermolene/TiddlyWiki5) fork support markdown by [marked](https://github.com/chjj/marked)

need install office `highlight.js` plugin first

## Install

```
npm install https://github.com/yeatszhang/TiddlyWiki5.git -g
```

* after start the server, edit `tiddlywiki.info`
* add `yeats/markdown` to `plugins`

```
{
    "description": "Basic client-server edition",
    "plugins": [
        "tiddlywiki/tiddlyweb",
        "tiddlywiki/filesystem",
        "tiddlywiki/highlight",
        // add the plugin
        "yeats/markdown",
        "tiddlywiki/codemirror"
    ]
}
```

## Usage

###  Creating ~WikiLinks

Create wiki links with the usual Markdown link syntax targeting `#` and the target tiddler title:

```
[link text](#TiddlerTitle)
```

### Images

Markdown image syntax can be used to reference images by tiddler title or an external URI. For example:

```
![alt text](/path/to/img.jpg "Title")

![alt text](Motovun Jack.jpg "Title")
```

### support Highlight.js


    ```javascript
     function hello () {
        console.log('Hello world')
     }
    ```