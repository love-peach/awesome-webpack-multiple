const fs = require('fs');
const url = require('url');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const sourceMap = require('source-map');

const app = express();

const resolve = file => path.resolve(__dirname, file);

const formHTML = fs.readFileSync(resolve('./form.html'), 'utf-8');

// 接口参数处理
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.all('*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'content-type');
  next();
});

app.get('/', (req, res) => {
  res.send(formHTML);
});

app.post('/errorReport', (req, res) => {
  const {
    source, lineno, colno, message, stack,
  } = req.body;
  const sourceMapFile = resolve(`../dist/${url.parse(source).pathname}.map`);
  console.log(sourceMapFile, 'sourceMapFile');

  const rawSourceMap = JSON.parse(fs.readFileSync(sourceMapFile, 'utf8'));

  sourceMap.SourceMapConsumer.with(rawSourceMap, null, consumer => {
    const pos = consumer.originalPositionFor({
      line: lineno,
      column: colno,
    });

    console.log(pos);
    res.json({
      code: 200,
      data: {
        ...pos,
        message,
        stack,
      },
      message: '解析成功！',
    });
  });
});

app.use((err, req, res) => {
  console.log(err, 'err');
  res.json({
    code: -1,
    data: null,
    message: err.message,
  });
});

app.listen(8001, () => {
  console.log('server started at localhost:8001');
});
