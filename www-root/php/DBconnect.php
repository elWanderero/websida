<?php
// Initiering av databas, till för att includas i annan PHP.
define('DB_SERVER', 'localhost');
define('DB_USERNAME', 'root');
define('DB_PASSW', '');
define('DB_NAME', 'daniels_blogg');

$db_connection = new mysqli(DB_SERVER, DB_USERNAME, DB_PASSW, DB_NAME);
if ($db_connection->connect_error) {die("Connection failed: " . $db_connection->connect_error);}