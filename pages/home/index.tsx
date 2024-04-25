import {
  Typography,
  Button,
  Table,
  Space,
  Card,
  Modal,
  Select,
  Input,
  Spin,
} from "antd";
import {
  UploadOutlined,
  DownloadOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { saveAs } from "file-saver";
import * as ExcelJS from "exceljs";
import React, { useState, useRef, use, useEffect } from "react";
import * as XLSX from "xlsx";
import { ResponseExam } from "src/apis/gemini";
import UploadedStructure from "@components/cards/uploaded";
import ConfigQuestion from "@components/cards/configQuestion";
import ResultGenerated from "@components/cards/resultGenerated";
import { ExcelDataItem, SubmitDataItem, AnswerStore } from "src/interfaces";
import Link from "next/link";

const { Title } = Typography;

const HomeList: React.FC = () => {
  const [excelData, setExcelData] = useState<any[]>([]);
  const [convertedData, setConvertedData] = useState<ExcelDataItem[]>([]); // State to store the converted data
  const [submitData, setSubmitData] = useState<SubmitDataItem[]>([]); // State to store the data to be submitted
  const [fileUploaded, setFileUploaded] = useState<boolean>(false); // State to track file upload
  const fileInputRef = useRef<HTMLInputElement>(null); // Ref for file input element
  const [questionTypes, setQuestionTypes] = useState<string[]>([]);
  const [hints, setHints] = useState<string[]>([]);
  const [multipleChoiceArr, setMultipleChoiceArr] = useState<ResponseExam[]>(
    []
  );
  const [answerStore, setAnswerStore] = useState<AnswerStore[]>([]);
  const [enableSpinnerResult, setEnableSpinnerResult] =
    useState<boolean>(false);
  useEffect(() => {
    setConvertedData(
      excelData.slice(1).map((row) => ({
        order: row[0],
        typeOfKnowledge: row[1],
        topic: row[2],
        numberOfQuestions: row[3],
        recognize: row[4] === "null" ? null : row[4],
        understand: row[5] === "null" ? null : row[5],
        apply: row[6] === "null" ? null : row[6],
        highlyApplied: row[7] === "null" ? null : row[7],
      }))
    );
  }, [excelData]);

  // Assuming your JSON data is stored in a variable named `jsonData`

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
        setAnswerStore([]);
      },
      onCancel() {},
    });
  };

  return (
    <>
      <Title level={2}>Build your own English test!</Title>
      <br />
      <div>
        If you are new, click <Link href="/help">here</Link> for video guide
      </div>
      <br />
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
            <UploadedStructure
              excelData={excelData}
              fileUploaded={fileUploaded}
              handleRemoveFile={handleRemoveFile}
            />
          )}
        </div>
        <div>
          {excelData.length > 0 && (
            <ConfigQuestion
              convertedData={convertedData}
              excelData={excelData}
              answerStore={answerStore}
              setAnswerStore={setAnswerStore}
              questionTypes={questionTypes}
              setQuestionTypes={setQuestionTypes}
              hints={hints}
              setHints={setHints}
              submitData={submitData}
              setSubmitData={setSubmitData}
              enableSpinnerResult={enableSpinnerResult}
              setEnableSpinnerResult={setEnableSpinnerResult}
            />
          )}
        </div>
        <div>
          {enableSpinnerResult == true && <Spin />}
          {answerStore.length > 0 && (
            <ResultGenerated
              answerStore={answerStore}
              convertedData={convertedData}
              submitData={submitData}
            />
          )}
        </div>
      </Space>
    </>
  );
};

export default HomeList;
