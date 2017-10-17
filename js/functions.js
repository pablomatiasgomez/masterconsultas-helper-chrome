(function() {
	var BASE_PAGE = "/socios/context/index.action";

	if (location.pathname !== BASE_PAGE) return;

	var utils = new Utils();

	if ($("#tablaMonthlyBill1").length) {
		return MonthlyBillTable($("#tablaMonthlyBill1"), utils);
	}
})();
