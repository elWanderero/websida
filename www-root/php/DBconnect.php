<?php
// Template file, keep actual credentials only on server, not in development.
// Initiering av databas, till för att includas i annan PHP.
define('DB_SERVER', 'server URL');
define('DB_USERNAME', 'username');
define('DB_PASSW', 'password');
define('DB_NAME', 'database name');

$db_connection = new mysqli(DB_SERVER, DB_USERNAME, DB_PASSW, DB_NAME);
if ($db_connection->connect_error) {die("Connection failed: " . $db_connection->connect_error);}