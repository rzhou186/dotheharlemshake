<?php
   	
   	$file1 = $_REQUEST['recordingOne'];
   	$file2 = $REQUEST['recordingTwo'];
   	$audio = $REQUEST['audioFile'];
   	$ffmpeg = 'ffmpeg';
   	shell_exec($ffmpeg.' -i '.'/home/scriptcam/'.$file1.'.mp4 -qscale:v 1 '.'/home/scriptcam/'.$file1.'.mpg');
   	shell_exec($ffmpeg.' -i '.'/home/scriptcam/'.$file2.'.mp4 -qscale:v 1 '.'/home/scriptcam/'.$file2.'.mpg');
   	/*unlink('home/scriptcam/'.$file1.'.mp4');
   	unlink('home/scriptcam/'.$file2.'.mp4');
   	exec('cat '.'home/scriptcam/'.$file1.'mpg '.'home/scriptcam/'.$file2.'mpg > '.'home/scriptcam/'.$file1.$file2.'mpg');
   	unlink('home/scriptcam/'.$file1.'.mpg');
   	unlink('home/scriptcam/'.$file2.'.mpg');
   	exec($ffmpeg.' -i '.'home/scriptcam/'.$file1.$file2.'mpg'.' -i '.$audio.' -ab 192k -vcodec copy -shortest '.$file1.$file2.'1.mpg');
   	unlink('home/scriptcam/'.$file1.$file2.'.mpg');
   	echo 'home/scriptcam/'.$file1.$file2.'1.mpg';*/
  
 ?>