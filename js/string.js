/**
 * Created by giwoong.Kim on 2016. 6. 25..
 */
var stringUtils = (function () {
    var innerIsBlank = function (string) {
        if (typeof string !== 'string') {
            return false;
        }

        for (var i = 0; i < string.length; i++) {
            switch (string[i]) {
                case ' ' :
                    break;
                case '\n' :
                    break;
                case '\r' :
                    break;
                default :
                    return false;
            }
        }
        // var result = string.replace(/ /gi, '').replace(/\n/gi, '').replace(/\r/gi, '');

        return true;
    };

    var innerIsNotBlank = function (string) {
        return innerIsBlank(string);
    };

    return {
        isBlank: innerIsBlank,
        isNotBlank: innerIsNotBlank
    }
})();