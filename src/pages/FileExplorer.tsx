import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FaTimes } from "react-icons/fa";
import api from "../lib/api";
import axios from "axios";
import { FaArrowLeftLong } from "react-icons/fa6";
import { LuFolderPlus } from "react-icons/lu";
import { MdFolder, MdOutlineFileUpload } from "react-icons/md";
import Navbar from "../components/Navbar";
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME!;
const PRESET = import.meta.env.VITE_CLOUDINARY_PRESET!;

// ---- API functions ----
const fetchFolders = async (parent: string | null) => {
  const { data } = await api.get("/api/folders", { params: { parent } });
  return data;
};

const fetchImages = async (parent: string | null) => {
  const { data } = await api.get("/api/images", { params: { folder: parent } });
  return data;
};

const createFolderApi = async ({
  name,
  parent,
}: {
  name: string;
  parent: string | null;
}) => {
  const { data } = await api.post("/api/folders", { name, parent });
  return data;
};

// ---- Component ----
export default function FileExplorer() {
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [showUploadImage, setShowUploadImage] = useState(false);

  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<
    { id: string | null; name: string }[]
  >([{ id: null, name: "root" }]);
  const [searchQuery, setSearchQuery] = useState("");

  const queryClient = useQueryClient();

  const { data: folders = [], isLoading: loadingFolders } = useQuery({
    queryKey: ["folders", currentFolder],
    queryFn: () => fetchFolders(currentFolder),
  });

  const { data: images = [], isLoading: loadingImages } = useQuery({
    queryKey: ["images", currentFolder],
    queryFn: () => fetchImages(currentFolder),
  });

  const filteredImages = images.filter((img: any) =>
    img.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Mutations
  const createFolderMutation = useMutation({
    mutationFn: createFolderApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders", currentFolder] });
      setShowCreateFolder(false);
    },
  });

  // Handlers
  const handleOpenFolder = (id: string, name: string) => {
    setCurrentFolder(id);
    setBreadcrumbs((prev) => [...prev, { id, name }]);
  };

  const handleGoBack = () => {
    if (breadcrumbs.length <= 1) return;
    const newCrumbs = [...breadcrumbs];
    newCrumbs.pop();
    setBreadcrumbs(newCrumbs);
    setCurrentFolder(newCrumbs[newCrumbs.length - 1].id);
  };

  if (loadingFolders || loadingImages)
    return <div className="p-4">Loading...</div>;


  return (
    <div>
      <Navbar onSearch={setSearchQuery} />
      <div className="p-6 w-full h-full">
        {showCreateFolder && (
          <CreateFolderModal
            onClose={() => setShowCreateFolder(false)}
            onCreate={(name) =>
              createFolderMutation.mutate({ name, parent: currentFolder })
            }
          />
        )}

        {showUploadImage && (
          <UploadImageModal
            onClose={() => setShowUploadImage(false)}
            folder={currentFolder}
            onSuccess={() =>
              queryClient.invalidateQueries({
                queryKey: ["images", currentFolder],
              })
            }
          />
        )}


        <div className="flex items-center gap-4 mb-6">
          {currentFolder !== null && (
            <button
              onClick={handleGoBack}
              className="px-4 py-2 rounded-full hover:bg-gray-100"
            >
              <FaArrowLeftLong />
            </button>
          )}
          <button
            onClick={() => setShowCreateFolder(true)}
            className="flex items-center gap-2 px-4 py-2 text-xs sm:text-base bg-purple-100 rounded-4xl hover:shadow  text-purple-700 hover:bg-white cursor-pointer"
          >
            <LuFolderPlus className="sm:text-xl text-sm" /> New Folder
          </button>

          <button
            onClick={() => setShowUploadImage(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-100 text-xs sm:text-base text-green-700 rounded-4xl hover:shadow hover:bg-white cursor-pointer"
          >
            <MdOutlineFileUpload className="sm:text-xl text-sm" /> Upload Image
          </button>
        </div>

        <div className="mb-4 text-gray-700">
          {breadcrumbs.map((b, idx) => (
            <span key={b.id || "root"}>
              {idx > 0 && " / "}
              {b.name}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-8 items-center text-neutral-600">
          {folders.map((folder: any) => (
            <div
              key={folder._id}
              className="flex flex-col items-center cursor-pointer hover:bg-yellow-100 p-2 rounded "
              onClick={() => handleOpenFolder(folder._id, folder.name)}
            >
              <MdFolder className="text-6xl font-light text-yellow-300" />
              <p className="mt-2 text-sm font-medium">{folder.name}</p>
            </div>
          ))}

          {filteredImages.map((img: any) => (
            <div
              key={img._id}
              className="flex flex-col items-center cursor-pointer"
            >
              <img
                src={img.url}
                alt={img.name}
                className="mt-2 w-30 h-30  rounded"
              />
              <p className="mt-2 text-sm font-medium">{img.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---- Modal Components ----
function CreateFolderModal({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (name: string) => void;
}) {
  const [name, setName] = useState("");

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-96 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black cursor-pointer"
        >
          <FaTimes />
        </button>
        <h2 className="text-lg font-bold mb-4">Create New Folder</h2>
        <input
          type="text"
          placeholder="Folder name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg mb-4 focus:outline-blue-300"
        />
        <button
          onClick={() => name && onCreate(name)}
          className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-500 hover:text-white cursor-pointer"
        >
          Create
        </button>
      </div>
    </div>
  );
}

interface UploadImageModalProps {
  onClose: () => void;
  folder: string | null;
  onSuccess: () => void;
}

export function UploadImageModal({
  onClose,
  folder,
  onSuccess,
}: UploadImageModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const preview = file ? URL.createObjectURL(file) : "";

  const handleUpload = async () => {
    if (!file || !name) return;
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("upload_preset", PRESET);

      const cloudRes = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        fd
      );

      await api.post("/api/images/upload", {
        name,
        url: cloudRes.data.secure_url,
        folder,
        public_id: cloudRes.data.public_id,
      });

      setFile(null);
      setName("");
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-96 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black cursor-pointer"
        >
          <FaTimes />
        </button>
        <h2 className="text-lg font-bold mb-4">Upload Image</h2>
        <input
          type="text"
          placeholder="Image Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg mb-2 focus:outline-cyan-500"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="w-full mb-2 cursor-pointer"
        />
        {preview && (
          <img src={preview} alt="preview" className="mt-2 w-40 rounded" />
        )}
        <button
          onClick={handleUpload}
          disabled={loading || !file || !name}
          className="mt-4 px-4 py-2 bg-green-200 text-green-700 rounded-lg hover:text-white hover:bg-green-300 disabled:opacity-50 cursor-pointer "
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </div>
    </div>
  );
}
