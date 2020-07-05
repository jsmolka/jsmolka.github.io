const timeline = new TimelineMax();

timeline.staggerFrom('rect', 1, {
  scale: 0,
  rotation: 90,
  transformOrigin: 'center center',
  ease: Power3.easeIn,
  delay: 0.5
}, 0.01);
