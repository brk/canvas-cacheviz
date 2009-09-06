var cache_row_size = 64; // bytes
var cache_num_rows = 10; // rows
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
    cache.was_hit.push(true);
  } else {
  //  log('cache miss, pullin row ' + index_to_row(e*element_size) + '; ' + x + ', ' +y);
    cache.misses.x.push(x);
    cache.misses.y.push(y);
    cache.was_hit.push(false);
  }
}

function cache_draw_miss(m) {
  var y = cache.misses.y[m];
  var x = cache.misses.x[m];
  cache.context.fillRect(y, x, 1,1);
}

function cache_draw_hit(h) {
  var y = cache.hits.y[h];
  var x = cache.hits.x[h];
  cache.context.fillRect(y, x, 1,1);
}

function cache_done() {
  window.cache_renderer = {
    reset: function() {
      this.i = 0; // memory touch index
      this.m = 0;
      this.h = 0;
      this.touches = cache.misses.x.length + cache.hits.x.length;
      this.missStyle = "rgb(200, 0, 0)";
      this.hitStyle = "rgb(220, 250, 220)"
    },
    can_step: function() { return this.i < this.touches; },
    step: function() {
      if (!this.can_step()) { return; }

      if (cache.was_hit[this.i++]) {
        cache.context.fillStyle = this.hitStyle;
        cache_draw_hit(this.h++);
      } else {
        cache.context.fillStyle = this.missStyle;
        cache_draw_miss(this.m++);
      }
    },
    draw_oneshot: function() { while (this.can_step()) { this.step(); } },
    draw_animated: function() {
      this.cache_anim_interval = setInterval('cache_renderer.animate_steps()', 5);
    },
    animate_steps: function() {
      if (this.can_step()) {
        this.step();
      } else {
        this.stop_animation();
      }
    },
    stop_animation: function() { clearInterval(this.cache_anim_interval); }
  };

  cache_renderer.reset();

  cache.context.fillStyle = "rgb(200, 0, 0)";

  if (window.animate) {
    cache_renderer.draw_animated();
  } else {
    cache_renderer.draw_oneshot();
  }
}
