<?php
	$is_ajax = $_REQUEST['is_ajax'];
	// if (isset($is_ajax) && $is_ajax){
		$data = $_REQUEST['filename'];
		unlink($data)
	// }
?>