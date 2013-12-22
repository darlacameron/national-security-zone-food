$(document).ready(function() {
	var windowWidth = $(window).width(),
		mainWidth = $('.main-content').width(),
		windowLeft = -(windowWidth - mainWidth) / 2;


	$('.img-wrapper').on('mouseover', function() {
		$('.img-mask', $(this)).removeClass('mask-hidden');
	}).on('mouseout', function() {
		$('.img-mask', $(this)).addClass('mask-hidden');
	});

	$( ".img-wrapper" ).click(function() {
  		alert( "Testing" );
		// $('.img-mask', $(this)).removeClass('hidden');
	});

	$('.module').css({
		'width': windowWidth,
		'margin-left': windowLeft
	});
});

