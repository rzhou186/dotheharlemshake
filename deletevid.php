<?php
	$is_ajax = $_REQUEST['is_ajax'];
   	$data = $_REQUEST['name'];
   	unlink($data);
   	echo $data;
?>