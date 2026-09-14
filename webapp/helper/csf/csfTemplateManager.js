sap.ui.define([
    "employeedatamaster/helper/csf/Argentina",
    "employeedatamaster/helper/csf/India"
], function (Argentina, India) {
    "use strict";

    var mTemplates = {
        Argentina: Argentina,
        India: India
    };

    return {
        getTemplate: function (sCountry) {
            return mTemplates[sCountry] || null;
        }
    };
});
