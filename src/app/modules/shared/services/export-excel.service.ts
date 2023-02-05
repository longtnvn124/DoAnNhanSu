import { Injectable } from '@angular/core';
import * as fs from 'file-saver';
import { Workbook } from 'exceljs';


const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
  providedIn: 'root'
})

export class ExportExcelService {

  constructor() { }



  public exportAsExcelFile(
    reportHeading: string,
    reportSubHeading: string,
    headersArray: any[],
    json: any[],
    excelFileName: string,
    sheetName: string
  ) {
    const header = headersArray;
    const data = json;
    // Create workbook and worksheet
    const workbook = new Workbook();
    workbook.created = new Date();
    workbook.modified = new Date();
    const worksheet = workbook.addWorksheet(sheetName);

    //  Add header Row
    worksheet.addRow([]);
    worksheet.mergeCells('A1:' + this.numToAlpha(header.length - 1) + '1');
    worksheet.getCell('A1').value = reportHeading;
    worksheet.getCell('A1').alignment = { horizontal: 'center' };
    worksheet.getCell('A1').font = { size: 24, bold: true };

    if (reportSubHeading !== '') {
      worksheet.addRow([]);
      worksheet.mergeCells('A2:' + this.numToAlpha(header.length - 1) + '2');
      worksheet.getCell('A2').value = reportSubHeading;
      worksheet.getCell('A2').alignment = { horizontal: 'center' };
      worksheet.getCell('A2').font = { size: 13, bold: false };
    }

    worksheet.addRow([]);

    /* Add Header Row */
    const headerRow = worksheet.addRow(header);

    // Cell Style : Fill and Border
    headerRow.eachCell((cell, index) => {

      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'CCCCCC' },
        bgColor: { argb: '000000' },
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
      cell.font = { size: 13, bold: true };
      cell.alignment = {horizontal: 'center'};

      worksheet.getColumn(index).width = header[index - 1].length < 20 ? 20 : header[index - 1].length;
    });

    // Get all columns from JSON
    let columnsArray: any[];
    for (const key in json) {
      if (json.hasOwnProperty(key)) {
        columnsArray = Object.keys(json[key]);
      }
    }

    //Add Data and Conditinal Formatting

    data.forEach((element: any) => {
      const eachRow = [];
      columnsArray.forEach((column) => {
        eachRow.push(element[column]);

      })

      if (element.isDeleted === 'Y') {
        const deleteRow = worksheet.addRow(eachRow);
        deleteRow.eachCell((cell) => {
          cell.font = { name: 'Times New Roman', family: 4, size: 11, bold: false, strike: true };

        })
      } else {
        worksheet.addRow(eachRow);
      }
      //set with column to fit
      worksheet.columns.forEach(column => {
        const lengths = column.values.map(v => v.toString().length);
        const maxLength = Math.max(...lengths.filter(v => typeof v === 'number'));
        column.width = maxLength;
      });
    });

    // save Excel File
    workbook.xlsx.writeBuffer().then((data: ArrayBuffer) => {
      const blob = new Blob([data], { type: EXCEL_TYPE });
      fs.saveAs(blob, excelFileName + EXCEL_EXTENSION);
    })


  }

  private numToAlpha(num: number) {

    let alpha = '';

    for (; num >= 0; num = parseInt((num / 26).toString(), 10) - 1) {
      alpha = String.fromCharCode(num % 26 + 0x41) + alpha;
    }

    return alpha;
  }
}
