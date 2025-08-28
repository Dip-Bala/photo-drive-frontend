// src/pages/Dashboard.tsx
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../lib/api";
import UploadForm from "../upload/UploadForm";

type Folder = {
  _id: string;
  name: string;
  parent?: string;
};

type Image = {
  _id: string;
  name: string;
  url: string;
};

export default function Dashboard() {
  // Fetch folders
  const { data: folders, refetch: refetchFolders } = useQuery<Folder[]>({
    queryKey: ["folders"],
    queryFn: async () => {
      const res = await api.get("/api/folders");
      return res.data;
    },
  });

  // Fetch images
  const { data: images, refetch: refetchImages } = useQuery<Image[]>({
    queryKey: ["images"],
    queryFn: async () => {
      const res = await api.get("/api/images");
      return res.data;
    },
  });

  // Refetch folders/images when component mounts
  useEffect(() => {
    refetchFolders();
    refetchImages();
  }, []);

  return (
    <div className="min-h-screen p-6 flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Your Dashboard</h1>

      <div className="flex gap-4">
        <div className="w-1/2 p-4 border rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Folders</h2>
          {folders?.length ? (
            <ul className="flex flex-col gap-1">
              {folders.map((f) => (
                <li key={f._id} className="p-2 border rounded">
                  {f.name}
                </li>
              ))}
            </ul>
          ) : (
            <p>No folders yet</p>
          )}
        </div>

        <div className="w-1/2 p-4 border rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Images</h2>
          {images?.length ? (
            <ul className="flex flex-col gap-2">
              {images.map((img) => (
                <li key={img._id} className="flex flex-col border rounded p-2">
                  <p className="font-medium">{img.name}</p>
                  <img src={img.url} className="w-40 mt-1 rounded" />
                </li>
              ))}
            </ul>
          ) : (
            <p>No images yet</p>
          )}
        </div>
      </div>

      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-2">Upload New Image</h2>
        <UploadForm onSuccess={() => refetchImages()} />
      </div>
    </div>
  );
}
