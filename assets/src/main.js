(function(){
    //Aliases
    var $ = Document.prototype.querySelector.bind(document),
        $$ = Document.prototype.querySelectorAll.bind(document);

    Element.prototype.$ = Element.prototype.querySelector;
    Element.prototype.$$ = Element.prototype.querySelectorAll;

    Element.prototype.on = Element.prototype.addEventListener;

    const LINE_HEIGHT = 21.4 //px

    function higlightSearch(text, query){
        var regExp = new RegExp("(\n[^\n]*){0,5}" + query + "([^\n]*\n){0,5}", "i"),
            exText = "\n" + text + "\n", // "\n" + text + "\n" - it is hak for simplifying regex. (It for select first and last strings.)
            match = exText.match(regExp),
            result;

        if (match){
            result = match[0].replace(new RegExp("(" + query + ")", "ig"), "<span class='highlight'>$1</span>")
        } else {
            result = text.match(/(\n?[^\n]*){0,8}/i)[0];
        }
        return result;
    }

    function getLocationQuery() {
        var result = {};

        decodeURI(window.location.search)
            .substring(1)
            .split("&")
            .forEach(function(el, i) {
                var params = el.split("=")
                result[params[0]] = params[1];
            });
        return result;
    }

    function search(query) {
        var XHR = new XMLHttpRequest();
        XHR.open('GET', '/search?' + "query=" + query);


        XHR.addEventListener("load", function(e){
            var data = JSON.parse(XHR.responseText),
                resultHtml = data.items.map(function(el) {
                    return "<a href='/poems/" + el._id + "' class='item'>" +
                        "<span class='grid-25'>" + higlightSearch(el.author, query) + "</span>" +
                        "<pre class='grid-75'>" + higlightSearch(el.poem, query) + "</pre>" +
                        "</a>"
                }).join(" ");

            $("#searchResult").innerHTML = resultHtml;
        })

        XHR.send();
    }

    var searchQuery = getLocationQuery().query;
    if (searchQuery) {
        $("#search").value = searchQuery;
        $("#search").select();
        search(searchQuery);
    }

    function claerAndCloseSearch() {
        history.replaceState({},"", "/");
        $("#search").value = ""
        $("#searchResult").innerHTML = "";
    }

    function closeSearch(){
        history.replaceState({},"", "/");
        $("#searchResult").innerHTML = "";
    };

    $("#search").on("keydown", function(e){
        var numbersOfLine;

        if (e.keyCode === 13 && !this.classList.contains("add")){ //Enter
            $(".super-form").classList.add("add");
            this.classList.add("add");

            closeSearch();
        }

        if (this.value.match(/\n/g)) {
            numbersOfLine = this.value.match(/\n/g).length;

            if (numbersOfLine > 10) {
                this.style.height = (numbersOfLine + 5) * LINE_HEIGHT + "px";
            }
        }

    });

    $("#search").on("keyup", function(e){
        e.preventDefault();

        if (this.value.indexOf("\n") + 1) { //Add mode
            $(".super-form").classList.add("add")
            this.classList.add("add");
            closeSearch();

        } else { //Search mode;
            $(".super-form").classList.remove("add")
            this.classList.remove("add");

            this.style.height = "33px";
            if (!this.value) {
                $("#searchResult").innerHTML = "";
                history.replaceState({},"", "/");
            } else {
                history.replaceState({},"", "?query=" + this.value);
                search(this.value);
            }
        }

    });

    $(".search.clear-btn").on("click", claerAndCloseSearch);
})()