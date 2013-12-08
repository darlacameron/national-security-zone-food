$('.img-wrapper').on('mouseover', function() {
	$('.img-mask', $(this)).removeClass('mask-hidden');
}).on('mouseout', function() {
	$('.img-mask', $(this)).addClass('mask-hidden');
});