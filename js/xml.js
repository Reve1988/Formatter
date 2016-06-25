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

    function Element() {
        this.parentElement;
        this.depth = 0;

        this.startTag;
        this.endTag;
        this.value = [];

        this.addValue = function (value) {
            this.value[this.value.length] = value;
        };
    }

    function TagInfo(type, value) {
        this.type = type;
        this.value = value;
    }

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

                            arr[arrIndex++] = new TagInfo(TAG_TYPE_COMMENT, "");
                            i += 2;
                            break;
                        case '/' :
                            arr[arrIndex++] = new TagInfo(TAG_TYPE_END, "");
                            break;
                        case ' ' :
                            break;
                        default :
                            arr[arrIndex++] = new TagInfo(TAG_TYPE_START, "");
                            arr[arrIndex - 1].value += xml[i];
                    }
                    break;
                case '>' :
                    arr[arrIndex++] = new TagInfo(TAG_TYPE_TEXTURE, "");
                    break;
                default :
                    switch (arr[arrIndex - 1].type) {
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
                                var nextTwoToken = xml[i] + xml[i + 1] + xml[i + 2];
                                if (nextTwoToken === "->") {
                                    i += 1;
                                    continue;
                                }
                            }

                            arr[arrIndex - 1].value += xml[i];
                            break;
                        case TAG_TYPE_START :
                            if (xml[i] === '/') {
                                if (xml[i + 1] !== '>') {
                                    throw new Exception;
                                }

                                i += 1;
                                arr[arrIndex - 1].type = TAG_TYPE_SINGLE;
                                continue;
                            }
                            arr[arrIndex - 1].value += xml[i];
                            break;
                        case TAG_TYPE_END :
                            arr[arrIndex - 1].value += xml[i];
                            break;
                        default :
                            arr[arrIndex - 1].value += xml[i];
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
            switch (xml[i].type) {
                case TAG_TYPE_START :
                    parent = current;
                    current = new Element();

                    current.startTag = xml[i].value;
                    current.depth = ++depth;

                    parent.addValue(current);

                    current.parentElement = parent;
                    break;
                case TAG_TYPE_END :
                    current.endTag = xml[i].value;

                    depth--;
                    current = current.parentElement;
                    parent = current.parentElement;
                    break;
                case TAG_TYPE_SINGLE :
                    parent = current;
                    current = new Element();

                    current.startTag = xml[i].value;
                    current.depth = ++depth;

                    parent.addValue(current);

                    current.parentElement = parent;

                    current.endTag = xml[i].value;

                    depth--;
                    current = current.parentElement;
                    parent = current.parentElement;
                    break;
                case TAG_TYPE_TEXTURE :
                    if (!stringUtils.isBlank(xml[i].value)) {
                        current.addValue(xml[i].value);
                    }
                    break;

            }

        }
        return root;
    };

    return {
        xmlSpliter: innerXmlSpliter,
        parse: innerParse
    }
})
();