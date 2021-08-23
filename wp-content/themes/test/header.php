<?php
/**
 * ページタイプの判別
 *
 * @return $ROOT_URI
 * @return $REQUEST_PATH          | object
 * @return $REQUEST_PATH_MATCHES   | array
 * @return $REQUEST_PATH_MATCHESIn | array
 */
$ROOT_URI               = 'http://localhost:8000/wp-content/themes/test/';
$REQUEST_PATH           = $ROOT_URI.$_SERVER["REQUEST_URI"];
$REQUEST_PATH_MATCHES   = Array();
$REQUEST_PATH_MATCHES_IN = Array();
preg_match("/\/([a-z0-9]+)\//", $REQUEST_PATH, $REQUEST_PATH_MATCHES);
preg_match("/\/[a-z0-9]+\/(.+)\//", $REQUEST_PATH, $REQUEST_PATH_MATCHES_IN);
var_dump($REQUEST_PATH);

?><!doctype html>
<html lang="ja">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
  <?php wp_head(); ?>
	<link rel="stylesheet" href="<?php echo $REQUEST_PATH ?>assets/css/style.css">
</head>
<body>
