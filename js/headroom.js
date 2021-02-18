(()=>{var f=Object.defineProperty,Y=Object.prototype.hasOwnProperty,B=(t,n)=>()=>(n||(n={exports:{}},t(n.exports,n)),n.exports),L=t=>f(t,"__esModule",{value:!0}),U=(t,n)=>{if(L(t),typeof n=="object"||typeof n=="function")for(let h in n)!Y.call(t,h)&&h!=="default"&&f(t,h,{get:()=>n[h],enumerable:!0});return t},M=t=>t&&t.__esModule?t:U(f({},"default",{value:t,enumerable:!0}),t);var T=B((p,m)=>{(function(t,n){typeof p=="object"&&typeof m!="undefined"?m.exports=n():typeof define=="function"&&define.amd?define(n):(t=t||self,t.Headroom=n())})(p,function(){"use strict";function t(){return typeof window!="undefined"}function n(){var e=!1;try{var o={get passive(){e=!0}};window.addEventListener("test",o,o),window.removeEventListener("test",o,o)}catch(s){e=!1}return e}function h(){return!!(t()&&function(){}.bind&&"classList"in document.documentElement&&Object.assign&&Object.keys&&requestAnimationFrame)}function j(e){return e.nodeType===9}function E(e){return e&&e.document&&j(e.document)}function x(e){var o=e.document,s=o.body,a=o.documentElement;return{scrollHeight:function(){return Math.max(s.scrollHeight,a.scrollHeight,s.offsetHeight,a.offsetHeight,s.clientHeight,a.clientHeight)},height:function(){return e.innerHeight||a.clientHeight||s.clientHeight},scrollY:function(){return e.pageYOffset!==void 0?e.pageYOffset:(a||s.parentNode||s).scrollTop}}}function N(e){return{scrollHeight:function(){return Math.max(e.scrollHeight,e.offsetHeight,e.clientHeight)},height:function(){return Math.max(e.offsetHeight,e.clientHeight)},scrollY:function(){return e.scrollTop}}}function S(e){return E(e)?x(e):N(e)}function z(e,o,s){var a=n(),v,d=!1,c=S(e),u=c.scrollY(),i={};function b(){var l=Math.round(c.scrollY()),C=c.height(),H=c.scrollHeight();i.scrollY=l,i.lastScrollY=u,i.direction=l>u?"down":"up",i.distance=Math.abs(l-u),i.isOutOfBounds=l<0||l+C>H,i.top=l<=o.offset[i.direction],i.bottom=l+C>=H,i.toleranceExceeded=i.distance>o.tolerance[i.direction],s(i),u=l,d=!1}function w(){d||(d=!0,v=requestAnimationFrame(b))}var y=a?{passive:!0,capture:!1}:!1;return e.addEventListener("scroll",w,y),b(),{destroy:function(){cancelAnimationFrame(v),e.removeEventListener("scroll",w,y)}}}function g(e){return e===Object(e)?e:{down:e,up:e}}function r(e,o){o=o||{},Object.assign(this,r.options,o),this.classes=Object.assign({},r.options.classes,o.classes),this.elem=e,this.tolerance=g(this.tolerance),this.offset=g(this.offset),this.initialised=!1,this.frozen=!1}return r.prototype={constructor:r,init:function(){return r.cutsTheMustard&&!this.initialised&&(this.addClass("initial"),this.initialised=!0,setTimeout(function(e){e.scrollTracker=z(e.scroller,{offset:e.offset,tolerance:e.tolerance},e.update.bind(e))},100,this)),this},destroy:function(){this.initialised=!1,Object.keys(this.classes).forEach(this.removeClass,this),this.scrollTracker.destroy()},unpin:function(){(this.hasClass("pinned")||!this.hasClass("unpinned"))&&(this.addClass("unpinned"),this.removeClass("pinned"),this.onUnpin&&this.onUnpin.call(this))},pin:function(){this.hasClass("unpinned")&&(this.addClass("pinned"),this.removeClass("unpinned"),this.onPin&&this.onPin.call(this))},freeze:function(){this.frozen=!0,this.addClass("frozen")},unfreeze:function(){this.frozen=!1,this.removeClass("frozen")},top:function(){this.hasClass("top")||(this.addClass("top"),this.removeClass("notTop"),this.onTop&&this.onTop.call(this))},notTop:function(){this.hasClass("notTop")||(this.addClass("notTop"),this.removeClass("top"),this.onNotTop&&this.onNotTop.call(this))},bottom:function(){this.hasClass("bottom")||(this.addClass("bottom"),this.removeClass("notBottom"),this.onBottom&&this.onBottom.call(this))},notBottom:function(){this.hasClass("notBottom")||(this.addClass("notBottom"),this.removeClass("bottom"),this.onNotBottom&&this.onNotBottom.call(this))},shouldUnpin:function(e){var o=e.direction==="down";return o&&!e.top&&e.toleranceExceeded},shouldPin:function(e){var o=e.direction==="up";return o&&e.toleranceExceeded||e.top},addClass:function(e){this.elem.classList.add.apply(this.elem.classList,this.classes[e].split(" "))},removeClass:function(e){this.elem.classList.remove.apply(this.elem.classList,this.classes[e].split(" "))},hasClass:function(e){return this.classes[e].split(" ").every(function(o){return this.classList.contains(o)},this.elem)},update:function(e){if(e.isOutOfBounds)return;if(this.frozen===!0)return;e.top?this.top():this.notTop(),e.bottom?this.bottom():this.notBottom(),this.shouldUnpin(e)?this.unpin():this.shouldPin(e)&&this.pin()}},r.options={tolerance:{up:0,down:0},offset:0,scroller:t()?window:null,classes:{frozen:"headroom--frozen",pinned:"headroom--pinned",unpinned:"headroom--unpinned",top:"headroom--top",notTop:"headroom--not-top",bottom:"headroom--bottom",notBottom:"headroom--not-bottom",initial:"headroom"}},r.cutsTheMustard=h(),r})});const O=M(T());(function(){const t=document.querySelector("header"),n=new O.default(t,{offset:64,tolerance:16});n.init()})();})();
/*!
 * headroom.js v0.12.0 - Give your page some headroom. Hide your header until you need it
 * Copyright (c) 2020 Nick Williams - http://wicky.nillia.ms/headroom.js
 * License: MIT
 */
