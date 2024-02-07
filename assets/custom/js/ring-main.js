(function ($) {
  var data = [
    {number: "1", itemName: "Primary Energy", ratio: 1},
    {number: "2", itemName: "Human Resource", ratio: 1},
    {number: "3", itemName: "Training", ratio: 1},
    {number: "4", itemName: "Audit", ratio: 1},
    {number: "5", itemName: "Licences", ratio: 1},
    {number: "6", itemName: "ADP", ratio: 1},
    {number: "7", itemName: "Leasing", ratio: 1},
    {number: "8", itemName: "Geological Map", ratio: 1},
  ];

  // Color array.
  var color = d3
    .scaleOrdinal()
    .range([
      "rgb(242, 90, 42)",
      "#72007C",
      "#C36E30",
      "#B0A200",
      "#0B7E00",
      "#009A8D",
      "#004170",
      "#0180FF",
    ]);

  function svg() {
    var active;
    var rotate = 0;
    var width = 580;
    var height = 580;

    // Ring radiuses.
    var outerRadius;
    if (window.matchMedia("(max-width: 767px)").matches) {
      outerRadius = width / 2.5;
    } else {
      outerRadius = (height - 50) / 2.5;
    }

    var innerRadius = outerRadius / 3.5 + 10;

    // Chart definition.
    var pie = d3
      .pie()
      .padAngle(0.001)
      .value(function (d) {
        return d.ratio;
      })
      .sort(null)(data);

    // Chart's arc definition.
    var arc = d3
      .arc()
      .padRadius(outerRadius)
      .innerRadius(innerRadius)
      .startAngle(function (d) {
        return d.startAngle + Math.PI / 2 - 0.2;
      })
      .endAngle(function (d) {
        return d.endAngle + Math.PI / 2 - 0.2;
      });

    // Chart's label arc definition.
    var labelArc = d3
      .arc()
      .outerRadius(outerRadius - 10)
      .innerRadius(innerRadius - 10)
      .startAngle(function (d) {
        return d.startAngle + Math.PI / 2 - 0.2;
      })
      .endAngle(function (d) {
        return d.endAngle + Math.PI / 2 - 0.2;
      });

    var svg;
    if (window.matchMedia("(max-width: 767px)").matches) {
      // Create SVG inside the given element and main <g> element.
      svg = d3
        .select("#emrdRing")
        .append("svg")
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 ".concat(width, " ").concat(height))
        .attr("class", "svg-content")
        .append("g")
        .attr("class", "main-g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
    } else {
      // Create SVG inside the given element and main <g> element.
      svg = d3
        .select("#emrdRing")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("class", "main-g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
    }

    var mainG = d3.select(".main-g");

    // Creates <g> elements inside main <g>.
    var g = svg
      .selectAll("path")
      .data(pie)
      .enter()
      .append("g")
      .attr("id", function (d) {
        return "sdg-" + d.data.number;
      })
      .attr("class", function (d) {
        return "arc sector-disabled sdg-" + d.data.number;
      });

    var $sectors = $(".main-g").find(".arc");
    $sectors.each(function (el, value) {
      var id = value.getAttribute("id");
      var node = $(".view-content").find("." + id);
      if (node.length) {
        $("g#" + id).removeClass("sector-disabled");
      }
    });

    // Creates <path> elements inside <g>'s, fills them with exact color and sets onClick event.
    g.append("path")
      .each(function (d) {
        d.outerRadius = outerRadius - 20;
      })
      .attr("d", arc)
      .attr("id", function (d) {
        return "sdg-" + d.data.number;
      })
      .style("fill", function (d) {
        return color(d.data.number);
      })
      .on("click", enableElement(outerRadius + 20, 0));

    // Creates <text> elements inside <g>'s, center them and sets the label.
    g.append("text")
      .attr("transform", function (d) {
        return "translate(" + labelArc.centroid(d) + ")";
      })
      .attr("dx", "-34px")
      .attr("dy", "5px")
      .attr("class", "gtext")
      .text(function (d) {
        return d.data.itemName;
      })
      .style("fill", "#fff");

    // Variable for all text elements.
    var text = g.selectAll(".gtext");

    // Function that extends arc.
    function enableElement(outerRadius, delay) {
      return function (d) {
        if (typeof active !== "undefined") {
          setDefault(outerRadius - 40, 300);
        }
        $("#ringMainContainer").addClass("ringDataShow");
        active = this;
        rotate = 10.5 - ((d.startAngle + d.endAngle) / 2 / Math.PI) * 180;

        mainG
          .transition()
          .attr(
            "transform",
            "translate(" +
              width / 2 +
              "," +
              height / 2 +
              ") rotate(" +
              rotate +
              "," +
              0 +
              "," +
              0 +
              ")"
          )
          .duration(1000);

        text
          .transition()
          .attr("transform", function (dd) {
            return (
              "translate(" +
              labelArc.centroid(dd) +
              10 +
              ") rotate(" +
              -rotate +
              ")"
            );
          })
          .duration(1000);

        d3.select(this)
          .transition()
          .delay(delay)
          .attr("class", "active")
          .attrTween("d", function (d) {
            var i = d3.interpolate(d.outerRadius, outerRadius);
            return function (t) {
              d.outerRadius = i(t);
              return arc(d);
            };
          });

        var id = $(this).attr("id");
        if (id !== "") {
          setData(id);
        }
      };
    }

    // Function that set default size to the arc..
    function setDefault(outerRadius, delay) {
      d3.select(active)
        .transition()
        .delay(delay)
        .attr("class", "")
        .attrTween("d", function (d) {
          var i = d3.interpolate(d.outerRadius, outerRadius);
          return function (t) {
            d.outerRadius = i(t);
            return arc(d);
          };
        });
    }

    setFromHash();
  }

  function setFromHash() {
    $.fn.d3Click = function () {
      this.each(function (i, e) {
        var evt = new MouseEvent("click");
        e.dispatchEvent(evt);
      });
    };

    var selectedNode = window.location.hash.substring(1);
    var node = $("div.sdg-" + selectedNode);
    var elementToSelect = $("path#sdg-" + selectedNode);
    elementToSelect.trigger("click");
    elementToSelect.d3Click();

    // function d3Click() {
    //   var selectedNode = window.location.hash.substring(1);
    //   var node = $('div.sdg-' + selectedNode);
    //   if (selectedNode === '' || node.length === 0) {
    //     selectedNode = 1;
    //   }
    //   var elementToSelect = $('path#sdg-' + selectedNode);
    //   elementToSelect.trigger('click');
    //   elementToSelect.d3Click();
    //   setData('sdg-' + selectedNode);
    // }
  }

  function setData(id) {
    var nodeClass = "." + id;
    var hashNumber = id.replace("sdg-", "");
    $(".sdg-node").addClass("sdg-node-hidden");
    $(nodeClass).removeClass("sdg-node-hidden");

    var description = $.trim($(nodeClass + " .sdg-content-description").html());
    $(".sdg-ring-content-description").html(description);

    window.location.hash = "#".concat(hashNumber);
  }

  if (!$(".main-g").length) {
    var outerCircle = $("svg.outer-circle");
    var mobile = true;
    var isResizeble = true;
    $(window).on("load resize", function () {
      if (window.matchMedia("(max-width: 767px)").matches) {
        isResizeble = true;

        if (mobile) {
          if ($("#emrdRing > svg").length > 0) {
            $("#emrdRing > svg").remove();
          }
          svg();
          mobile = false;
        }

        $(".center-image").css("width", "120px");
        $(".center-image").css("height", "120px");
      } else if (isResizeble) {
        if ($("#emrdRing > svg").length > 0) {
          $("#emrdRing > svg").remove();
          $("#emrdRing").append(outerCircle);
        }
        $(".center-image").css("width", "145px");
        $(".center-image").css("height", "145px");
        svg();
        isResizeble = false;
        mobile = true;
      }
    });
  }

  // show tooltip
  $(window).on("load", function () {
    data.forEach((item) => {
      $(`#sdg-${item.number}`).on("mouseenter", function () {
        $("#ringChartToolTip").text(item.itemName);
        $("#ringChartToolTip").css({"z-index": "111", opacity: "1"});
      });
      $(`#sdg-${item.number}`).on("mouseleave", function (e) {
        $("#ringChartToolTip").css({"z-index": "0", opacity: "0"});
      });
    });
  });
})(jQuery);

$("#emrdRing").on("click", "path", function (e) {
  e.preventDefault();
  var $this = $(e.target);
  var fill = $this.attr("style");

  if (fill && fill.length > 0) {
    $(".outer-circle path").attr("style", fill);
    var p = fill.split(";");
    p.forEach(function (val) {
      var split = val.split(":");
      $(".center-image").css("backgroundColor", split[1]);
    });
  }
});
