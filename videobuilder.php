<?php
   	
   	$file1 = $_REQUEST['recordingOne'];
   	$file2 = $REQUEST['recordingTwo'];
   	$ffmpeg = 'ffmpeg';
   	exec($ffmpeg.' -i '.$file1.' -i '.$file2.'output.mp4');
?>