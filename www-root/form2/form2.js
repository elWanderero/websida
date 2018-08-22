const blog_post_form_str = "form#blog_post_form";
const bad_msg_str = "div#js_bad_msg";
const good_msg_str = "div#js_good_msg";
let post_blog_form;
let bad_msg_el;
let good_msg_el;
let drawing;
let drawing_is_empty = true;

function clearPassword() {
  "use strict";
  $("[type='password']").val("");
}
// Meddelanden från denna kod placeras på sidan med denna funktion.
// .html8().text för att html entities ska hanteras korrekt.
function putGoodMsg(msg) {
  "use strict";
  bad_msg_el.hide();
  good_msg_el.html(msg).text();
  good_msg_el.show();
  good_msg_el[0].scrollIntoView();
}
function putBadMsg(msg) {
  "use strict";
  good_msg_el.hide();
  bad_msg_el.html(msg).text();
  bad_msg_el.show();
  clearPassword();
  bad_msg_el[0].scrollIntoView();
}
function clearForm() {
  "use strict";
  post_blog_form[0].reset();
  drawing.clear();
  drawing_is_empty = true;
}

/* This is the functions that does the POST to the
 * server. "With salt" because it implements salting
 * of the password with the input string as salt.
 */
function postWithSalt(salt_str) {
  "use strict";
  if (salt_str === "0") {
    putBadMsg("Error vid kontakt med databasen.");
  } else if (salt_str === "1") {
    putBadMsg("Anv&auml;ndarnamn ej funnet.");
  } else {
    let usrname = post_blog_form.find("[name='username']").val();
    let passw_salted_enc = $.md5(post_blog_form.find("[name='pwd']").val() + salt_str);
    clearPassword();
    let title = post_blog_form.find("[name='title']").val();
    let text = post_blog_form.find("[name='text']").val();
    let svg_img;
    if (drawing_is_empty) {
      svg_img = null;
    } else {
      svg_img = drawing.svg();
    }
    $.post(
      "php/postPost.php",
      {username : usrname, passw : passw_salted_enc, title : title, text : text, svg : svg_img},
      "text"
    ).done(function(error_str) {
      switch(error_str) {
        case "0":
          putBadMsg("Error vid kontakt med databasen.");
          break;
        case "2":
          putBadMsg("Felaktigt anv&auml;ndarnamn eller l&ouml;senord.");
          break;
        case "1":
          putGoodMsg("Post postad!");
          clearForm();
          break;
        default:
          putBadMsg("N&aring;nting gick fel vid kommunikation med servern.");
      }
    }).fail(function() {
      putBadMsg("N&aring;nting gick fel vid kontakt med servern.");
    });
  }
}

// Om allt är ok i formuläret så GET:as salt
// från servern och postWithSalt anropas.
function onSubmit(event) {
  "use strict";
  event.preventDefault();
  good_msg_el.hide();
  bad_msg_el.hide();
  let title = post_blog_form.find("[name='title']").val();
  let text = post_blog_form.find("[name='text']").val();
  let usrname = post_blog_form.find("[name='username']").val();
  let pwd = post_blog_form.find("[name='pwd']").val();
  if (! title) {
    putBadMsg("Titeln f&aring;r inte vara tom.");
  } else if (! text && drawing_is_empty) {
    putBadMsg("M&aring;ste fylla i antingen text eller bild.");
  } else if (! usrname || ! pwd) {
    putBadMsg("Fyll i namn och l&ouml;senord.");
  } else {
    $.get(
      "php/getSalt.php",
      {username : usrname},
      "text"
    ).done(postWithSalt
    ).fail(function() {
      putBadMsg("N&aring;nting gick fel vid kommunikation med servern.");
      clearPassword();
    });
  }
}

/* Funkar såhär: Slumpar ett tal 0<x<1. Gör om x till sträng på hexadecimal form.
 * Slicar i början och slutet för att få korrekt längd och fullständigt slump-
 * intervall. Prependar en massa nollor pga problemet att om talet är för litet
 * Så blir strängen för kort, men en color på hexadecimal form ska ha en bestämd
 * längd. Slicar igen för att få rätt längd. Lägg på en '#'. Klart.
 */
function rndColor() {
  "use strict";
  return "#" + ("000000" + Math.random().toString(16).slice(2, 8).toUpperCase()).slice(-6);
}

/*
 * MAIN
 */
function main() {
  "use strict";
  bad_msg_el = $(bad_msg_str);
  good_msg_el = $(good_msg_str);
  post_blog_form = $(blog_post_form_str);

  if (! SVG.supported) {
    alert("SVG not supported");
  }

  bad_msg_el.hide();
  good_msg_el.hide();
  drawing = new SVG("drawing").size("100%", "100%");
  let line;
    // På mousedown i svgjs-drawingen skapas en ny linje.
  // På mouseup avslutas linje. Funktionalitet från
  // draw.js, plugin till svgjs.
  drawing.on("mousedown", function(e) {
    e.preventDefault(); //Så muspekaren inte förändras
    line = drawing.line().stroke({color: rndColor(), width: 10, linecap: "round"  });
    line.draw(e);});
  drawing.on("mouseup", function(e) {drawing_is_empty = false; line.draw(e);});

  post_blog_form.submit(onSubmit);
}
// En funktion som rekursivt returnerar callback-funktioner, för
// att säkert ladda script en efter en. Welcome to callback hell.
function sequentialLoader(path_list) {
  "use strict";
  if (path_list.length === 0) {
    return main;
  } else {
    let first_load_path = path_list[0];
    let rest_of_path_list = path_list.slice(1);
    return function() {
      $.getScript(first_load_path, sequentialLoader(rest_of_path_list));
    };
  }
}

/*
 * ENTRY POINT
 */
if ($) {
  let scripts = ["js/jquery.md5.min.js",
                 "js/svg.min.js",
                 "form2/svg.draw.min.js",
                 "form2/lineable.min.js"];
  $(document).ready(sequentialLoader(scripts));
} else {console.log("jQuery inte laddat :(.");}