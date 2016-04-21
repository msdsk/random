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
				<label title="number of items to generate at one go">
					<span class="legend">And next:</span>
					<input type="number" id="no" value="5" max="100" min="1">
				</label>
				<div class="tool-cont tool-cont-r">
					<button id="itemButton" disabled>Generate!</button>
				</div>
			</form>
		</div>
		<div id="result">Please wait, loading data</div>
	</div>
</body>
<script src="js/rollbox.js"></script>
<script src="js/item.js"></script>

<?php include 'inc/footer.php' ?>