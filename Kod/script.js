"use strict";
//var codeHtml = "<!DOCTYPE html>\n<html>\n\t<head>\n\t\t<meta charset='utf-8' />\n \t</head>\n \t<body>\n \t\t<div id=content>\n \t\t\t<p>PluppsMupps</p>\n \t\t</div>\n \t</body>\n</html>";
var codeBody = "<div id=content>\n \t\t\t<p>Plupp</p>\n \t\t</div>";
//var codeCss = "body {\n \tbackground-color: red;\n}";

function htmlEncode(value) {
    return $('<div/>').text(value).html();
}

function loadHtml(codeHtml) {

    $('#html').append($('<pre></pre>'));
    $('#html pre').append(htmlEncode(codeHtml));
}

function loadCss(codeCss) {
    $('#textareaCss').val(htmlEncode(codeCss));
}

function loadResult(codeHtml, codeCss) {
    
    var iframeResult = document.getElementById('iframeResult');
    //iframeResult.srcdoc = codeHtml;

    setTimeout(function () {
        iframeResult.contentDocument.head.appendChild(document.createElement("style"));

        var styleTag = iframeResult.contentDocument.getElementsByTagName('style');
        styleTag[0].innerHTML = codeCss;
    }, 300);
}

function loadHtmlDoc() {
    var xmlhttp;
    if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else {// code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    var codeHtml;
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            codeHtml = xmlhttp.responseText;
            loadHtml(codeHtml);
            
        }
    }
    //Sista parametern i .open är ändrad från true (asynkron hämtning) till false för att resultatet
    //ska ha kommit innan funktionen returnerar. Bör ses över. Kan ställa till problem
    xmlhttp.open("GET", "HtmlPage.html", false);
    xmlhttp.send();

    return codeHtml;
}
//Läser in defaultmallen för css
function loadCssDoc() {
    var xmlhttp;

    if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else {// code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }

    var codeCss;
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            codeCss = xmlhttp.responseText;
            loadCss(codeCss);
            //console.log("laddat css");
        }
    }
    //Sista parametern i .open är ändrad från true (asynkron hämtning) till false för att resultatet
    //ska ha kommit innan funktionen returnerar. Bör ses över. Kan ställa till problem
    xmlhttp.open("GET", "StyleDefault.css", false);
    //console.log("före sänd");
    xmlhttp.send();
    //console.log("Efter sänd");

    return codeCss;
}

window.onload = function () {

    var codeHtml = loadHtmlDoc();
    var codeCss = loadCssDoc();
    loadResult(codeHtml, codeCss);

    $('#buttonUpdateCss').on('click', function () {
        var codeCss = $('#textareaCss').val();
        loadResult(codeHtml, codeCss);
    });

    $('#loginButton').on('click', function() {
        login();
    });

    $('#logoutButton').on('click', function() {
        logout(); 
    });

    $('#createUser').on('click', function () {
        createUser();
    });
    $('#saveTemplate').on('click', function () {
        saveCssTemplateToFirebase();
    })
    $('#loadTemplate').on('click', function () {
        loadCssTemplateFromFirebase();
    })
    $('#viewTemplates').on('click', function () {
        viewSavedTemplates();
        alert('Visa');
    })
}