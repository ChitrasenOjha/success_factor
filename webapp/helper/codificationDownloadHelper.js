sap.ui.define([], function () {
    "use strict";
    return {
        downloadExcelData: async function (aData,that,selectedTempalteValue)
        {
            try
            {
                sap.ui.core.BusyIndicator.show(0);
                if (!aData || !aData.length)
                {
                    sap.m.MessageToast.show("Errors found. Please resolve them first.");
                    sap.ui.core.BusyIndicator.hide();
                    return;
                }
                var sUrl="";
                if(selectedTempalteValue === "EmployeeData")
                {
                    sUrl = sap.ui.require.toUrl("employeedatamaster/assets/Employee_Data_Master.xlsx");
                }
                else
                {
                    sUrl = sap.ui.require.toUrl("employeedatamaster/assets/Employee_Data_Compensation_Template.xlsx");
                }
                const response = await fetch(sUrl);
                const arrayBuffer = await response.arrayBuffer();
                const workbook = XLSX.read(arrayBuffer, { type: "array" , cellStyles: true });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const reorderedList = aData.map(function (item)
                {
                    var copy = Object.assign({}, item);
                    delete copy.__metadata;
                    return copy
                });
                XLSX.utils.sheet_add_json(worksheet, reorderedList, {
                    origin:"A16",
                    skipHeader: true
                });
                const excelBinary = XLSX.write(workbook, {
                    bookType: "xlsx",
                    type: "array",
                    cellStyles: true 
                });
                const blob = new Blob([excelBinary], {
                    type: "application/octet-stream"
                });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "Codification.xlsx";
                a.click();
                URL.revokeObjectURL(url);
                sap.ui.core.BusyIndicator.hide();
                sap.m.MessageToast.show("Excel downloaded successfully!");
                that.byId("_IDGenButton8").setVisible(false);  
            }
            catch (error)
            {
                console.error(error);
                sap.ui.core.BusyIndicator.hide();
                sap.m.MessageBox.error("Error generating Excel file");
            }
        }
    };
});