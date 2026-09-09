sap.ui.define([], function () {
    "use strict";

    return {
        getBusinessUnits: function (oController) {
            return new Promise(function (resolve, reject) {
                var oModel = oController.getOwnerComponent().getModel("compModel");
                oModel.read("/ZBusinessUnitVHSet", {
                    success: function (oData) {
                        console.log(oData);
                        resolve(oData.results);
                    },
                    error: function (oError) {
                        reject(oError);
                    }
                });
            });
        }
    };
});