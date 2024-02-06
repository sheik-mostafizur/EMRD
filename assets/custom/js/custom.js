/**
 * Top Searchbar
 */
(function ($) {
  "use strict";

  function sdgTopSearch() {
    var sdgSrcBtnIcon = $(".topBtnSrc");
    var sdgSrcContentainer = $("#searchOuter");
    var sdgSrcContentClose = $(".sdgSrcClose");

    sdgSrcBtnIcon.on("click", function () {
      sdgSrcContentainer.toggleClass("sdgSrcOpen");
      $("body").toggleClass("scrollOff");
      console.log("Clicked Src");
    });

    sdgSrcContentClose.on("click", function () {
      sdgSrcContentainer.toggleClass("sdgSrcOpen");
      $("body").toggleClass("scrollOff");
    });

    $(document).keyup(function (e) {
      if (sdgSrcContentainer.hasClass("sdgSrcOpen") && e.keyCode === 27) {
        sdgSrcContentainer.removeClass("sdgSrcOpen");
        $("body").removeClass("scrollOff");
      }
    });
  }
  sdgTopSearch();
})(jQuery);

/**
 * Start Document Ready Function
 */
$(document).ready(function () {
  $(".emrdNews").easyTicker();
});

$(document).ready(function () {
  function resizeSVG() {
    var $container = $(".home-emrd-dashboard .container"),
      width = $container.width(),
      height = $container.height(),
      scale = Math.min(width / 400, height / 400); // Assuming the original SVG size is 200x200
    console.log(scale);
    $(
      "#ringMainContainer:not(.ringDataShow) .emrd-ring-container .sdg-wheel-wrap .c-ring"
    ).css("transform", "scale(" + scale + ")");
  }

  // Call resizeSVG on window resize and initial load
  $(window).resize(resizeSVG);
  resizeSVG();
});
