function make_cache() {
  var cache = {};
  cache.canvas = document.getElementById("cache-canvas");
  cache.context = cache.canvas.getContext("2d");
  cache.rows = [];
  cache.rows.length = cache_num_rows;
  for(var i = 0; i < cache.rows.length; ++i) {
    cache.rows[i] = 0; 
  }
  cache.replace_row = 0;
  cache.misses = { x: [], y: [] };
  cache.hits   = { x: [], y: [] };
  return cache;
}

function main() {

  window.store = {};
  store.canvas = document.getElementById("store-canvas");
  store.context = store.canvas.getContext("2d");
}

function log(str) {
  $('#error').append(str);
  $('#error').append("<br>");
}

function f_impl(a,w,h) {
  for (i = 0; i < h; i++) {
    for (j = 0; j < w; j++) {
      a.touch(i,j);
    }
  }
  a.done();
}

function run() {
  window.cache = make_cache();
  cache.context.fillStyle = "rgb(240, 240, 240)";
  cache.context.fillRect(0,0,cache.canvas.width, cache.canvas.height);

  var ftxt = $("#code-textarea")[0].value;
  log(ftxt);
  var f = eval(ftxt);

  var a = {
    touch: function(i,j) {
      cache_touch(cache.canvas.width * i + j, i, j);
    },

    done: function() {
      cache_done();
      log("done");
    }
  };
  log('pre');
  f(a, 200, 200);
  log('fin');
}
