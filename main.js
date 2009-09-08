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
  cache.was_hit = [];
  return cache;
}

function make_store() {
  window.store = {};
  store.canvas = document.getElementById("store-canvas");
  store.context = store.canvas.getContext("2d");
  
  store.hits = { x: [], y: [] };

  return store;
}

function log(str) {
  $('#error').append(str);
  $('#error').append("<br>");
}

var animationSpeed = 16; // TODO: hook up to jquery slider!

function run() {
  window.cache = make_cache();
  cache.context.fillStyle = "rgb(240, 240, 240)";
  cache.context.fillRect(0,0,cache.canvas.width, cache.canvas.height);

  window.store = make_store();
  store.context.fillStyle = "rgb(240, 240, 240)";
  store.context.fillRect(0,0,store.canvas.width, store.canvas.height);
  
  var ftxt = $("#code-textarea")[0].value;
  eval("var f = " + ftxt);

  var a = {
    touch: function(i,j) {
      cache_touch(cache.canvas.width * i + j, i, j);
      store_touch(i, j);
    },

    done: function() {
      cache_done();
      store_done();
    }
  };

  // just in case...?
  if (!window.animationSpeed) {
    window.animationSpeed = 1;
    log ('anim speeed not set');
  } else {
    log('anim speed = ' + animationSpeed);
  }
  
  f(a, 200, 200);
  a.done();
  var m = cache.misses.x.length;
  var h = cache.hits.x.length;
  log("cache misses: " + m + " ("+(100*(m/(m+h)))+"%)");
  log("cache hits: "   + h + " ("+(100*(h/(m+h)))+"%)");
  log("total: " + (m+h) + " memory accesses");
}
