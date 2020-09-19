(function() {
  const header = document.getElementById('header');
  const headroom = new Headroom(header, {
    offset: 64,
    tolerance: 16
  });

  headroom.init();
})();
