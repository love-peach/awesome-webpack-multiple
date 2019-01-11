window.onerror = (message, source, lineno, colno, error) => {
  if (XMLHttpRequest) {
    const params = {
      message,
      source,
      lineno,
      colno,
      stack: error && error.stack ? error.stack : null,
    };
    const xhr = new XMLHttpRequest();
    xhr.open('post', 'http://localhost:8001/errorReport', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(params));
  }
};

// window.addEventListener('unhandledrejection',function (event) {
//   console.log('捕获异常成功了，好开心啊！！！！')
//   console.log(event.reason);
// });
