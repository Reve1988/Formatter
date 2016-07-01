/**
 * Created by giwoong.Kim on 2016. 6. 25..
 */
var XML_DOCUMENT = (function () {
    // var TAG_TYPE_DTD = 0;
    var TAG_TYPE_COMMENT = 1;
    var TAG_TYPE_START = 2;
    var TAG_TYPE_END = 3;
    var TAG_TYPE_TEXTURE = 4;
    var TAG_TYPE_SINGLE = 5;

    var innerXmlSpliter = function (xml) {
        var arr = [];
        var arrIndex = 0;

        var isFirst = true;
        for (var i = 0; i < xml.length; i++) {
            if (isFirst) {
                // remove first blank
                if (stringUtils.isBlank(xml[i])) {
                    continue;
                }

                // error if is not starting tag
                if (xml[i] !== '<') {
                    throw new Error();
                }

                isFirst = false;
            }

            switch (xml[i]) {
                case '<' :
                    i += 1;
                    switch (xml[i]) {
                        // case '?' :
                        //     arr[arrIndex++] = new TagInfo(TAG_TYPE_DTD, "");
                        //     break;
                        case '!' :
                            var nextTwoToken = xml[i + 1] + xml[i + 2];
                            if (nextTwoToken !== "--") {
                                throw new Error();
                            }

                            arr[arrIndex] = new TagInfo(TAG_TYPE_COMMENT, "");
                            arrIndex++;
                            i += 2;
                            break;
                        case '/' :
                            arr[arrIndex] = new TagInfo(TAG_TYPE_END, "");
                            arrIndex++;
                            break;
                        default :
                            arr[arrIndex] = new TagInfo(TAG_TYPE_START, "");
                            arr[arrIndex].addValue(xml[i]);
                            arrIndex++;
                    }
                    break;
                case '>' :
                    arr[arrIndex++] = new TagInfo(TAG_TYPE_TEXTURE, "");
                    break;
                default :
                    switch (arr[arrIndex - 1].getType()) {
                        // case TAG_TYPE_DTD :
                        //     if (xml[i] === '?') {
                        //         if (xml[i + 1] !== '>') {
                        //             throw new Error();
                        //         }
                        //         i += 1;
                        //         continue;
                        //     }
                        //
                        //     arr[arrIndex - 1].value += xml[i];
                        //     break;
                        case TAG_TYPE_COMMENT :
                            if (xml[i] === '-') {
                                var nextTwoToken = xml[i + 1] + xml[i + 2];
                                if (nextTwoToken === "->") {
                                    i += 1;
                                    continue;
                                }
                            }

                            arr[arrIndex - 1].addValue(xml[i]);
                            break;
                        case TAG_TYPE_START :
                            if (xml[i] === '/') {
                                if (xml[i + 1] !== '>') {
                                    throw new Error();
                                }

                                arr[arrIndex - 1].setType(TAG_TYPE_SINGLE);
                                continue;
                            }
                            arr[arrIndex - 1].addValue(xml[i]);
                            break;
                        case TAG_TYPE_END :
                            arr[arrIndex - 1].addValue(xml[i]);
                            break;
                        default :
                            arr[arrIndex - 1].addValue(xml[i]);
                    }
            }
        }

        return arr;
    };

    var innerParse = function (xml) {
        var root = new Element();
        var parent = root;
        var current = parent;

        var depth = 0;
        for (var i = 0; i < xml.length; i++) {
            switch (xml[i].getType()) {
                case TAG_TYPE_START :
                    parent = current;
                    current = new Element();

                    current.setDepth(depth++);
                    current.setStartTag(xml[i].getValue().trim());
                    current.setType(xml[i].getType());
                    current.setParentElement(parent);

                    parent.addValue(current);

                    break;
                case TAG_TYPE_END :
                    current.setEndTag(xml[i].getValue().trim());
                    current.setDepth(depth--);

                    current = current.getParentElement();
                    parent = current.getParentElement();

                    break;
                case TAG_TYPE_SINGLE :
                case TAG_TYPE_COMMENT :
                    parent = current;
                    current = new Element();

                    current.setDepth(depth + 1);
                    current.setStartTag(xml[i].getValue().trim());
                    current.setType(xml[i].getType());
                    current.setParentElement(parent);

                    parent.addValue(current);

                    current.setEndTag(xml[i].getValue().trim());

                    current = current.getParentElement();
                    parent = current.getParentElement();

                    break;
                case TAG_TYPE_TEXTURE :
                    var text = xml[i].getValue();
                    if (!stringUtils.isBlank(text)) {
                        current.addValue(text.trim());
                    }

                    break;
            }
        }

        return root;
    };

    var innerPrintByFormat = function (rootElement) {
        var printRecursive = function (element, result) {
            if (typeof element === 'string') {
                return result + element + '\n';
            }

            if (element.getType() === TAG_TYPE_SINGLE) {
                result += printDepth(element.getDepth());
                result += "<" + element.getStartTag() + "/>\n";
                return result;
            }

            if (element.getType() === TAG_TYPE_COMMENT) {
                result += printDepth(element.getDepth());
                result += "\<\!\-\-" + element.getStartTag() + "\-\-\>\n";
                return result;
            }


            if (typeof element.getStartTag() === 'string') {
                result += printDepth(element.getDepth());
                result += "<" + element.getStartTag() + ">\n";
            }
            for (var i = 0; i < element.getValueSize(); i++) {
                result = printRecursive(element.getValue(i), result);
            }
            if (typeof element.getEndTag() === 'string') {
                result += printDepth(element.getDepth());
                result += "</" + element.getEndTag() + ">\n";
            }
            return result;
        };

        return printRecursive(rootElement, "");
    };

    var printDepth = function (depth) {
        var blank = "";
        for (var i = 1; i < depth; i++) {
            blank += "    ";
        }

        return blank;
    };

    function TagInfo(type, value) {
        var type = type;
        var value = value;

        this.setType = function (tagType) {
            type = tagType;
        };

        this.getType = function () {
            return type;
        };

        this.addValue = function (tagValue) {
            value += tagValue;
        };

        this.getValue = function () {
            return value;
        }
    }

    function Element() {
        var parentElement;
        var depth = 0;
        var type;

        var startTag;
        var value = [];
        var endTag;

        this.setParentElement = function (element) {
            parentElement = element;
        };

        this.getParentElement = function () {
            return parentElement;
        };

        this.setDepth = function (dep) {
            return depth = dep;
        };

        this.getDepth = function () {
            return depth;
        };

        this.setType = function (tagType) {
            type = tagType;
        };

        this.getType = function () {
            return type;
        };

        this.isType = function (tagType) {
            return type === tagType;
        };

        this.setStartTag = function (tag) {
            startTag = tag;
        };

        this.getStartTag = function () {
            return startTag;
        };

        this.getValue = function (index) {
            if (index === undefined) {
                return value;
            }

            return value[index];
        };

        this.addValue = function (tagValue) {
            value[value.length] = tagValue;
        };

        this.getValueSize = function () {
            return value.length;
        };

        this.setEndTag = function (tag) {
            endTag = tag;
        };

        this.getEndTag = function () {
            return endTag;
        };

        this.printElement = function (v) {
            console.group();
            console.log("startTag : " + v.getStartTag());
            console.log("depth : " + v.getDepth());
            console.log("type : " + v.getType());
            console.log("valueSize : " + v.getValueSize());
            for (var i = 0; i < v.getValueSize(); i++) {
                var value = v.getValue(i);
                if (typeof value === 'string') {
                    console.group();
                    console.log("string : " + value);
                    console.groupEnd();
                    continue;
                }
                value.printElement(value);
            }
            console.log("endTag : " + v.getEndTag());
            console.groupEnd();
        }
    }

    return {
        xmlSpliter: innerXmlSpliter,
        parse: innerParse,
        printByFormat: innerPrintByFormat
    }
})
();