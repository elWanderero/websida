<?php
require("DBconnect.php");

$post_successfull = "0";

// Kollar lösenordet (som redan måste vara krypterat med md5) mot
// databasen med prepared statements för säkerhetens skull.
$username = $_POST['username'];
$stmt = $db_connection->prepare('SELECT password FROM users WHERE user_name = ?');
if ($stmt) {
  $stmt->bind_param('s', $username);
  $stmt->execute();
  $stmt->bind_result($passwd);
  
  $stmt->fetch();
  if ($passwd === $_POST['passw']) {
    $post_successfull = "1";
  } else {
    $post_successfull = "2";
  }
  $stmt->close();
}

if ($post_successfull === "1") {
  $stmt = $db_connection->prepare("INSERT INTO `blogpost`(`title`, `text`, `svg_image`, `date`, `post_id`) VALUES (?, ?, ?, CURRENT_TIMESTAMP, NULL)");
  if ($stmt) {
    //Without the "UTF-8" the encoding into the database seems to be unpredictable.
    //nl2br is to encode newlines as html properly.
    $title = nl2br(htmlentities($_POST['title'], ENT_QUOTES | ENT_HTML401 , "UTF-8"));
    $text = nl2br(htmlentities($_POST['text'], ENT_QUOTES | ENT_HTML401 , "UTF-8"));
    $svg = Null;
    if ((! isset($_POST['svg'])) || empty($_POST['svg'])) {
      $svg = Null;
    } else {
      $svg = nl2br(htmlentities($_POST['svg'], ENT_QUOTES | ENT_HTML401 , "UTF-8"));
    }
    $stmt->bind_param('sss', $title, $text, $svg);
    if (! $stmt->execute()) {
      $post_successfull = "0";
    }
  } else {
    $post_successfull = "0";
  }
}
$db_connection->close();

# $post_successfull = '0' means query failed.
# '1' means correct passw.
# '2' means incorrect passw or username.
echo $post_successfull;

?>