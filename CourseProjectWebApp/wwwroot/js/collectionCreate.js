$('#addAdditional').on('click', function (e) {
	e.preventDefault();
	addField();
});

function addField() {
	let counter;
	if ($('#counterOfAddStr').length == 0) {
		counter = $('.formClone').find('h2').find('span').text();
		counter++;
	} else {
		counter = $('#counterOfAddStr').text();
		$('#counterOfAddStr').text(parseInt(counter) + 1);
	}
	fillAndAppend(counter);
}

function fillAndAppend(counter) {
	let cloneItem = $('.formClone').clone();
	cloneItem.find('h2').find('span').text(parseInt(counter) + 1);
	cloneItem.find('.additionalStringName').find('label').attr('for', 'AdditionalStrings_' + counter + '__Name');
	cloneItem.find('.additionalStringName').find('input').attr('id', 'AdditionalStrings_' + counter + '__Name').attr('name', 'AdditionalStrings[' + counter + '].Name');
	cloneItem.find('.additionalStringName').find('span').attr('data-valmsg-for', 'AdditionalStrings[' + counter + '].Name');
	cloneItem.find('.additionalTypeOfData').find('label').attr('for', 'AdditionalStrings_' + counter + '__TypeOfData');
	cloneItem.find('.additionalTypeOfData').find('select').attr('id', 'AdditionalStrings_' + counter + '__TypeOfData').attr('name', 'AdditionalStrings[' + counter + '].TypeOfData');
	cloneItem.find('.additionalStringName').find('span').attr('data-valmsg-for', 'AdditionalStrings[' + counter + '].TypeOfData');
	cloneItem.removeClass('visually-hidden').removeClass('formClone');
	$('#additionalFields').append(cloneItem);
	$('.formClone').find('h2').find('span').text(counter);
}