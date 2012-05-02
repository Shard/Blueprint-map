<?php

require('jsmin.php');

$dir = dirname(realpath("build.php"));
$files = glob($dir . '/lib/*.js');
$js = file_get_contents($dir . '/lib/map.js');

foreach($files as $file) {
	if( strpos($file, 'map.js') ){ continue; }
    $js .= file_get_contents($file) . "\n";
}

file_put_contents($dir . '/build/blueprint.map.js', $js);
file_put_contents($dir . '/build/blueprint.map.min.js', JSMin::minify($js));
die('Build Complete');