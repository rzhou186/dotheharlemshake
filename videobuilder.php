<?php

  $is_ajax = $_REQUEST['is_ajax'];

  if ($is_ajax == 1){

    $file1 = $_REQUEST['recordingOne'];
    $file2 = $_REQUEST['recordingTwo'];
    $audio = $_REQUEST['audioFile'];
    $ffmpeg = 'ffmpeg';

    $counter = 5;

    while ($counter > 0){

      if (file_exists('/home/scriptcam/'.$file1.'.mp4') && file_exists('/home/scriptcam/'.$file2.'.mp4')){

        shell_exec($ffmpeg.' -i '.'/home/scriptcam/'.$file1.'.mp4 -qscale:v 1 '.'/home/scriptcam/'.$file1.'.mpg');
        unlink('/home/scriptcam/'.$file1.'.mp4');
        shell_exec($ffmpeg.' -i '.'/home/scriptcam/'.$file2.'.mp4 -qscale:v 1 '.'/home/scriptcam/'.$file2.'.mpg');
        unlink('/home/scriptcam/'.$file2.'.mp4');
        shell_exec('cat '.'/home/scriptcam/'.$file1.'.mpg '.'/home/scriptcam/'.$file2.'.mpg > '.'/home/scriptcam/'.$file1.$file2.'.mpg');
        unlink('/home/scriptcam/'.$file1.'.mpg');
        unlink('/home/scriptcam/'.$file2.'.mpg');
        shell_exec($ffmpeg.' -i '.'/home/scriptcam/'.$file1.$file2.'.mpg'.' -i '.$audio.' -ab 192k -vcodec copy -shortest '.'/home/scriptcam/'.$file1.$file2.'1.mpg');
        unlink('/home/scriptcam/'.$file1.$file2.'.mpg');
        shell_exec($ffmpeg.' -i '.'/home/scriptcam/'.$file1.$file2.'1.mpg -vcodec libx264 -qscale:v 1 -strict experimental '.'/var/www/dotheharlemshake/videos/'.$file1.$file2.'.mp4');
        unlink('/home/scriptcam/'.$file1.$file2.'1.mpg');
        echo $file1.$file2.'.mp4';

        return;

      }

      else {
        sleep(5);
        $counter--;
      }

    }

    echo 'File processing failed.';

  }

?>