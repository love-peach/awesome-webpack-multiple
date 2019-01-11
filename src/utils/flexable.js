let timer;

function flexAble() {
  let deviceWidth = document.documentElement.clientWidth;
  if (deviceWidth > 750) deviceWidth = 750;
  document.documentElement.style.fontSize = `${deviceWidth / 7.5}px`;
}
function onResize() {
  clearTimeout(timer);
  timer = setTimeout(() => {
    flexAble();
  }, 0);
}
window.onresize = onResize;
flexAble();
