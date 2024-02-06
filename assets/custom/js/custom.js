
/**
 * Top Searchbar
 */
(function ($){
    "use strict";

    function sdgTopSearch(){
        var sdgSrcBtnIcon = $(".topBtnSrc");
        var sdgSrcContentainer = $("#searchOuter");
        var sdgSrcContentClose = $(".sdgSrcClose");

        sdgSrcBtnIcon.on('click', function () {
            sdgSrcContentainer.toggleClass('sdgSrcOpen');
            $('body').toggleClass('scrollOff');
            console.log('Clicked Src')
        });

        sdgSrcContentClose.on('click', function () {
            sdgSrcContentainer.toggleClass('sdgSrcOpen');
            $('body').toggleClass('scrollOff');
        });

        $(document).keyup(function (e) {
			if ( sdgSrcContentainer.hasClass('sdgSrcOpen') && e.keyCode === 27 ) {
				sdgSrcContentainer.removeClass('sdgSrcOpen');
				$('body').removeClass('scrollOff');
			}
		});
    }
    sdgTopSearch();

})(jQuery);

/**
 * Start Document Ready Function
 */
$(document).ready(function(){

    $('.emrdNews').easyTicker();

});
