/**
 * Created by giwoong.Kim on 2016. 6. 25..
 */
window.onload = function () {
    var btnFormat = document.getElementById("btnFormat");
    btnFormat.addEventListener("click", function () {
        var xml = document.getElementById("inputTextArea").value;
        var result = XML_DOCUMENT.xmlSpliter(xml);
        console.log(xml);
        console.log(result);
        console.log(XML_DOCUMENT.parse(result));
    });
};