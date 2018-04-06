var MonthlyBillTable = function($container, utils) {

	var $headerTable;
	var $table;
	var $pageSizeSelector;

	var SHARE_REGEX = /^\d+\/\d+$/;

	var DETAIL_BY_DATE = {
	};

	function setItems() {
		$headerTable = $container.find("table.ui-jqgrid-htable");
		if ($headerTable.length !== 1) throw "headerTable not found, or more than one found! weird..";

		$table = $container.find("table#gridtable");
		if ($table.length !== 1) throw "table not found, or more than one found! weird..";

		$pageSizeSelector = $container.find("select.ui-pg-selbox");
		if ($pageSizeSelector.length !== 1) throw "pageSizeSelector not found, or more than one found! weird..";
	}

	function setPageSizeToMax() {
		var lastValue = $pageSizeSelector.find("option:last").val();
		$pageSizeSelector.val(lastValue);
		triggerEvent($pageSizeSelector, "change");
	}

	function addDebtAmountColumn() {
		// Just having a validation if the page changes something...
		if ($table.find("tr.jqgfirstrow td:eq(0)").css("width") !== "133px") {
			throw "The dates width changed.. Stopping.!";
		}

		function getHeaderHtml(id, width, text) {
			return `<th id="gridtable_${id}" role="columnheader" class="ui-state-default ui-th-column ui-th-ltr" style="width: ${width};"><div id="jqgh_gridtable_${id}" class="ui-jqgrid-sortable">${text}</div></th>`;
		}

		$headerTable.find("th#gridtable_dateOperation").css("width", "60px").find(">div").text("F. Operacion");       // Substracting 73px to each date field..
		$headerTable.find("th#gridtable_datePresentation").css("width", "60px").find(">div").text("F. Presentacion"); // Substracting 73px to each date field..
		$headerTable.find("th#gridtable_detailOperation").css("width", "220px").after(getHeaderHtml("moreDetail", "150px", "Detalle")); // Using 15px of the date fields..
		$headerTable.find("th#gridtable_share").css("width", "40px").find(">div").text("Cuotas"); // Cantidad de cuotas ... making smaller..
		$headerTable.find("th#gridtable_totalInPesos").after(getHeaderHtml("realTotalInPesos", "70px", "Total $")); // Space for amount
		$headerTable.find("th#gridtable_totalInPesos").after(getHeaderHtml("totalInPesosLeft", "60px", "Restante $")); // Space for amount left
		$headerTable.find("th#gridtable_totalInDollars").css("width", "55px"); // This is just bugged in the original page..

		$table.find("tr.jqgfirstrow td:eq(0)").css("width", "60px"); // Substracting 73px to each date field..
		$table.find("tr.jqgfirstrow td:eq(1)").css("width", "60px"); // Substracting 73px to each date field..
		$table.find("tr.jqgfirstrow td:eq(2)").css("width", "220px").after('<td role="gridcell" style="height:0px;width:150px;"></td>'); // Using 15px of the date fields..
		$table.find("tr.jqgfirstrow td:eq(4)").css("width", "40px"); // Cantidad de cuotas ... making smaller..
		$table.find("tr.jqgfirstrow td:eq(5)").after('<td role="gridcell" style="height:0px;width:70px;"></td>'); // Space for amount
		$table.find("tr.jqgfirstrow td:eq(5)").after('<td role="gridcell" style="height:0px;width:60px;"></td>'); // Space for amount left
		$table.find("tr.jqgfirstrow td:eq(8)").css("width", "55px"); // This is just bugged in the original page..

		setTimeout(function() {
			var total = 0;
			var totalLeft = 0;
			var totalSet = false;
			$table.find("tr").each(function() {
				var date = $(this).find("td[aria-describedby=gridtable_dateOperation]").text().trim();
				var share = $(this).find("td[aria-describedby=gridtable_share]").text().trim();
				var amountPerShare = utils.parseValueToFloat($(this).find("td[aria-describedby=gridtable_totalInPesos]").text().trim());
				var description = $(this).find("td[aria-describedby=gridtable_detailOperation]").text().trim();

				var amountStr = "";
				var amountLeftStr = "";
				if (SHARE_REGEX.test(share) && description !== "SU PAGO") {
					var shares = parseInt(share.split("/")[1]);
					var sharesLeft = shares - (share.split("/")[0] - 1); // Minus 1 because I want to count the one that I haven't paid yet.
					var amount = shares * amountPerShare;
					var amountLeft = sharesLeft * amountPerShare;

					total += amount;
					totalLeft += amountLeft;
					amountStr = utils.parseValueToString(amount);
					amountLeftStr = utils.parseValueToString(amountLeft);
				} else if ($(this).hasClass("gridTotal") && description.indexOf("Total de Consumos") !== -1 && totalSet === false) {
					totalSet = true;
					amountStr = utils.parseValueToString(total);
					amountLeftStr = utils.parseValueToString(totalLeft);
				}

				let moreDetail = DETAIL_BY_DATE[date] || '';
				$(this).find("td[aria-describedby=gridtable_detailOperation]").after('<td role="gridcell" style="text-align:left;" title="' + moreDetail + '">' + moreDetail + '</td>');
				$(this).find("td[aria-describedby=gridtable_totalInPesos]").after('<td role="gridcell" style="text-align:center;" title="' + amountStr + '">' + amountStr + '</td>');
				$(this).find("td[aria-describedby=gridtable_totalInPesos]").after('<td role="gridcell" style="text-align:center;" title="' + amountLeftStr + '">' + amountLeftStr + '</td>');
			});
		}, 1500); // TODO ?
	}

	function triggerEvent($obj, eventName) {
		$obj[0].dispatchEvent(new Event(eventName));
	}

	// Init
	(function() {
		setItems();
		setTimeout(function() {
			setPageSizeToMax();
			addDebtAmountColumn();
		}, 1500); // TODO ?
	})();

	// Public
	return {};
};
