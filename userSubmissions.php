<?php
$file = 'userAnswers.txt';
function writeToServer($text) {
    file_put_contents($file, $text+"\n", FILE_APPEND | LOCK_EX);
}
?>