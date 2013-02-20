<?php
	$is_ajax = $_REQUEST['is_ajax'];
	// if ($is_ajax){
		$data = $_REQUEST['filename'];
		unlink($data)
	// }
?>