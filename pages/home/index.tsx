import { Typography, Button, Table, Space, Card, Modal } from "antd";
import {
  UploadOutlined,
  DownloadOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { saveAs } from "file-saver";
import * as ExcelJS from "exceljs";
import React, { useState, useRef } from "react";
import * as XLSX from "xlsx";

const { Title } = Typography;

const HomeList: React.FC = () => {
  const [excelData, setExcelData] = useState<any[]>([]);
  const [fileUploaded, setFileUploaded] = useState<boolean>(false); // State to track file upload
  const fileInputRef = useRef<HTMLInputElement>(null); // Ref for file input element

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();

    reader.onload = (e: ProgressEvent<FileReader>) => {
      if (e.target && e.target.result) {
        const result = e.target.result;
        const workbook = XLSX.read(result as string, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // Process merged cells to ensure they have the same value
        const mergedCells = worksheet["!merges"] || [];
        mergedCells.forEach((merge: XLSX.Range) => {
          const { s, e } = merge;
          const startRowIndex = s.r;
          const endRowIndex = e.r;
          const startColIndex = s.c;
          const endColIndex = e.c;
          const mergedValue = (data as any[][])[startRowIndex][
            startColIndex
          ] as string; // Explicitly type mergedValue as string
          for (let i = startRowIndex; i <= endRowIndex; i++) {
            for (let j = startColIndex; j <= endColIndex; j++) {
              (data as any[][])[i][j] = mergedValue; // Explicitly type data as any[][]
            }
          }
        });

        // Exclude the header row
        setExcelData(data);
        setFileUploaded(true); // Set fileUploaded to true after successful upload
        if (fileInputRef.current) {
          fileInputRef.current.value = ""; // Reset file input value after successful upload
        }
      }
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

  // Function to handle remove file
  const handleRemoveFile = () => {
    Modal.confirm({
      title: "Are you sure you want to remove the uploaded file?",
      onOk() {
        setExcelData([]);
        setFileUploaded(false);
      },
      onCancel() {},
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
            <Card
              style={{
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)", // Adding box shadow for a modern look
                borderRadius: "8px", // Optional: Add border-radius for rounded corners
              }}
            >
              <Title level={3}>Structure uploaded</Title>
              {fileUploaded && (
                <Button
                  type="primary"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={handleRemoveFile}
                  style={{ marginBottom: "16px" }}
                >
                  Remove Uploaded File
                </Button>
              )}
              <Table dataSource={excelData.slice(1)} columns={columns} />
            </Card>
          )}
        </div>
      </Space>
    </>
  );
};

export default HomeList;
