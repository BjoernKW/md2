'use strict';

const through2 = require('through2');
const util = require('gulp-util');
const hljs = require('highlight.js');
const path = require('path');

const DEFAULT_OPTIONS = {
  language: null,
  languageMap: { ts: 'typescript' },
  hljsConfig: {}
};

module.exports = (_options) => {

  // Write default options
  let options = Object.assign({}, _options, DEFAULT_OPTIONS);

  // Configure hljs with the specified options
  hljs.configure(options.hljsConfig);

  return through2.obj(function(file, enc, cb) {

    if (file.isNull()) {
      this.push(file);
      return cb();
    }

    if (file.isStream()) {
      this.emit('error', new util.PluginError('gulp-highlight-files', 'Streaming is not supported'));
      return cb();
    }

    let language = detectLanguage(file.path);
    let contents = file.contents.toString();

    try {
      file.contents = new Buffer(runHightlightJs(contents, language), options.buffer);
      file.path = changeExtension(file.path, 'html');
    } catch (err) {
      this.emit('error', new util.PluginError('gulp-highlight-files', err));
    }

    this.push(file);
    cb();
  });

  /** Runs highlightjs against a given type. */
  function runHightlightJs(content, language) {
    return hljs.highlight(language || 'html', content).value;
  }

  /** Detects the hljs language name of a file. */
  function detectLanguage(fileName) {
    if (options.language) {
      return options.language;
    }

    let language = path.extname(fileName).slice(1);

    return options.languageMap[language] || language;
  }

  /** Changes the extension of a path. */
  function changeExtension(filePath, newExtension) {
    let extensionName = path.extname(filePath);
    return filePath.replace(new RegExp(`${extensionName}$`), `.${newExtension}`);
  }

};
