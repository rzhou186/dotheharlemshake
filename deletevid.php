<?php
	$is_ajax = $_REQUEST['is_ajax'];
   	$data = $_REQUEST['name'];
   	if (unlink($data)) echo "WOO!!!";
   	else echo $data;
?>