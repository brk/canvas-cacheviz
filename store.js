function store_touch(x, y) {
  store.hits.x.push(x);
  store.hits.y.push(y);
}

function rgbstr(r, g, b) {
  return "rgb("+r+","+g+","+b+")";
}

function store_draw_hit(h) {
  var i = store.hits.x.length - h - 1;
  var x = store.hits.y[i];
  var y = store.hits.y[i];

  // black-to-white index
  var r = Math.floor(255 * ( i / store.hits.x.length));
  store.context.fillStyle = rgbstr(r, r, r);
  store.context.fillRect(store.hits.y[i], store.hits.x[i], 1,1);
}

function store_draw_next() {
  var i = window.animationSpeed;
  while (i-- && store_anim_i--) {
    store_draw_hit(store_anim_i);
  }

  if (!store_anim_i) {
    clearInterval(window.store_anim_interval);
  }
}

function store_done() {
  var i = store.hits.x.length;

  if (!window.animate) {
    while(i--) {
      store_draw_hit(i);
    }
  } else {
    window.store_anim_i = i;
    window.store_anim_interval = setInterval("store_draw_next()", 5);
  }
}
