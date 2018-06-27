<?php

$username = $_GET['username'];
$salt = "0";

// mysqli object name is $db_connection
require("DBconnect.php");

$stmt = $db_connection->prepare('SELECT salt FROM users WHERE user_name = ?');
if ($stmt) {
  $stmt->bind_param('s', $username);
  $stmt->execute();
  $stmt->bind_result($salt);
  
  $success = $stmt->fetch();
  if (is_null($success)) {
    //No row returned = username not found.
    $salt = "1";
  } elseif (! $success) {
    //Error in DB connection
    $salt = "0";
  }
  $stmt->close();
}
$db_connection->close();

# $salt = "0" means error in DB connection.
# $salt = "1" means username not found
# $salt = long string means success.
echo $salt;
?>