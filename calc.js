function calculateTip(){
	var numSubTotal = document.getElementsByName("numSubTotal")[0];
	var numTipPercent = document.getElementsByName("numTipPercent")[0];
	var totalAmount = document.getElementsByName("totalAmount")[0];
		console.log(numSubTotal);
		console.log(typeof(numSubTotal));
		console.log(numTipPercent);
		console.log(typeof(numTipPercent));
		console.log(totalAmount);
		console.log(typeof(totalAmount));
	var numTipAmount = numSubTotal.value * numTipPercent.value[0]/100;
	totalAmount.innerHTML = numSubTotal.value + numTipAmount;
		console.log(totalAmount[0]);
		console.log(typeof(totalAmount[0]));
}
