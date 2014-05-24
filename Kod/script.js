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
    //Sista parametern i .open �r �ndrad fr�n true (asynkron h�mtning) till false f�r att resultatet
    //ska ha kommit innan funktionen returnerar. B�r ses �ver. Kan st�lla till problem
    xmlhttp.open("GET", "HtmlPage.html", false);
    xmlhttp.send();

    return codeHtml;
}

//BORTKOMMATERAR FUNGERANDE KOD OCH SKRIVER NY F�R TEST AV ATT L�GGA IHOP TV� CSS-DOKUMENT
//L�ser in defaultmallen f�r css 
//function loadCssDoc() {
//    var xmlhttp;

//    if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
//        xmlhttp = new XMLHttpRequest();
//    } else {// code for IE6, IE5
//        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
//    }

//    var codeCss;
//    xmlhttp.onreadystatechange = function () {
//        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
//            codeCss = xmlhttp.responseText;
//            loadCss(codeCss);
//            //console.log("laddat css");
//        }
//    }
//    //Sista parametern i .open �r �ndrad fr�n true (asynkron h�mtning) till false f�r att resultatet
//    //ska ha kommit innan funktionen returnerar. B�r ses �ver. Kan st�lla till problem
//    xmlhttp.open("GET", "StyleDefault.css", false);
//    //console.log("f�re s�nd");
//    xmlhttp.send();
//    //console.log("Efter s�nd");

//    return codeCss;
//}
 
function getCssLayout(StylesheetFile) {
     var xmlhttp;

     if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
         xmlhttp = new XMLHttpRequest();
     } else {// code for IE6, IE5
         xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
     }

     var codeLayout;
     xmlhttp.onreadystatechange = function () {
         if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
             codeLayout = xmlhttp.responseText;
             //loadCss(codeLayout); flyttad till onload f�r att sl� ihop b�da
             //console.log("laddat css");
         }
     }
     //Sista parametern i .open �r �ndrad fr�n true (asynkron h�mtning) till false f�r att resultatet
     //ska ha kommit innan funktionen returnerar. B�r ses �ver. Kan st�lla till problem
     xmlhttp.open("GET", StylesheetFile, false);
     //xmlhttp.open("GET", "StyleLayoutSimple.css", false);
     //console.log("f�re s�nd");
     xmlhttp.send();
     //console.log("Efter s�nd");

     return codeLayout;
 }

function getCssColor() {
 
 var xmlhttp;

 if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
  xmlhttp = new XMLHttpRequest();
 } else {// code for IE6, IE5
  xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
 }

 var codeColor;
 xmlhttp.onreadystatechange = function () {
  if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
   codeColor = xmlhttp.responseText;
   //loadCss(codeColor); flyttad till onload f�r att sl� ihop b�da
   //console.log("laddat css");
  }
 }
 //Sista parametern i .open �r �ndrad fr�n true (asynkron h�mtning) till false f�r att resultatet
 //ska ha kommit innan funktionen returnerar. B�r ses �ver. Kan st�lla till problem
 xmlhttp.open("GET", "StyleDefaultColor.css", false);
 //console.log("f�re s�nd");
 xmlhttp.send();
 //console.log("Efter s�nd");

 return codeColor;
}

window.onload = function () {

 //Bortkommenteras n�r jag testar nytt. Kan ta tillbaka som det �r
 //var codeHtml = loadHtmlDoc();
 //   var codeCss = loadCssDoc();
 //   console.log(codeCss);
 //   loadResult(codeHtml, codeCss);

 var codeHtml = loadHtmlDoc();
 var codeLayout = getCssLayout("StyleLayoutTwo.css");
 console.log(codeLayout);
 var codeColor = getCssColor();
 console.log(codeColor);
 var codeCss = codeColor + codeLayout;
 loadCss(codeCss);
     console.log(codeCss);
    loadResult(codeHtml, codeCss);

    $('#buttonUpdateCss').on('click', function () {
        var codeCss = $('#textareaCss').val();
        loadResult(codeHtml, codeCss);
    });
  
    prepareLogin();

    $('#saveTemplate').on('click', function () {
     saveCssTemplateToFirebase();
    });
    $('#loadTemplate').on('click', function () {
     loadCssTemplateFromFirebase();
    });
    $('#viewTemplates').on('click', function () {
     viewSavedTemplates();
    });
    $('#remove').on('click', function () {
     removeTemplate();
    });
 //$('#loginButton').on('click', function() {
 //    login();
 //});

 //$('#logoutButton').on('click', function() {
 //    logout(); 
 //});

 //$('#createUser').on('click', function () {
 //    createUser();
 //});
}