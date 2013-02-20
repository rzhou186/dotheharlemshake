<?php
   	//	unlink($_POST['data']);
   		$myfile = "testFile.txt";
   		$fh = fopen($myfile, 'w');
   		$stringData = "Floppy Jalopy\n";
		fwrite($fh, $stringData);
		$stringData = "Pointy Pinto\n";
		fwrite($fh, $stringData);
		fclose($fh);
?>