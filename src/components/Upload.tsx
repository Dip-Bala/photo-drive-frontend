import { useState, type ChangeEvent } from "react";
import axios from "axios";
import { FiUpload } from "react-icons/fi";

const {VITE_CLOUDINARY_PRESET, VITE_CLOUDINARY_CLOUD_NAME} = import.meta.env;
console.log(VITE_CLOUDINARY_PRESET)
export default function Upload() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", VITE_CLOUDINARY_PRESET);

    try {
      setLoading(true);
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        data
      );

      setImageUrl(res.data.secure_url); 
      console.log("Uploaded Image URL:", res.data);
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-sm shadow p-6">
      <div className="flex flex-col items-center text-center border border-dashed p-4 rounded-lg">
        <FiUpload className="w-10 h-10 mb-2" />
        <input
          type="file"
          onChange={handleUpload}
          className="cursor-pointer bg-amber-200 p-2 rounded"
        />
      </div>

      {loading && <p className="mt-4 text-blue-500">Uploading...</p>}

      {imageUrl && (
        <div className="mt-4">
          <p className="text-sm">Uploaded Image:</p>
          <img src={imageUrl} alt="Uploaded" className="mt-2 w-40 rounded-lg" />
          <p className="mt-2 text-xs break-all">{imageUrl}</p>
        </div>
      )}
    </div>
  );
}
