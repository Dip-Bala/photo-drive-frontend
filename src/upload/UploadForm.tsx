// src/upload/UploadForm.tsx
import { useForm } from "react-hook-form";
import api from "../lib/api";

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME!;
const PRESET = import.meta.env.VITE_CLOUDINARY_PRESET!;

type FormValues = { name: string; file: FileList };
type Props = { onSuccess?: () => void };

export default function UploadForm({ onSuccess }: Props) {
  const { register, handleSubmit, watch, reset } = useForm<FormValues>();
  const fileList = watch("file");
  const preview = fileList?.length ? URL.createObjectURL(fileList[0]) : "";

  async function onSubmit(values: FormValues) {
    if (!values.file.length) return;
    const file = values.file[0];

    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", PRESET);

    try {
      const cloudRes = await api.post(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, fd);
      // save metadata to backend
      await api.post("/api/images", { name: values.name, url: cloudRes.data.secure_url, public_id: cloudRes.data.public_id });
      reset();
      onSuccess?.();
    } catch (err) {
      console.error("Upload failed", err);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-2 border p-4 rounded">
      <input {...register("name")} placeholder="Image Name" className="border p-2 rounded" />
      <input type="file" {...register("file")} className="border p-2 rounded" />
      <button type="submit" className="bg-slate-800 text-white p-2 rounded">Upload</button>
      {preview && <img src={preview} className="mt-2 w-40 rounded" />}
    </form>
  );
}
