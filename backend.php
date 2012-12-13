<?php 
  $db = $_GET['db'];
if($_GET['data']) {
  header('Cache-Control: no-cache, must-revalidate');
  header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
  header('Content-type: application/json');
  if(file_exists("data/$db.json")) {
    $data = file_get_contents("data/$db.json");

    print $data;
    exit;
  }
  else {
    print '[]';
    exit;
  }
}
if($data = $_POST['data']) {
  file_put_contents("data/$db.json", json_encode($data));
  exit;
}
?>
<script>
dbname = '<?php print $_GET['db']?>';
</script>
