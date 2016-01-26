<!DOCTYPE html>
<html lang="pl">
<head>
	<meta id="viewport" name="viewport" content ="width=device-width, minimum-scale=1, maximum-scale=1, initial-scale=1" />
	<meta charset="utf-8">
	<link href='http://fonts.googleapis.com/css?family=Fira+Sans:400,400italic,700,300&subset=latin,latin-ext' rel='stylesheet' type='text/css'>
	<link rel="stylesheet" type="text/css" href="style.css">
	<link rel="icon" type="image/ico" href="favicon.ico" >
	<script src="js/layoutbox.js"></script>
	<title>Random generator</title>
</head>
<body>
	<div class="main-cont">
		<div id="options" class="options-cont">
			<form action="">
				<label>
					Seed:
					<input type="number" id="seed">
				</label>
				<div class="tool-cont tool-cont-r">
					<button id="settingButton" disabled>Generate!</button>
				</div>
			</form>
		</div>
		<div id="result" class="center-width">Please wait, loading data</div>
	</div>
</body>
<script src="js/rollbox.js"></script>
<script src="js/set.js"></script>
</html>