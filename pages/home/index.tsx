import {
  Typography,
  Button,
  Table,
  Space,
  Card,
  Modal,
  Select,
  Input,
} from "antd";
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
interface Props {
  onSubmit: (data: {
    order: number;
    topic: string;
    questionType: string;
    hint: string;
  }) => void;
}
interface SubmitDataItem {
  order: number;
  topic: string;
  questionType: string;
  hint: string;
}
interface ExcelDataItem {
  order: number;
  typeOfKnowledge: string;
  topic: string;
  numberOfQuestions: number;
  recognize: string | null;
  understand: string | null;
  apply: string | null;
  highlyApplied: string | null;
}

const HomeList: React.FC = () => {
  const [excelData, setExcelData] = useState<any[]>([]);
  const [convertedData, setConvertedData] = useState<ExcelDataItem[]>([]); // State to store the converted data
  const [fileUploaded, setFileUploaded] = useState<boolean>(false); // State to track file upload
  const fileInputRef = useRef<HTMLInputElement>(null); // Ref for file input element
  const [order, setOrder] = useState<number | undefined>(undefined);
  const [topic, setTopic] = useState<string>("");
  const [questionType, setQuestionType] = useState<string>("");
  const [hint, setHint] = useState<string>("");
  const [questionTypes, setQuestionTypes] = useState<string[]>([]);
  const [hints, setHints] = useState<string[]>([]);
  const [submitData, setSubmitData] = useState<SubmitDataItem[][]>([]); // State to store the data to be submitted
  const handleSubmission = () => {
    // Iterate over dataSource to access each row
    const newData = dataSource.map((dataItem, index) => {
      // Extract data from each row
      const { order, topic } = dataItem; // These are common to all rows
      const questionType = questionTypes[index]; // Get the question type from state array
      const hint = hints[index]; // Get the hint from state array

      // Construct the object for the current row
      return { order, topic, questionType, hint };
    });

    // Update the submitData state with the new data
    setSubmitData(newData as unknown as SubmitDataItem[][]); // Cast newData as unknown first, then as SubmitDataItem[][]
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
    console.log(JSON.stringify(newData)); // Log the new data to the console
    console.log(JSON.stringify(convertedData));
  };

  // Assuming your JSON data is stored in a variable named `jsonData`
  const dataSource = excelData.slice(1).map((row: any) => ({
    order: row[0],
    topic: row[2],
  }));
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
        console.log(JSON.stringify(data));
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
  const columnsCallApi = [
    { title: "Order", dataIndex: "order", key: "order" },
    { title: "Topic", dataIndex: "topic", key: "topic" },
    {
      title: "Type of question",
      dataIndex: "type",
      key: "type",
      render: (_text: any, _record: any, index: number) => (
        <Select
          onChange={(value) => {
            const newQuestionTypes = [...questionTypes];
            newQuestionTypes[index] = value;
            setQuestionTypes(newQuestionTypes);
          }}
          style={{ minWidth: "150px" }}
        >
          <Select.Option value="Multiple choices">
            Multiple choices
          </Select.Option>
          <Select.Option value="Paragraph">Paragraph</Select.Option>
          <Select.Option value="Fill in">Fill in</Select.Option>
        </Select>
      ),
    },
    {
      title: "Hint",
      dataIndex: "hint",
      key: "hint",
      render: (_text: any, _record: any, index: number) => (
        <Input
          onChange={(e) => {
            const newHints = [...hints];
            newHints[index] = e.target.value;
            setHints(newHints);
          }}
          style={{ minWidth: "150px" }}
        />
      ),
    },
  ];

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
        <div>
          {excelData.length > 0 && (
            <Card
              style={{
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)", // Adding box shadow for a modern look
                borderRadius: "8px", // Optional: Add border-radius for rounded corners
              }}
            >
              <Title level={3}>Config questions</Title>
              <Table dataSource={dataSource} columns={columnsCallApi} />
              <Button type="primary" onClick={handleSubmission}>
                Submit
              </Button>
            </Card>
          )}
        </div>
      </Space>
    </>
  );
};

export default HomeList;
