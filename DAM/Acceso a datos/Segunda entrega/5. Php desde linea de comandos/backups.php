<?php

// Database credentials
$dbHost = 'localhost';
$dbUsername = 'apex';
$dbPassword = 'apex';
$dbName = 'apex';

// Path to store backup (Windows path format)
$backupDir = 'C:\\Users\\cataa\\Desktop\\DAM\\Backups\\';

// Get current date and time in YmdHis format
$timestamp = date('YmdHis');

// Filename for the backup file
$backupFile = $backupDir . $timestamp . '_apex.sql';

// Full path to mysqldump (adjust this path if needed)
$mysqldumpPath = 'C:\\xampp\\mysql\\bin\\mysqldump.exe';

// Command to run mysqldump
$command = "\"{$mysqldumpPath}\" --user={$dbUsername} --password={$dbPassword} --host={$dbHost} {$dbName} > \"{$backupFile}\"";

// Execute the command
$output = null;
$return_var = null;
exec($command, $output, $return_var);

// Check if the mysqldump command was successful
if ($return_var === 0) {
    echo "Backup created successfully: " . $backupFile;
} else {
    echo "Error creating backup.";
}


?>

