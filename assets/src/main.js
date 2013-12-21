(function(){
    //Aliases
    var $ = Document.prototype.querySelector.bind(document),
        $$ = Document.prototype.querySelectorAll.bind(document);

    Element.prototype.on = Element.prototype.addEventListener;

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

    $("#search").on("keyup", function(e){
        if (!this.value) {
            $("#searchResult").innerHTML = "";
            return;
        }
        var XHR = new XMLHttpRequest(),
            queryText = this.value;
        XHR.open('GET', '/search?' + "query=" + queryText);


        XHR.addEventListener("load", function(e){
            var data = JSON.parse(XHR.responseText),
                resultHtml = data.items.map(function(el, i) {
                    return "<div class='item'>" +
                        "<span class='grid-25'>" + higlightSearch(el.author, queryText) + "</span>" +
                        "<pre class='grid-75'>" + higlightSearch(el.poem, queryText) + "</pre>" +
                        "</div>"
                }).join(" ");

            $("#searchResult").innerHTML = resultHtml;
        })

        XHR.send();
    });

    $(".search.clear-btn").on("click", function(){
        $("#search").value = ""
        $("#searchResult").innerHTML = "";
    }, false);
})()