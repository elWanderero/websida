<?php
// Template file, keep version called only DB_connect.php on server and change credentials appropriately there. DO
// NOT KEEP THE ACTUAL CREDENTIALS IN DEVELOPMENT CODE OR GIT, IT SHOULD EXIST ONLY ON SERVER, AWAY FROM PRYING EYES.
// Initiering av databas, till för att includas i annan PHP.
define('DB_SERVER', 'server URL');
define('DB_USERNAME', 'username');
define('DB_PASSW', 'password');
define('DB_NAME', 'database name');

$db_connection = new mysqli(DB_SERVER, DB_USERNAME, DB_PASSW, DB_NAME);
if ($db_connection->connect_error) {die("Connection failed: " . $db_connection->connect_error);}