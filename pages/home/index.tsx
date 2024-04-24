import { Typography, Button, Table, Space } from "antd";
import { UploadOutlined, DownloadOutlined } from "@ant-design/icons";
import { saveAs } from "file-saver";
import * as ExcelJS from "exceljs";
import React, { useState, useRef } from "react";
import * as XLSX from "xlsx";

const { Title } = Typography;

const HomeList: React.FC = () => {
  const [excelData, setExcelData] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null); // Ref for file input element

  // Function to handle file upload
  const handleFileUpload = (file: File) => {
    const reader = new FileReader();

    reader.onload = (e: any) => {
      const workbook = XLSX.read(e.target.result, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      // Exclude the header row
      setExcelData(data);
    };

    reader.readAsBinaryString(file);
  };

  // Function to programmatically trigger file upload
  const triggerFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Function to download Excel template
  const downloadExcelTemplate = () => {
    // Create data for the template (just one record as an example)
    const templateData = [
      {
        Order: 1,
        "Type of Knowledge": "Pronounce",
        Topic: "Vowel pronunciation",
        "Number of Questions": 10,
        "Recognize (easy)": "XXXXX",
        "Understand (normal)": "XXXX",
        "Apply (hard)": "XX",
        "Highly Applied (very hard)": "X",
      },
    ];

    // Create a new workbook
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("English Test Template");

    // Define column headers
    sheet.columns = [
      { header: "Order", key: "Order" },
      { header: "Type of Knowledge", key: "Type of Knowledge" },
      { header: "Topic", key: "Topic" },
      { header: "Number of Questions", key: "Number of Questions" },
      { header: "Recognize (easy)", key: "Recognize (easy)" },
      { header: "Understand (normal)", key: "Understand (normal)" },
      { header: "Apply (hard)", key: "Apply (hard)" },
      {
        header: "Highly Applied (very hard)",
        key: "Highly Applied (very hard)",
      },
    ];

    // Add data to the sheet
    templateData.forEach((record) => {
      sheet.addRow(record);
    });

    // Generate Excel file
    workbook.xlsx.writeBuffer().then((buffer) => {
      // Convert buffer to Blob
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      // Save the Blob as a file
      saveAs(blob, "English_Test_Template.xlsx");
    });
  };

  const columns =
    excelData.length > 0
      ? excelData[0].map((col: string, index: number) => ({
          title: col,
          dataIndex: index.toString(),
          key: index.toString(),
        }))
      : [];
  return (
    <>
      <Title level={2}>Build your own English test!</Title>
      <Space direction="vertical">
        <div>
          <div>
            <input
              type="file"
              accept=".xlsx, .xls"
              ref={fileInputRef}
              onChange={(e) => handleFileUpload(e.target.files![0])}
              style={{ display: "none" }}
              id="excel-upload"
            />
            <Space>
              <Button icon={<UploadOutlined />} onClick={triggerFileUpload}>
                Upload Excel File
              </Button>
              <Button
                icon={<DownloadOutlined />}
                onClick={downloadExcelTemplate}
              >
                Download Excel Template
              </Button>
            </Space>
          </div>
        </div>
        <div>
          {excelData.length > 0 && (
            <>
              <Title level={3}>Structure uploaded</Title>
              <Table dataSource={excelData.slice(1)} columns={columns} />
            </>
          )}
        </div>
      </Space>
    </>
  );
};

export default HomeList;
