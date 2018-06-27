/* Finns till för att hantera postandet av formen till
 * servern, och för att placera ut relaterade fel- och
 * framgångsmeddelanden på HTML:en.
 */

var blog_post_form_str = "form#blog_post_form";
var bad_msg_str = "div#js_bad_msg";
var good_msg_str = "div#js_good_msg";
var post_blog_form;
var bad_msg_el;
var good_msg_el;

var login_failed = true;

function clearPassword() {
  "use strict";
  $("[type='password']").val("");
}
function clearForm() {
  "use strict";
  post_blog_form[0].reset();
}
// Put error message on screen.
function putGoodMsg(msg) {
  "use strict";
  bad_msg_el.hide();
  good_msg_el.html(msg).text();
  good_msg_el.show();
  good_msg_el[0].scrollIntoView();
}
// Put success message on screen.
function putBadMsg(msg) {
  "use strict";
  good_msg_el.hide();
  bad_msg_el.html(msg).text();
  bad_msg_el.show();
  clearPassword();
  bad_msg_el[0].scrollIntoView();
}

/* This is the functions that does the POST to the server.
 * "With salt" because it implements salting of the password
 * with the input string as salt.
 */ 
function postWithSalt(salt_str) {
  "use strict";
  if (salt_str === "0") {
    putBadMsg("Error vid kontakt med databasen.");
  } else if (salt_str === "1") {
    putBadMsg("Anv&auml;ndarnamn ej funnet.");
  } else {
    var usrname = post_blog_form.find("[name='username']").val();
    var passw_salted_enc = $.md5(post_blog_form.find("[name='pwd']").val() + salt_str);
    clearPassword();
    var title = post_blog_form.find("[name='title']").val();
    var text = post_blog_form.find("[name='text']").val();
    $.post(
      "php/postPost.php",
      {username : usrname, passw : passw_salted_enc, title : title, text : text},
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
      putBadMsg("BN&aring;nting gick fel vid kontakt med servern.");
    });
  }
}

// Om allt är ok i formuläret så GET:as salt från servern
// och postWithSalt anropas.
function onSubmit(event) {
  "use strict";
  event.preventDefault();
  good_msg_el.hide();
  bad_msg_el.hide();
  var title = post_blog_form.find("[name='title']").val();
  var text = post_blog_form.find("[name='text']").val();
  var usrname = post_blog_form.find("[name='username']").val();
  var pwd = post_blog_form.find("[name='pwd']").val();
  if (! title) {
    putBadMsg("Titeln f&aring;r inte vara tom.");
  } else if (! text) {
    putBadMsg("M&aring;ste fylla i text.");
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

function main() {
  "use strict";
  bad_msg_el = $(bad_msg_str);
  good_msg_el = $(good_msg_str);
  post_blog_form = $(blog_post_form_str);
  
  bad_msg_el.hide();
  good_msg_el.hide();
  post_blog_form.submit(onSubmit);
}

/* ENTRY POINT */
if ($) {
  $(document).ready(function() {
    "use strict";
    //Make damn sure the md5 plugin loads before exeuting main.
    $.getScript("js/jquery.md5.min.js", main);
  });
} else {console.log("jQuery inte laddat :(.");}