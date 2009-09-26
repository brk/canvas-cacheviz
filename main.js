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
  cache.misses = { x: [], y: [], type: [] };
  cache.hits   = { x: [], y: [] };
  cache.was_hit = [];

  cache.touched = [];
  cache.touched.length = cache_num_rows;
  for(var i = 0; i < cache.touched.length; ++i) {
    cache.touched[i] = false; 
  }

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

function get_memory_size() {
  var elt = document.getElementById("store-canvas");
  return { x: elt.width, y: elt.height };
}

function reset() {
  window.cache = make_cache();
  cache.context.fillStyle = "rgb(240, 240, 240)";
  cache.context.fillRect(0,0,cache.canvas.width, cache.canvas.height);

  window.store = make_store();
  store.context.fillStyle = "rgb(240, 240, 240)";
  store.context.fillRect(0,0,store.canvas.width, store.canvas.height);
}

function format_with_commas(n) {
  var n_str = "" + n;
  var rv = "";
  for (var i = n_str.length - 1, delim = 0; i >= 0; --i) {
    rv += n_str[i];
    if (delim++ == 2 && i != 0) {
      delim = 0;
      rv += ",";
    }
  }
  return rv.split("").reverse().join("");
}

function run() {
  reset();
  
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

  var mem_size = get_memory_size();
  f(a, mem_size.x, mem_size.y);
  a.done();
  var m = cache.misses.x.length;
  var h = cache.hits.x.length;
  log(ftxt.split("\n")[0]);

  log("cache misses: " + m + " ("+(100*(m/(m+h)))+"%)");
  log("cache hits: "   + h + " ("+(100*(h/(m+h)))+"%)");
  log("total: " + (m+h) + " memory accesses");
  var estimated_cycles = m * 40 + 2 * h;
  log("estimated memory time (40 cycles/miss, 2/hit) = " + format_with_commas(estimated_cycles) + " cycles"); 
  log("------------------------------------");
}

function main() {
  // Make it so clicking the title of a snippet loads the snippet text
  $("#snippet-list .title").bind("click", function (e) {
      $("#code-textarea")[0].value = $(this).attr("value") + "\n" + $(this).next().text();
  });

  // Hide all snippets to start
  $("#snippet-list pre").hide();

  // Select first snippet, whatever it is.
  $("#snippet-list .title")[0].click();

  $("#snippet-list-header").after("<h3>(Click to Load Snippet)</h3>");
}
