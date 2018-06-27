/* Detta script g�r en enda sak: F�r att undvika XSS s� kodas
 * all svg med htmlentities p� servern. F�r att avkoda s�kert
 * (n�ja) s� placeras den kodade svg:n i ett attribut p� sidan.
 * Detta script plockar ut det attributet, avkodar, och stoppar
 * in bilden med svgjs-pluginen.
 */

var svg_el_class = "svg_here";
var svg_el_str = "." + svg_el_class;

function main() {
  "use strict";
  var decode_text_area = document.createElement("textarea");
  // F�r varje post med bild, plocka ut den kodade svg:n ur
  // attributen, avkoda och stoppa in i en svgjs-drawing.
  $(svg_el_str).each(function(i) {
    var svg_el = $(this);
    var svg_code = svg_el.attr("svg");
    svg_el.removeAttr("svg");
    decode_text_area.innerHTML = svg_code;
    svg_code = decode_text_area.value;
    (new SVG(this).size("100%", "100%")).svg(svg_code);
    svg_el.show();
  });
  decode_text_area.innerHTML = "";
}

if ($) {
  $(document).ready(function() {
    "use strict";
    //Make damn sure the svg plugin loads before exeuting main.
    $.getScript("js/svg.min.js", main);
  });
} else {console.log("jQuery inte laddat :(.");}