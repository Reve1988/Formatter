/**
 * Created by giwoong.Kim on 2016. 6. 25..
 */
window.onload = function () {
    var btnFormat = document.getElementById("btnFormat");
    btnFormat.addEventListener("click", function () {
        var xml = document.getElementById("inputTextArea").value;
        var result = XML_DOCUMENT.xmlSpliter(xml);
        var rootElement = XML_DOCUMENT.parse(result);
        var resultString = XML_DOCUMENT.print(rootElement);

        // 원본 XML
        //console.log(xml);

        // 리스트
        var logArr = function (result) {
            var resultLenght = result.length;
            for (var i = 0; i < resultLenght; i++) {
                console.group("TagInfo[" + i + "]");
                switch (result[i].getType()) {
                    case 1 :
                        console.log("TAG_TYPE_COMMENT");
                        break;
                    case 2 :
                        console.log("TAG_TYPE_START");
                        break;
                    case 3 :
                        console.log("TAG_TYPE_END");
                        break;
                    case 4 :
                        console.log("TAG_TYPE_TEXTURE");
                        break;
                    case 5 :
                        console.log("TAG_TYPE_SINGLE");
                        break;
                    case 6 :
                        console.log("TAG_TYPE_DEFINITION");
                        break;
                    case 7 :
                        console.log("TAG_TYPE_DOCTYPE");
                        break;
                }
                console.log(result[i].getValue());
                console.groupEnd();
            }
        };

        // logArr(result);

        // rootElement.printElement(rootElement);
        console.log(resultString);

        // var textArea = document.getElementById("inputTextArea");
        // textArea.value = resultString;
    });
};