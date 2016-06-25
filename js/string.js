/**
 * Created by giwoong.Kim on 2016. 6. 25..
 */
var stringUtils = (function () {
    var innerIsBlank = function (string) {
        if (typeof string !== 'string') {
            return false;
        }

        var result = string.replace(/ /gi, '').replace(/\n/gi, '').replace(/\r/gi, '');

        return result == '';
    };

    return {
        isBlank : innerIsBlank
    }
})();