sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "employeedatamaster/util/xlsx.full.min",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "employeedatamaster/helper/dialogBox",
    "employeedatamaster/helper/codificationDownloadHelper",
    "employeedatamaster/helper/dialogBoxForCSFHelper",
    "employeedatamaster/helper/codificationErrorsDownloadHelper",
    "employeedatamaster/helper/dialogBoxCodificationErrorsHelper"
],
    function (Controller, JSONModel, xlsx, MessageBox, MessageToast, dialogBox, codificationDownloadHelper, dialogBoxForCSFHelper,
        codificationErrorsDownloadHelper, dialogBoxCodificationErrorsHelper) {
        "use strict";
        var processingFile;
        var username;
        var TO_ITEMS = [];
        var uploadedCount = 0;
        var employeeCount = 0;
        var isTemplateValid = true;
        return Controller.extend("employeedatamaster.controller.MainPage", {
            onInit: function () {
                isTemplateValid = true;
                console.log(this.getOwnerComponent().getModel());
                console.log(this.getOwnerComponent().getModel("csfModel"));
                console.log(this.getOwnerComponent().getModel("compModel"));

                //CSRF Token logic
                this._csrfToken = null;
                fetch("/sap/opu/odata/sap/ZR_VALIDATION_SF_SRV/", {
                    method: "GET",
                    headers: { "x-csrf-token": "fetch" },
                    credentials: "include"
                }).then(response => {
                    this._csrfToken = response.headers.get("x-csrf-token");
                    console.log("CSRF Token:", this._csrfToken);

                }).catch(err => console.error("CSRF fetch failed", err));
            },

            onTemplateSelection: function (oEvent) {
                var oGroup = oEvent.getSource();
                var iIndex = oEvent.getParameter("selectedIndex");
                if (iIndex === -1) {
                    this.resetFileSelection();
                    return;
                }
                var sSelectedId = oGroup.getButtons()[iIndex].getId().split("--")[2];
                processingFile = sSelectedId;
                this.selectedFileTemplate = sSelectedId;
                this.resetFileSelection();
                this.checkEnableValidateButton();
                this.byId("_IDGenButton3").setVisible(true);
                this.byId("_IDGenButton3").setEnabled(false);
            },

            onEmployeeCountChange: function (oEvent) {
                var oInput = oEvent.getSource();
                var sValue = oInput.getValue();
                if (!sValue) {
                    oInput.setValueState("Error");
                    oInput.setValueStateText("Employee count is required");
                    this.employeeCount = null;
                    this.checkEnableValidateButton();
                    return;
                }
                var iCount = parseInt(sValue, 10);
                if (isNaN(iCount) || iCount <= 0) {
                    oInput.setValueState("Error");
                    oInput.setValueStateText("Employee count must be greater than 0");
                    this.employeeCount = null;
                    this.checkEnableValidateButton();
                }
                else {
                    oInput.setValueState("None");
                    this.employeeCount = iCount;
                    this.checkEnableValidateButton();
                }
            },

            onDateSelection: function (oEvent) {
                var oDateValue = oEvent.getSource().getValue();
                this.selectedDate = oDateValue;
                this.checkEnableValidateButton();
            },

            //Not Triggering at any moment.!
            //We can remove if needed.
            onFileChange: function (oEvent) {
                var oFileUploader = this.byId("fileUploader");
                this._file = oEvent.getParameter("files")[0];
                if (this._file) {
                    oFileUploader.setValue(this._file.name);
                    //this.checkEnableValidateButton();
                }
            },

            //--------------------------ACTUAL VALIDATION lOGIC----------------------------------
            getODataModelForTemplate: function ()
            {
                switch (this.selectedFileTemplate)
                {
                    case "EmployeeData":
                        console.log("Using MAIN service");
                        return this.getOwnerComponent().getModel();
                    case "CsfData":
                        console.log("Using CSF service");
                        return this.getOwnerComponent().getModel("csfModel");
                    case "CompData":
                        console.log("Using COMP service");
                        return this.getOwnerComponent().getModel("compModel");
                    default:
                        MessageToast.show("Invalid template selection");
                        return null;
                }
            },

            getEntitySetForTemplate: function ()
            {
                return "/zemp_headerSet";
            },

            isRowEmpty: function (row)
            {
                return row.every(function (cell) 
                {
                    return cell === null || cell === undefined || String(cell).trim() === "";
                });
            },

            buildItemPayloadByTemplate: function (row)
            {
                if (!row || this.isRowEmpty(row))
                {
                    return null;
                }
                switch (this.selectedFileTemplate) {
                    /* ================= EMPLOYEE DATA MASTER ================= */
                    case "EmployeeData":
                        if (this._employeeMasterColumnCount === 109)
                        {
                            return {
                                RuleFieldID: row[0]?.toString() || "",
                                Ha001: row[1]?.toString() || "",
                                Bu003: row[2]?.toString() || "",
                                Bi002: row[3]?.toString() || "",
                                Bi003: row[4]?.toString() || "",
                                Bi004: row[5]?.toString() || "",
                                Ei001: row[6]?.toString() || "",
                                Ei002: row[7]?.toString() || "",
                                Ei007: row[8]?.toString() || "",
                                Ei004: row[9]?.toString() || "",
                                Ei003: row[10]?.toString() || "",
                                Jh001: row[11]?.toString() || "",
                                Jm001: row[12]?.toString() || "",
                                Pi017: row[13]?.toString() || "",
                                Pi001: row[14]?.toString() || "",
                                Pi003: row[15]?.toString() || "",
                                Pi014: row[16]?.toString() || "",
                                Pi007: row[17]?.toString() || "",
                                Pi006: row[18]?.toString() || "",
                                Pi009: row[19]?.toString() || "",
                                Pi010: row[20]?.toString() || "",
                                Pi011: row[21]?.toString() || "",
                                Pi002: row[22]?.toString() || "",
                                Pi004: row[23]?.toString() || "",
                                Pi013: row[24]?.toString() || "",
                                Pi005: row[25]?.toString() || "",
                                Pi019: row[26]?.toString() || "",
                                Pi015: row[27]?.toString() || "",
                                Pi008: row[28]?.toString() || "",
                                Bm001: row[29]?.toString() || "",
                                Bm004: row[30]?.toString() || "",
                                Bm002: row[31]?.toString() || "",
                                Bm005: row[32]?.toString() || "",
                                Bm003: row[33]?.toString() || "",
                                Pm001: row[34]?.toString() || "",
                                Pm004: row[35]?.toString() || "",
                                Pm002: row[36]?.toString() || "",
                                Pm005: row[37]?.toString() || "",
                                Pm003: row[38]?.toString() || "",
                                Eb001: row[39]?.toString() || "",
                                Eb002: row[40]?.toString() || "",
                                Ep001: row[41]?.toString() || "",
                                Ep002: row[42]?.toString() || "",
                                Na001: row[43]?.toString() || "",
                                Na002: row[44]?.toString() || "",
                                Na003: row[45]?.toString() || "",
                                Na004: row[46]?.toString() || "",
                                Nb001: row[47]?.toString() || "",
                                Nb002: row[48]?.toString() || "",
                                Nb003: row[49]?.toString() || "",
                                Nb004: row[50]?.toString() || "",
                                Nc001: row[51]?.toString() || "",
                                Nc002: row[52]?.toString() || "",
                                Nc003: row[53]?.toString() || "",
                                Nc004: row[54]?.toString() || "",
                                Ec001: row[55]?.toString() || "",
                                Ec002: row[56]?.toString() || "",
                                Ec003: row[57]?.toString() || "",
                                Ec004: row[58]?.toString() || "",
                                Ec006: row[59]?.toString() || "",
                                Ec008: row[60]?.toString() || "",
                                Ec007: row[61]?.toString() || "",
                                Da012: row[62]?.toString() || "",
                                Da001: row[63]?.toString() || "",
                                Da006: row[64]?.toString() || "",
                                Da002: row[65]?.toString() || "",
                                Da003: row[66]?.toString() || "",
                                Da008: row[67]?.toString() || "",
                                Da009: row[68]?.toString() || "",
                                Da007: row[69]?.toString() || "",
                                Da011: row[70]?.toString() || "",
                                Db012: row[71]?.toString() || "",
                                Db001: row[72]?.toString() || "",
                                Db006: row[73]?.toString() || "",
                                Db002: row[74]?.toString() || "",
                                Db003: row[75]?.toString() || "",
                                Db008: row[76]?.toString() || "",
                                Db009: row[77]?.toString() || "",
                                Db007: row[78]?.toString() || "",
                                Db011: row[79]?.toString() || "",
                                Jc032: row[80]?.toString() || "",
                                Jc031: row[81]?.toString() || "",
                                Jc005: row[82]?.toString() || "",
                                Jc015: row[83]?.toString() || "",
                                Jc025: row[84]?.toString() || "",
                                Jc043: row[85]?.toString() || "",
                                Jc021: row[86]?.toString() || "",
                                Jc011: row[87]?.toString() || "",
                                Jc035: row[88]?.toString() || "",
                                Jc054: row[89]?.toString() || "",
                                Jc061: row[90]?.toString() || "",
                                Jc006: row[91]?.toString() || "",
                                Jc012: row[92]?.toString() || "",
                                Jc036: row[93]?.toString() || "",
                                Jc045: row[94]?.toString() || "",
                                Jc003: row[95]?.toString() || "",
                                Jc008: row[96]?.toString() || "",
                                Jc004: row[97]?.toString() || "",
                                Jc030: row[98]?.toString() || "",
                                Jc013: row[99]?.toString() || "",
                                Jc029: row[100]?.toString() || "",
                                Jc007: row[101]?.toString() || "",
                                Jc047: row[102]?.toString() || "",
                                Jc027: row[103]?.toString() || "",
                                Jc019: row[104]?.toString() || "",
                                Jc049: row[105]?.toString() || "",
                                Jc051: row[106]?.toString() || "",
                                Jc056: row[107]?.toString() || "",
                                Jc044: row[108]?.toString() || ""
                            };
                        }

                        if (this._employeeMasterColumnCount === 106)
                        {
                            return {
                                RuleFieldID: row[0]?.toString() || "",
                                Ha001: row[1]?.toString() || "",
                                Bu003: row[2]?.toString() || "",
                                Bi002: row[3]?.toString() || "",
                                Bi003: row[4]?.toString() || "",
                                Bi004: row[5]?.toString() || "",
                                Ei001: row[6]?.toString() || "",
                                Ei002: row[7]?.toString() || "",
                                Ei007: row[8]?.toString() || "",
                                Ei004: row[9]?.toString() || "",
                                Ei003: row[10]?.toString() || "",
                                Jh001: row[11]?.toString() || "",
                                Jm001: row[12]?.toString() || "",
                                Pi017: row[13]?.toString() || "",
                                Pi001: row[14]?.toString() || "",
                                Pi003: row[15]?.toString() || "",
                                Pi014: row[16]?.toString() || "",
                                Pi007: row[17]?.toString() || "",
                                Pi006: row[18]?.toString() || "",
                                Pi002: row[19]?.toString() || "",
                                Pi004: row[20]?.toString() || "",
                                Pi013: row[21]?.toString() || "",
                                Pi005: row[22]?.toString() || "",
                                Pi019: row[23]?.toString() || "",
                                Pi015: row[24]?.toString() || "",
                                Pi008: row[25]?.toString() || "",
                                Bm001: row[26]?.toString() || "",
                                Bm004: row[27]?.toString() || "",
                                Bm002: row[28]?.toString() || "",
                                Bm005: row[29]?.toString() || "",
                                Bm003: row[30]?.toString() || "",
                                Pm001: row[31]?.toString() || "",
                                Pm004: row[32]?.toString() || "",
                                Pm002: row[33]?.toString() || "",
                                Pm005: row[34]?.toString() || "",
                                Pm003: row[35]?.toString() || "",
                                Eb001: row[36]?.toString() || "",
                                Eb002: row[37]?.toString() || "",
                                Ep001: row[38]?.toString() || "",
                                Ep002: row[39]?.toString() || "",
                                Na001: row[40]?.toString() || "",
                                Na002: row[41]?.toString() || "",
                                Na003: row[42]?.toString() || "",
                                Na004: row[43]?.toString() || "",
                                Nb001: row[44]?.toString() || "",
                                Nb002: row[45]?.toString() || "",
                                Nb003: row[46]?.toString() || "",
                                Nb004: row[47]?.toString() || "",
                                Nc001: row[48]?.toString() || "",
                                Nc002: row[49]?.toString() || "",
                                Nc003: row[50]?.toString() || "",
                                Nc004: row[51]?.toString() || "",
                                Ec001: row[52]?.toString() || "",
                                Ec002: row[53]?.toString() || "",
                                Ec003: row[54]?.toString() || "",
                                Ec004: row[55]?.toString() || "",
                                Ec006: row[56]?.toString() || "",
                                Ec008: row[57]?.toString() || "",
                                Ec007: row[58]?.toString() || "",
                                Da012: row[59]?.toString() || "",
                                Da001: row[60]?.toString() || "",
                                Da006: row[61]?.toString() || "",
                                Da002: row[62]?.toString() || "",
                                Da003: row[63]?.toString() || "",
                                Da008: row[64]?.toString() || "",
                                Da009: row[65]?.toString() || "",
                                Da007: row[66]?.toString() || "",
                                Da011: row[67]?.toString() || "",
                                Db012: row[68]?.toString() || "",
                                Db001: row[69]?.toString() || "",
                                Db006: row[70]?.toString() || "",
                                Db002: row[71]?.toString() || "",
                                Db003: row[72]?.toString() || "",
                                Db008: row[73]?.toString() || "",
                                Db009: row[74]?.toString() || "",
                                Db007: row[75]?.toString() || "",
                                Db011: row[76]?.toString() || "",
                                Jc032: row[77]?.toString() || "",
                                Jc031: row[78]?.toString() || "",
                                Jc005: row[79]?.toString() || "",
                                Jc015: row[80]?.toString() || "",
                                Jc025: row[81]?.toString() || "",
                                Jc043: row[82]?.toString() || "",
                                Jc021: row[83]?.toString() || "",
                                Jc011: row[84]?.toString() || "",
                                Jc035: row[85]?.toString() || "",
                                Jc054: row[86]?.toString() || "",
                                Jc061: row[87]?.toString() || "",
                                Jc006: row[88]?.toString() || "",
                                Jc012: row[89]?.toString() || "",
                                Jc036: row[90]?.toString() || "",
                                Jc045: row[91]?.toString() || "",
                                Jc003: row[92]?.toString() || "",
                                Jc008: row[93]?.toString() || "",
                                Jc004: row[94]?.toString() || "",
                                Jc030: row[95]?.toString() || "",
                                Jc013: row[96]?.toString() || "",
                                Jc029: row[97]?.toString() || "",
                                Jc007: row[98]?.toString() || "",
                                Jc047: row[99]?.toString() || "",
                                Jc027: row[100]?.toString() || "",
                                Jc019: row[101]?.toString() || "",
                                Jc049: row[102]?.toString() || "",
                                Jc051: row[103]?.toString() || "",
                                Jc056: row[104]?.toString() || "",
                                Jc044: row[105]?.toString() || ""

                            };
                        }
                    /* ================= CSF ================= */
                    case "CsfData":
                        return {
                            RuleFieldID: row[0]?.toString() || "",
                            Ha001: row[1]?.toString() || "",
                            Pi001: row[2]?.toString() || "",
                            Pi002: row[3]?.toString() || "",
                            Pi003: row[4]?.toString() || "",
                            Pi004: row[5]?.toString() || "",
                            Pi005: row[6]?.toString() || "",
                            Pi006: row[7]?.toString() || "",
                            Pi007: row[8]?.toString() || "",
                            Pi008: row[9]?.toString() || "",
                            Pi009: row[10]?.toString() || "",
                            Pi010: row[11]?.toString() || "",
                            Pi011: row[12]?.toString() || "",
                            Pi012: row[13]?.toString() || "",
                            Ad001: row[14]?.toString() || "",
                            Ad003: row[15]?.toString() || "",
                            Ad004: row[16]?.toString() || "",
                            Ad005: row[17]?.toString() || "",
                            Ad006: row[18]?.toString() || "",
                            Ad007: row[19]?.toString() || "",
                            Ad008: row[20]?.toString() || "",
                            Ad009: row[21]?.toString() || "",
                            Ad002: row[22]?.toString() || "",
                            Ad010: row[23]?.toString() || "",
                            Ad011: row[24]?.toString() || "",
                            Ad012: row[25]?.toString() || "",
                            Ad013: row[26]?.toString() || "",
                            Ad014: row[27]?.toString() || "",
                            Ad015: row[28]?.toString() || "",
                            Ad016: row[29]?.toString() || "",
                            Ji023: row[30]?.toString() || "",
                            Ji024: row[31]?.toString() || "",
                            Ji025: row[32]?.toString() || "",
                            Ji026: row[33]?.toString() || "",
                            Ji001: row[34]?.toString() || "",
                            Ji002: row[35]?.toString() || "",
                            Ji022: row[36]?.toString() || "",
                            Ji003: row[37]?.toString() || "",
                            Ji004: row[38]?.toString() || "",
                            Ji005: row[39]?.toString() || "",
                            Ji006: row[40]?.toString() || "",
                            Ji007: row[41]?.toString() || "",
                            Ji008: row[42]?.toString() || "",
                            Ji009: row[43]?.toString() || "",
                            Ji010: row[44]?.toString() || "",
                            Ji011: row[45]?.toString() || "",
                            Ji012: row[46]?.toString() || "",
                            Ji013: row[47]?.toString() || "",
                            Ji014: row[48]?.toString() || "",
                            Ji015: row[49]?.toString() || "",
                            Ji016: row[50]?.toString() || "",
                            Ji017: row[51]?.toString() || "",
                            Ji018: row[52]?.toString() || "",
                            Ji019: row[53]?.toString() || "",
                            Ji020: row[54]?.toString() || "",
                            Ji021: row[55]?.toString() || "",
                            Py001: row[56]?.toString() || "",
                            Py002: row[57]?.toString() || "",
                            Py003: row[58]?.toString() || "",
                            Py004: row[59]?.toString() || "",
                            Py005: row[60]?.toString() || "",
                            Py006: row[61]?.toString() || "",
                            Py007: row[62]?.toString() || "",
                            Py009: row[63]?.toString() || "",
                            Py010: row[64]?.toString() || "",
                            Py011: row[65]?.toString() || ""

                        };

                    /* ================= COMPENSATION ================= */
                    case "CompData":
                        return {
                            RuleFieldID: row[0]?.toString() || "",
                            Ha002: row[1]?.toString() || "",
                            Ci001: row[2]?.toString() || "",
                            Ci002: row[3]?.toString() || "",
                            Ci003: row[4]?.toString() || "",
                            Pc001: row[5]?.toString() || "",
                            Pc002: row[6]?.toString() || "",
                            Pc003: row[7]?.toString() || "",
                            Pc004: row[8]?.toString() || ""
                        };
                    default:
                        return null;
                }
            },

            getExpectedColumnCountByTemplate: function ()
            {
                switch (this.selectedFileTemplate)
                {
                    case "EmployeeData":
                        return [109, 106];
                    case "CsfData":
                        return [66, 44];
                    case "CompData":
                        return [9];
                    default:
                        return null;
                }
            },

            getSheetRangeByTemplate: function ()
            {
                switch (this.selectedFileTemplate)
                {
                    case "EmployeeData":
                        return {
                            startRow: 5,
                            startCol: 0
                        };
                    case "CsfData":
                        return {
                            startRow: 6,
                            startCol: 0
                        };
                    case "CompData":
                        return {
                            startRow: 6,
                            startCol: 0
                        };
                    default:
                        return {
                            startRow: 0,
                            startCol: 0
                        };
                }
            },

            getHeaderRowIndexByTemplate: function ()
            {
                switch (this.selectedFileTemplate)
                {
                    case "EmployeeData":
                        return 9;
                    case "CsfData":
                        return 8;
                    case "CompData":
                        return 8;
                    default:
                        return 0;
                }
            },

            getDataStartOffsetByTemplate: function ()
            {
                switch (this.selectedFileTemplate)
                {
                    case "EmployeeData":
                        return 9;
                    case "CsfData":
                        return 9;
                    case "CompData":
                        return 9;
                    default:
                        return 0;
                }
            },

            onFileUpload: function ()
            {
                var oFileUploader = this.byId("fileUploader");
                // var file = oFileUploader.getFocusDomRef().files[0];
                const file = oFileUploader.getDomRef("fu")?.files?.[0];
                if (!file)
                {
                    return;
                }
                sap.ui.core.BusyIndicator.show(0);
                this.TO_ITEMS = [];
                this.uploadedCount = 0;
                var reader = new FileReader();
                reader.onload = function (e) {
                    var arrayBuffer = e.target.result;
                    // var data = new Uint8Array(e.target.result);
                    var worker = new Worker(sap.ui.require.toUrl("employeedatamaster/worker/worker.js"));
                    console.log(worker);
                    worker.postMessage(arrayBuffer);
                    worker.onmessage = function (event) {
                        if (event.data.success)
                        {
                            this._worksheets = event.data.worksheets;
                            var aSheets = event.data.sheets;
                            var oSheetModel = new sap.ui.model.json.JSONModel({
                                sheets: aSheets,
                                selectedSheet: ""
                            });
                            this.getView().setModel(oSheetModel, "sheetModel");
                            if (aSheets.length === 1)
                            {
                                this.processSelectedSheet(aSheets[0].sheetName);
                            }
                            else
                            {
                                this.openSheetDialog();
                            }
                        }
                        else
                        {
                            sap.m.MessageToast.show("Error: " + event.data.error);
                        }
                        sap.ui.core.BusyIndicator.hide();
                        worker.terminate();
                    }.bind(this);
                }.bind(this);
                reader.readAsArrayBuffer(file);
            },
            openSheetDialog: function ()
            {
                if (!this.oSheetDialog)
                {
                    this.oSheetDialog = sap.ui.xmlfragment(
                        "employeedatamaster.fragments.helper",
                        this
                    );
                    this.getView().addDependent(this.oSheetDialog);
                }
                this.oSheetDialog.open();
            },
            onSheetCancel: function ()
            {
                this.oSheetDialog.close();
                this.resetFileSelection();
            },

            onSheetConfirm: function ()
            {
                var oModel = this.getView().getModel("sheetModel");
                var selectedSheet = oModel.getProperty("/selectedSheet");
                if (!selectedSheet)
                {
                    sap.m.MessageToast.show("Please select a sheet!");
                    return;
                }
                this.oSheetDialog.close();
                this.processSelectedSheet(selectedSheet);
            },
            processSelectedSheet: function (selectedSheet)
            {
                var that = this;
                var workbook = this._worksheets;
                var worksheet = workbook[selectedSheet];
                if (!worksheet) {
                    sap.m.MessageBox.error("Selected sheet not found");
                    return;
                }
                var range = XLSX.utils.decode_range(worksheet["!ref"]);
                var oRangeConfig = that.getSheetRangeByTemplate();
                range.s.r = oRangeConfig.startRow;
                range.s.c = oRangeConfig.startCol;
                const rowsAsArrays = XLSX.utils.sheet_to_json(worksheet, {
                    header: 1,
                    defval: "",
                    range: range,
                    blankrows: true
                });
                var iHeaderRowIndex = that.getHeaderRowIndexByTemplate();
                const headerRow = rowsAsArrays[iHeaderRowIndex] || [];
                const columnCount = headerRow.filter(cell => cell !== "").length;
                this._employeeMasterColumnCount = columnCount;
                var iExpectedColumns = that.getExpectedColumnCountByTemplate();
                if (iExpectedColumns && !iExpectedColumns.includes(columnCount)) {
                    sap.m.MessageToast.show("Incorrect File Template! Please upload correct template.");
                    isTemplateValid = false;
                    that.resetFileSelection();
                    return;
                }
                isTemplateValid = true;
                that.checkEnableValidateButton();
                var iDataOffset = that.getDataStartOffsetByTemplate();
                var count = 0
                for (var R = range.s.r; R <= range.e.r; R++) {
                    var sCellAddress = XLSX.utils.encode_cell({ r: R, c: 0 });
                    var oCell = worksheet[sCellAddress];
                    if (oCell && oCell.v !== undefined && oCell.v !== "") {
                        count++;
                    }
                }
                //var uploadedCount1=0;
                uploadedCount = count - iDataOffset;
                //uploadedCount1=rowsAsArrays.length - iDataOffset;
                rowsAsArrays.forEach(function (row) {
                    var itemPayload = that.buildItemPayloadByTemplate(row);
                    if (itemPayload) {
                        TO_ITEMS.push(itemPayload);
                    }
                });
                MessageToast.show("File Uploaded Successfully!");
                this.byId("_IDGenButton3").setEnabled(false);
            },

            onValidate: function () {
                var oModel = this.getODataModelForTemplate();
                if (!oModel) {
                    return;
                }
                var oFileUploader = this.byId("fileUploader");
                var file = oFileUploader.getFocusDomRef().files[0];
                if (!this.selectedFileTemplate) {
                    MessageToast.show("Please select a template first!");
                    return;
                }
                if (!file) {
                    MessageToast.show("Please select a file first!");
                    return;
                }
                var file1 = file;
                var excelData =
                {
                    "RuleFieldID": "",
                    "TemplateId": this.selectedFileTemplate,
                    "FileName": file1.name?.toString() || "",
                    "NoOfEmps": this.employeeCount?.toString() || "",
                    "CutoffDate": this.selectedDate?.toString() || "",
                    "Flag": "A",
                    "Status": "",
                    "TO_ITEMS": TO_ITEMS
                }
                //console.log(excelData);
                oFileUploader.addHeaderParameter(new sap.ui.unified.FileUploaderParameter({
                    name: "slug",
                    value: file.name
                }));
                oFileUploader.addHeaderParameter(new sap.ui.unified.FileUploaderParameter({
                    name: "x-csrf-token",
                    value: this._csrfToken
                }));
                if (!this.employeeCount) {
                    MessageToast.show("Please enter employee count!");
                    return;
                }
                if (uploadedCount === 0) {
                    MessageToast.show("There is no data in the file!");
                    return;
                }
                if (uploadedCount !== this.employeeCount) {
                    MessageBox.warning(
                        "Data Mismatch!\n\nEntered Count: " +
                        this.employeeCount +
                        "\nUploaded Records: " +
                        uploadedCount
                    );
                    return;
                }
                oFileUploader.upload();
                sap.ui.core.BusyIndicator.show(0);
                var that = this;
                var sEntitySet = this.getEntitySetForTemplate();
                if (!sEntitySet) {
                    return;
                }
                this.byId("_IDGenButton3").setEnabled(true);
                oModel.create("/zemp_headerSet", excelData, {
                    success: function (oResponse) {
                        sap.ui.core.BusyIndicator.hide();
                        var dataItems = oResponse.TO_ITEMS.results;
                        if (that.selectedFileTemplate === "EmployeeData" || that.selectedFileTemplate === "CsfData" || that.selectedFileTemplate === "CompData") {
                            if (oResponse.Status === "A job is already in progress Please wait") {
                                MessageBox.error("A job is already in progress!.Please wait");
                                that.byId("_IDGenButton3").setEnabled(false);
                            }
                            else
                            {
                                MessageBox.success(oResponse.Status, {
                                    title: "Status",
                                    actions: [MessageBox.Action.OK, MessageBox.Action.CLOSE],
                                    onClose: function (sAction) {
                                        if (sAction === MessageBox.Action.OK) {
                                            that.byId("_IDGenButton3").setVisible(true);
                                        }
                                    }
                                });
                            }
                        }
                        var oFU = that.byId("fileUploader");
                        oFU.clear();
                        if (oFU._oFileUpload) {
                            oFU._oFileUpload.value = "";
                        }
                        isTemplateValid = false;
                        that.checkEnableValidateButton();
                    },
                    error: function (oError)
                    {
                        sap.ui.core.BusyIndicator.hide();
                        MessageBox.error("Upload failed: " + oError.message);
                        var oFU = that.byId("fileUploader");
                        oFU.clear();
                        if (oFU._oFileUpload) {
                            oFU._oFileUpload.value = "";
                        }
                        isTemplateValid = false;
                        that.checkEnableValidateButton();
                    }
                });
            },

            onPressOfErrorSet: function ()
            {
                var oModel = this.getODataModelForTemplate();
                if (!oModel)
                {
                    return;
                }
                var that = this;
                const now = Date.now();
                if (this._lastStatus === "RUNNING" && (now - this._lastCheckTime < 10000)) {
                    sap.m.MessageToast.show("Please wait before checking again.");
                    return;
                }
                if (this._lastCheckTime && (now - this._lastCheckTime < 30000)) {
                    sap.m.MessageToast.show("Please wait before checking again.");
                    return;
                }
                this._lastCheckTime = now;
                var oView = this.getView();
                oView.setBusyIndicatorDelay(0);
                oView.setBusy(true);
                oModel.read("/zexcel_errorSet", {
                    success: function (oErrorResponse) {
                        oView.setBusy(false);
                        var jobStatus = oErrorResponse.results[0].job_status;
                        //if (jobStatus === "Job is still in progress. Please check later.")
                        if (jobStatus === "Job is still in progress. Please check in a moment." || jobStatus === "Job is still in progress. Please check later.") 
                        {
                            MessageBox.warning("Validation is still in progress.", {
                                title: "Job status",
                                details: "The file is large and validation is currently running in the background. Please wait a moment and try again.",
                                contentWidth: "500px"
                            });
                            that._lastStatus = "RUNNING";
                        }
                        else if(jobStatus === 'Job was cancelled.')
                        {
                            MessageBox.error("Job has been cancelled.Please try again!", {
                                title: "Job status",
                                details: "The background job was cancelled due to issues in the file data. Please verify the file and try again.",
                                contentWidth: "500px"
                            });
                            return;
                        }
                        else
                        {
                            var errorLog = oErrorResponse.results || [];
                            oView.setBusy(false);
                            if (errorLog[0].ErrorLog === "No errors found in the uploaded file") {
                                if (that.selectedFileTemplate === "EmployeeData" || that.selectedFileTemplate === "CompData")
                                {
                                    dialogBox.showProcessDialog(that);
                                }
                                else if (that.selectedFileTemplate === "CsfData")
                                {
                                    dialogBoxForCSFHelper.showProcessDialogForCSF(that);
                                }
                                else
                                {
                                    spa.m.MessageToast.show("Aborted");
                                }
                            }
                            else
                            {
                                that.onDownloadValidatedExcelOfERRORSET(errorLog);
                                that.byId("_IDGenButton3").setVisible(true);
                            }
                        }
                    },
                    error: function (oError)
                    {
                        MessageBox.error("Failed to fetch Error Log");
                        //  that.onDownloadValidatedExcel(dataItems, []);
                    }
                });
            },
            onDownloadValidatedExcelOfERRORSET: function (oResponseErrors)
            {
                var errorData = [];
                if (oResponseErrors && oResponseErrors.length) {
                    errorData = oResponseErrors.map(function (item) {
                        var copy = Object.assign({}, item);
                        delete copy.__metadata;
                        delete copy.RuleFieldID;
                        delete copy.Row;
                        delete copy.job_status;
                        return copy;
                    });
                }
                if (!errorData || errorData.length === 0) {
                    errorData.push({ Message: "No Errors Found!" });
                }
                var worksheet2 = XLSX.utils.json_to_sheet(errorData);
                var headers = Object.keys(errorData[0] || {});
                headers.forEach(function (header, index) {
                    var cellAddress = XLSX.utils.encode_cell({ r: 0, c: index });
                    if (worksheet2[cellAddress]) {
                        worksheet2[cellAddress].s = {
                            font: { bold: true }
                        };
                    }
                });
                var workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet2, "Error Log");
                var excelBinary = XLSX.write(workbook, {
                    bookType: "xlsx",
                    type: "array"
                });
                var blob = new Blob([excelBinary], {
                    type: "application/octet-stream"
                });
                var url = URL.createObjectURL(blob);
                var a = document.createElement("a");
                a.href = url;
                a.download = processingFile + "Validated_ErrorLog.xlsx";
                a.click();
                URL.revokeObjectURL(url);
                MessageToast.show("Excel downloaded successfully!");
            },

            resetFileSelection: function () {
                var oFU = this.byId("fileUploader");
                oFU.clear();
                if (oFU._oFileUpload) {
                    oFU._oFileUpload.value = "";
                }
                this.byId("_IDGenButton3").setEnabled(false);
                this._file = null;
                TO_ITEMS = [];
                uploadedCount = 0;
                isTemplateValid = false;
                this.checkEnableValidateButton();
            },

            checkEnableValidateButton: function () {
                var oFileUploader = this.byId("fileUploader");
                var file = oFileUploader.getFocusDomRef().files[0];
                var validateEnable = !!this.selectedFileTemplate &&
                    !!this.selectedDate &&
                    !!file &&
                    !!this.employeeCount &&
                    isTemplateValid === true;
                this.byId("_IDGenButton1").setEnabled(validateEnable);

            },

            onClearPress: function () {
                var oFU = this.byId("fileUploader");
                var file = oFU.getFocusDomRef().files[0];
                if (file === undefined) {
                    MessageToast.show("No file selected!");
                    this.byId("_IDGenButton3").setEnabled(false);
                    return;
                }
                oFU.clear();
                if (oFU._oFileUpload) {
                    oFU._oFileUpload.value = "";
                }
                MessageToast.show("File selection cleared successfully!");
                this.isTemplateValid = false;
                this.byId("_IDGenButton3").setEnabled(false);
                this.checkEnableValidateButton();
            },
            startCodification: function () {
                var that = this;
                this.byId("_IDGenButton8").setVisible(false);
                const oModel = this.getODataModelForTemplate();
                console.log(oModel);
                if (!this.busyDialog) {
                    this.busyDialog = new sap.m.BusyDialog({
                        text: "Codification in progress...\nPlease wait"
                    });
                }
                this.busyDialog.open();
                oModel.read("/ZExcelErrorLogSet", {
                    success: function (codifiedErr) {
                        var that1 = that;
                        var CodifiedErrors = codifiedErr.results;
                        that.CodifiedErrors = CodifiedErrors;
                        if (CodifiedErrors[0].ErrorLog === "No errors found in the uploaded file")
                            {
                                that.byId("_IDGenButton8").setVisible(true);
                                oModel.read("/zemp_codfSet", {
                                success: function (oCodifiedData)
                                {
                                    console.log("inside the success");
                                    that1.busyDialog.close();
                                    MessageToast.show("Codification is done.You can download the results!");
                                    var res = oCodifiedData.results;
                                    that1.output = res;

                                },
                                error: function (oError)
                                {
                                    that1.busyDialog.close();
                                    MessageBox.error("Failed Codification");
                                }
                            });
                        }
                        else
                        {
                            that.busyDialog.close();
                            console.log("Inside ELSE block");
                            console.log(that);
                            dialogBoxCodificationErrorsHelper.showCodificationResults(that);
                            that.byId("_IDGenButton8").setVisible(false);
                        }
                    },
                    error: function (oError)
                    {
                        that.busyDialog.close();
                        sap.m.MessageToast.show("Failed to Fetch the log!")
                    }
                });
            },
            onDownloadCodifiedData: function ()
            {
                codificationDownloadHelper.downloadExcelData(this.output, this, this.selectedFileTemplate);
            },
            downloadCodificationErrors: function ()
            {
                codificationErrorsDownloadHelper.downloadExcelErrors(this.CodifiedErrors, this);
            }
        });
    });