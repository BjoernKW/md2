# gulp-highlight-files
Gulp plugin to highlight a set of files using [HighlightJS](https://highlightjs.org/).

### Installation

```bash
$ npm install gulp-highlight-files --save-dev
```

### Example

```js
const gulpHighlightFiles = require('gulp-highlight-files');

/* Inside of the gulp task. */
return gulp.src('**/*.html')
  .pipe(gulpHighlightFiles(options)
  .pipe(gulp.dest('dist'));
```

### Configuration
| Name        | Type   | Description                                                     |
|-------------|--------|-----------------------------------------------------------------|
| language    | string | Explicit language to be used to highlight files.                |
| languageMap | any    | Object that maps extensions to a specific HighlightJS language. |
| hljsOptions | any    | Options being passed to HighlightJS.                            |
