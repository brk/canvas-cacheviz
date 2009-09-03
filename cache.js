var cache_row_size = 64; // bytes
var cache_num_rows = 16; // rows
var element_size = 4; // bytes

// cache stores memory indices converted to logical row numbers
function index_to_row(i) {
  return Math.floor(i / cache_row_size);
}

function cache_contains(e) {
  var row = index_to_row(e * element_size);
  var i = cache.rows.length;
  while (i--) {
    if (cache.rows[i] == row) {
      // cache hit!
      return true;
    }
  }

  // no cache hit; pull cache row
  cache.rows[cache.replace_row] = row;
  ++cache.replace_row;
  if (cache.replace_row == cache_num_rows) {
    cache.replace_row = 0;
  }
  return false;
}

// Touch a given element index (at x, y in array)
// Produces either cache hit or cache miss
function cache_touch(e, x, y) {
  if (cache_contains(e)) {
    cache.hits.x.push(x);
    cache.hits.y.push(y);
  } else {

  //  log('cache miss, pullin row ' + index_to_row(e*element_size) + '; ' + x + ', ' +y);
    cache.misses.x.push(x);
    cache.misses.y.push(y);
  }
}

function cache_draw_next_miss() {
  if (cache_anim_i--) {
    var i = cache.misses.x.length - cache_anim_i - 1;
    cache.context.fillRect(cache.misses.y[i], cache.misses.x[i], 1,1);
  } else {
    clearInterval(window.cache_anim_interval);
  }
}

function cache_done() {
  cache.context.fillStyle = "rgb(200, 0, 0)";
  var i = cache.misses.x.length;
  if (!window.animate) {
    while(i--) {
      cache.context.fillRect(cache.misses.y[i], cache.misses.x[i], 1,1);
    }
  } else {
    window.cache_anim_i = i;
    window.cache_anim_interval = setInterval("cache_draw_next_miss()", 15);
  }
}
