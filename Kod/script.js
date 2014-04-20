"use strict";
var codeHtml = "<!DOCTYPE html>\n<html>\n\t<head>\n\t\t<meta charset='utf-8' />\n \t</head>\n \t<body>\n \t\t<div id=content>\n \t\t\t<p>PluppsMupps</p>\n \t\t</div>\n \t</body>\n</html>";
var codeBody = "<div id=content>\n \t\t\t<p>Plupp</p>\n \t\t</div>";
    var codeCss = "body {\n \tbackground-color: red;\n}";

function htmlEncode(value) {
    return $('<div/>').text(value).html();
}

function loadHtml() {
    
    $('#html').append($('<pre></pre>'));
    $('#html pre').append(htmlEncode(codeHtml));
}

function loadCss() {

    $('#css').append($('<pre></pre>'));
    $('#css pre').append(htmlEncode(codeCss));

}
function loadResult () {
     var iframeResult=document.getElementById('iframeResult');
               
     iframeResult.srcdoc=codeHtml;
     
     setTimeout(function(){
        iframeResult.contentDocument.head.appendChild(document.createElement("style"));

         var tmp = iframeResult.contentDocument.getElementsByTagName('style');
         console.log(tmp);
         tmp[0].innerHTML=codeCss;
         //tmp[0].innerHTML="body {background-color:green}";
         console.log($(document.getElementsByTagName('iframe')[0].contentDocument).find('style'));
         //$(document.getElementsByTagName('iframe')[0].contentDocument).find('style').text('body {color:green}')
     }, 100);
     
     //console.log(iframeResult);
    //document.getElementById('iframeResult').innerHTML='<h1>Plupp</h1>';
}
window.onload = function() {
    loadHtml();
    loadCss();
    loadResult();
}
