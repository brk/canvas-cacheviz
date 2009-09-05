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

function rgbstr(r, g, b) {
  return "rgb("+r+","+g+","+b+")";
}

function store_done() {
  
  var i = store.hits.x.length;

  if (!window.animate) {
    while(i--) {
      // black-to-white index
      var r = Math.floor(255 * ( i / store.hits.x.length));
      // row number
      var g = Math.floor((i/200) * (255/200));
      // column number
      var colb = Math.floor((i % 200)*(255/200));
      //store.context.fillStyle = rgbstr(r, g, 0);
      store.context.fillStyle = rgbstr(0, g, colb);
    //  store.context.fillStyle = "rgb(200,0,0)";
      store.context.fillRect(store.hits.y[i], store.hits.x[i], 1,1);
    }
  } else {
    window.store_anim_i = i;
    window.store_anim_interval = setInterval("store_draw_next_miss()", 15);
  }
}
