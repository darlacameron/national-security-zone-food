$(document).ready(function() {
	var windowWidth = $(window).width(),
		mainWidth = $('.main-content').width(),
		windowLeft = -(windowWidth - mainWidth) / 2;


	$('.img-wrapper').on('mouseover', function() {
		$('.img-mask', $(this)).removeClass('mask-hidden');
	}).on('mouseout', function() {
		$('.img-mask', $(this)).addClass('mask-hidden');
	});

	$('.module').css({
		'width': windowWidth,
		'margin-left': windowLeft
	});
});

