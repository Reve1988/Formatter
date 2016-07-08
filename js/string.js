/**
 * Created by giwoong.Kim on 2016. 6. 25..
 */
var stringUtils = (function () {
    var isBlank = function (string) {
        if (typeof string !== 'string') {
            return false;
        }

        for (var i = 0; i < string.length; i++) {
            switch (string[i]) {
                case ' ' :
                    break;
                case '\n' :
                    break;
                case '\t' :
                    break;
                default :
                    return false;
            }
        }
        // var result = string.replace(/ /gi, '').replace(/\n/gi, '').replace(/\r/gi, '');

        return true;
    };

    var isNotBlank = function (string) {
        return isBlank(string);
    };

    return {
        isBlank: isBlank,
        isNotBlank: isNotBlank
    }
})();