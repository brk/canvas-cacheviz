function store_touch(x, y) {
  store.hits.x.push(x);
  store.hits.y.push(y);
}

function store_draw_next_miss() {
  if (store_anim_i--) {
    var i = store.hits.x.length - store_anim_i - 1;
    store.context.fillRect(store.hits.y[i], store.hits.x[i], 1,1);
  } else {
    clearInterval(window.store_anim_interval);
  }
}

function store_done() {
  store.context.fillStyle = "rgb(200, 0, 0)";
  
  var i = store.hits.x.length;

  if (!window.animate) {
    while(i--) {
      store.context.fillRect(store.hits.y[i], store.hits.x[i], 1,1);
    }
  } else {
    window.store_anim_i = i;
    window.store_anim_interval = setInterval("store_draw_next_miss()", 15);
  }
}
