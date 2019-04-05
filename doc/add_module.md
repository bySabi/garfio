# Add module

Ex: module `easy`

1. put source file on `src` -> `src/easy.js`

2. add to `rollup.config.js`

```js
\\...
  {
    input: 'src/easy.js',
    output: [
      {
        file: 'lib/easy.js',
        format: 'cjs',
      },
    ],
    ...common,
  },
];
```

3. create `misc\exports` file `misc\exports\easy.js`

```js
module.exports = require('./lib/easy');
```

4. add path to `misc\files.js`

```js
module.exports = [
\\...
  {
    src: './exports/easy.js',
    dst: '../easy.js',
  },
];
```

5. add to `package.json`.files

```json
files: [
  ...,
  "easy.js"
]
```

6. ignore it on .gitignore

```.gitignore
easy.js
```
