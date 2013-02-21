<?php
	$is_ajax = $_REQUEST['is_ajax'];
	// if ($is_ajax == 1){
		$data = $_REQUEST['filename'];
		unlink($data)
	// }
?>