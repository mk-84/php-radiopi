<!DOCTYPE html>
<?php
	include("functions.php");

	$filename = "./sender.m3u";
	$param = getParameter("do");
	if(isset($param) && $param != null)
		$executionResult = doExecution($param, $filename);
?>
<html lang="de">
<head>
	<meta charset="utf-8"/>
	<title>Raspberry Pi Internet Radio</title>
	<link rel="stylesheet" type="text/css" href="bootstrap/css/bootstrap.min.css" />
	<style>
		@media (max-width: 991px) {
			body {
				font-size: 200%;
			}
			.container {
				max-width:100%;
			}
		}
	</style>
	<script language="javascript" type="text/javascript" src="js/jquery-2.1.3.min.js"></script>
	<script language="javascript" type="text/javascript" src="js/script.js?v=6"></script>
	<script defer src="js/fontawesome-all.min.js"></script>
	<script>
	$(document).ready(function()
	{
		toggle();
		loadStatus();
	});
	</script>
</head>
<body>
	<div class="container">
		<nav class="navbar navbar-dark bg-primary navbar-fill">
			<a class="navbar-brand" href="javascript:play();">
				<i class="fas fa-3x fa-play"></i>
			</a>
			<a class="navbar-brand" href="javascript:stop();">
				<i class="fas fa-3x fa-stop"></i>
			</a>
			<a class="navbar-brand" href="javascript:toggle();">
				<i class="fas fa-3x fa-wrench"></i>
			</a>
			<a class="navbar-brand" href="javascript:shutdown();">
				<i class="fas fa-3x fa-power-off"></i>
			</a>
		</nav>
		<nav class="navbar navbar-dark bg-primary navbar-fill">
			<span class="input-group">
				<a class="navbar-brand" href="javascript:minus();">
					<i class="fas fa-3x fa-volume-down"></i>
				</a>
				<input id="volume" type="range" min=0 max=100 class="form-control" style="margin:24px" onchange="changeVolume('change')" oninput="changeVolume('input')" />
				<a class="navbar-brand" href="javascript:plus();">
					<i class="fas fa-3x fa-volume-up"></i>
				</a>
			</span>
		</nav>
		
		<div id="status"></div>

		<table id="playlist" class="table table-hover table-striped table-primary">
			<tbody>
<?php	$maxUrlLength = 40;
		$file = fopen($filename, "r");
		$index = 1;
		fgets($file, 1024); // ignore first row
		while(!feof($file))
		{
			$senderName = fgets($file, 1024);
			$senderUrl = fgets($file, 1024);
			if(!empty($senderName) && substr($senderName, 0, 11) == "#EXTINF:-1," && !empty($senderUrl) && substr($senderUrl, 0, 1) != "#")
			{
				$senderName = substr($senderName, 11);
				if(strlen($senderUrl) > $maxUrlLength)
					$senderUrl = substr($senderUrl, 0, $maxUrlLength)."...";
?>				<tr>
					<td onclick="javascript:play(<?php echo $index; ?>);" class="addhide" style="width:50%; display:none; cursor:pointer;"><?php echo $senderName; ?></td>
					<td onclick="javascript:play(<?php echo $index; ?>);" class="addhide" style="width:50%; display:none; cursor:pointer;"><?php echo $senderUrl; ?></td>
				
					<td class="addhide" style="width:50%;"><?php echo $senderName; ?></td>
					<td class="addhide" style="width:50%;"><?php echo $senderUrl; ?></td>
				
					<td onclick="javascript:removeEntry(<?php echo $index ?>);" class="addhide" style="cursor:pointer;">
						<i class="fas fa-minus"></i>
					</td>
				</tr>
<?php			$index++;
			}
		}
		fclose($file);
?>				<tr id="add" class="addhide">
					<td>
						<input type="text" id="addName" class="form-control" />
					</td>
					<td>
						<input type="text" id="addUrl" class="form-control" />
					</td>
					<td onclick="javascript:addEntry();" style="cursor:pointer;">
						<i class="fas fa-plus"></i>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</body>
</html>
