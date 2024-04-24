import React, { useEffect, useState } from "react";
import { Modal, Upload, Button, Image } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import {
  StorageReference,
  getDownloadURL,
  listAll,
  ref,
  uploadBytes,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { firebaseConfig, imageDb } from "src/apis/Config";
interface UploadModalProps {
  visible: boolean;
  onCancel: () => void;
}

const UploadModal: React.FC<UploadModalProps> = ({ visible, onCancel }) => {
  const [img, setImg] = useState<File | null>(null);
  const [imgUrl, setImgUrl] = useState<string[]>([]);

  const handleClick = () => {
    if (img !== null) {
      const imgRef: StorageReference = ref(imageDb, `files/${uuidv4()}`);
      uploadBytes(imgRef, img).then((value) => {
        getDownloadURL(value.ref).then((url) => {
          setImgUrl((data) => [...data, url]);
        });
      });
    }
  };

  useEffect(() => {
    listAll(ref(imageDb, "files")).then((imgs) => {
      imgs.items.forEach((val) => {
        getDownloadURL(val).then((url) => {
          setImgUrl((data) => [...data, url]);
        });
      });
    });
  }, []);

  useEffect(() => {
    console.log(imgUrl);
  }, [imgUrl]);

  const handleRemove = () => {
    // Clear the selected file
    setImg(null);
  };

  return (
    <Modal
      visible={visible}
      title="Upload Image"
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button
          key="upload"
          type="primary"
          onClick={handleClick}
          disabled={!img}
        >
          Upload
        </Button>,
      ]}
    >
      {img ? (
        <div>
          <Image
            src={URL.createObjectURL(img)}
            alt="Uploaded Image"
            style={{ maxWidth: "100%", maxHeight: "200px" }}
          />
          <Button onClick={handleRemove} style={{ marginTop: "10px" }}>
            Remove
          </Button>
        </div>
      ) : (
        <Upload.Dragger
          fileList={[]}
          beforeUpload={(newFile) => {
            // Allow only one file to be uploaded
            setImg(newFile);
            return false;
          }}
        >
          <p className="ant-upload-drag-icon">
            <UploadOutlined />
          </p>
          <p className="ant-upload-text">
            Click or drag file to this area to upload
          </p>
        </Upload.Dragger>
      )}
    </Modal>
  );
};

export default UploadModal;
