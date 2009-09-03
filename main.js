function main() {
  window.cache = {};
  cache.canvas = document.getElementById("cache-canvas");
  cache.context = cache.canvas.getContext("2d");

  window.store = {};
  store.canvas = document.getElementById("store-canvas");
  store.context = store.canvas.getContext("2d");
}

function log(str) {
  $('#error').append(str);
  $('#error').append("<br>");
}

function run() {
  log('running... TODO!');
}
