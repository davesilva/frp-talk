window.slideShown = {};
var $streams = $("<div class='streams'></div>");

/*************************
  Callback Search Example
 *************************/

// Simulates an ajax request by waiting a random amount
// of time before calling the callback
var makeAnAjaxRequest = function(request, callback) {
    setTimeout(function() {
        var result = {
            data: request,
            toString: function() {
                return request;
            }
        };

        callback(result);
    }, Math.random() * 3000);
};

// Shows the "results" of the search
var displayResults = function($this, results) {
    $this.find(".results").text("Showing results for \"" + results + "\"");
};

window.slideShown["callback_search"] = function($this) {
    $this.find(".search").keyup(function() {
        var query = $(this).val();

        makeAnAjaxRequest(query, function(results) {
            displayResults($this, results);
        });
    });
};

/*************************
  Counting Example
 *************************/

window.slideShown["counting_1"] = function($this) {
    var addOnes = $this.find(".add-one").asEventStream("click");
    addOnes.visualize("");
};

window.slideShown["counting_2"] = function($this) {
    var addOnes = $this.find(".add-one").asEventStream("click").map(function(value) {
        return 1;
    });

    addOnes.visualize("");
};

window.slideShown["counting_3"] = function($this) {
    var addOnes = $this.find(".add-one").asEventStream("click").map(function(value) {
        return 1;
    });

    var sum = addOnes.scan(0, function(sum, value) {
        return sum + value;
    });

    addOnes.visualize("");
    sum.visualize("");
};

window.slideShown["counting_4"] = function($this) {
    var addOnes = $this.find(".add-one").asEventStream("click").map(function(value) {
        return 1;
    });

    var sum = addOnes.scan(0, function(sum, value) {
        return sum + value;
    });

    sum.assign($this.find(".sum"), "text");
    addOnes.visualize("");
    sum.visualize("");
};

window.slideShown["counting_5"] = function($this) {
    var addOnes = $this.find(".add-one").asEventStream("click").map(function(value) {
        return 1;
    });

    var subOnes = $this.find(".sub-one").asEventStream("click").map(function(value) {
        return -1;
    });

    addOnes.visualize("");
    subOnes.visualize("");
};

window.slideShown["counting_6"] = function($this) {
    var addOnes = $this.find(".add-one").asEventStream("click").map(function(value) {
        return 1;
    });

    var subOnes = $this.find(".sub-one").asEventStream("click").map(function(value) {
        return -1;
    });

    var merged = addOnes.merge(subOnes);

    addOnes.visualize("");
    subOnes.visualize("");
    merged.visualize("");
};

window.slideShown["counting_7"] = function($this) {
    var addOnes = $this.find(".add-one").asEventStream("click").map(function(value) {
        return 1;
    });

    var subOnes = $this.find(".sub-one").asEventStream("click").map(function(value) {
        return -1;
    });

    var merged = addOnes.merge(subOnes);

    var sum = merged.scan(0, function(sum, value) {
        return sum + value;
    });

    sum.assign($this.find(".sum"), "text");

    merged.visualize("");
    sum.visualize("");
};

/*************************
  Calculator Example
 *************************/
function inputVal(e) {
    return $(e.currentTarget).val();
}

function sum(a, b) { return a + b; }

window.slideShown["calc_1"] = function($this) {
    var a = $this.find(".a").asEventStream("keyup")
                            .map(inputVal);

    var b = $this.find(".b").asEventStream("keyup")
                            .map(inputVal);

    a.visualize();
    b.visualize();
};

window.slideShown["calc_2"] = function($this) {
    var a = $this.find(".a").asEventStream("keyup")
                            .map(inputVal).map(parseInt);

    var b = $this.find(".b").asEventStream("keyup")
                            .map(inputVal).map(parseInt);

    a.visualize();
    b.visualize();
};

window.slideShown["calc_3"] = function($this) {
    var a = $this.find(".a").asEventStream("keyup")
                            .map(inputVal).map(parseInt).filter($.isNumeric)
                            .toProperty(0);

    var b = $this.find(".b").asEventStream("keyup")
                            .map(inputVal).map(parseInt).filter($.isNumeric)
                            .toProperty(0);

    a.visualize();
    b.visualize();
};

window.slideShown["calc_4"] = function($this) {
    var a = $this.find(".a").asEventStream("keyup")
                            .map(inputVal).map(parseInt).filter($.isNumeric)
                            .toProperty(0);

    var b = $this.find(".b").asEventStream("keyup")
                            .map(inputVal).map(parseInt).filter($.isNumeric)
                            .toProperty(0);

    var answer = a.combine(b, sum);

    answer.assign($this.find(".c"), "val");

    a.visualize();
    b.visualize();
    answer.visualize();
};

window.slideShown["search_1"] = function($this) {
    $this.find(".reset").click(function() {
        $streams.html("");
    });

    $this.find(".request").click(function() {
        var ajax = Bacon.fromCallback(function(callback) {
            console.log(callback);
            makeAnAjaxRequest("query", callback);
        });
        ajax.map(function() {
            return "rgb(255,255,255)";
        }).toProperty("rgb(0,0,0)").visualize();
    });
};

window.slideShown["search_2"] = function($this) {
    var query = $this.find(".search").asEventStream("keyup").map(inputVal);
    query.visualize();
};

window.slideShown["search_3"] = function($this) {
    var query = $this.find(".search").asEventStream("keyup").map(inputVal);
    var search = query.map(function(q) {
        var ajax = Bacon.fromCallback(function(callback) {
            makeAnAjaxRequest(q, callback);
        });
    });
    search.map(function() { return "rgb(0,0,0)"; }).visualize();
};

window.slideShown["search_4"] = function($this) {
    var query = $this.find(".search").asEventStream("keyup").map(inputVal);
    var search = query.flatMapLatest(function(q) {
        return Bacon.fromCallback(function(callback) {
            makeAnAjaxRequest(q, callback);
        });
    });
    query.map(function() { return "rgb(0,0,0)"; }).visualize();
    search.map(function(r) { return r.toString(); }).visualize();
};

window.slideShown["search_5"] = function($this) {
    var query = $this.find(".search").asEventStream("keyup").map(inputVal);
    var search = query.flatMapLatest(function(q) {
        return Bacon.fromCallback(function(callback) {
            makeAnAjaxRequest(q, callback);
        });
    });
    search.map(function(r) {
        return "Showing results for: \"" + r + "\"";
    }).assign($this.find(".results"), "text");
};

Reveal.addEventListener('slidechanged', function(event) {
    console.log("changed");
    var $this = $(event.currentSlide);
    var slideName = $this.data("slide-name");
    $streams.html("");
    $this.find(".viz").append($streams);

    if (slideShown[slideName] !== undefined) {
        slideShown[slideName]($this);
    }
});
