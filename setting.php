<?php include 'inc/header.php' ?>

<body>

	<?php include 'inc/nav.php' ?>

	<div class="mainCont center-width">
		<div id="options" class="options-cont">
			<form id="optionsForm" onsubmit="return false">
				<label>
					<span class="legend">Seed:</span>
					<input type="number" id="seed">
				</label>
				<div class="tool-cont tool-cont-r">
					<button id="settingButton" disabled>Generate!</button>
				</div>
			</form>
		</div>
		<div id="result">Please wait, loading data</div>
	</div>
</body>
<script src="js/rollbox.js"></script>
<script src="js/set.js"></script>

<?php include 'inc/footer.php' ?>
