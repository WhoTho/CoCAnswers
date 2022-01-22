<?php
$file = 'userAnswers.txt';
if (isset($_POST['text'])) {
    $text = $_POST['text'];
    echo '<script>console.log("PHPH STUFF 1");</script>';
    file_put_contents($file, $text+"\n", FILE_APPEND | LOCK_EX);
}
?>