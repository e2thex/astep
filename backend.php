<?php 
  $db = $_GET['db'];
  header('Cache-Control: no-cache, must-revalidate');
  header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
  header('Content-type: application/json');
if(isset($_POST['data']) && ($data = $_POST['data'])) {
  file_put_contents("data/$db.json", json_encode($data));
  exit;
}
if(file_exists("data/$db.json")) {
  $data = file_get_contents("data/$db.json");

  print $data;
  exit;
}
else {
  print '{stories:[], tasks:[]}';
  exit;
}
