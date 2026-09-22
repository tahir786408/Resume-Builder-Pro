import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import ResumePreview from "../components/ResumePreview";
import Logo from "../components/ui/Logo";
import Button from "../components/ui/Button";
import { Download, Lock } from "lucide-react";

export default function PublicResume() {
  const { slug } = useParams();
  const [resume, setResume] = useState(null);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    api
      .get(`/public/${slug}`)
      .then(({ data }) => setResume(data))
      .catch((err) => setError(err.response?.data?.message || "This resume could not be found."));
  }, [slug]);

  const downloadPdf = async () => {
    setDownloading(true);
    try {
      const res = await api.get(`/public/${slug}/pdf`, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${(resume.fullName || "resume").replace(/\s+/g, "_")}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
  };

  if (error)
    return (
      <div className="min-h-screen bg-onyx flex flex-col items-center justify-center text-center px-6">
        <Lock size={28} className="text-white/25 mb-4" />
        <p className="text-white/60">{error}</p>
      </div>
    );

  if (!resume)
    return (
      <div className="min-h-screen bg-onyx flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-gold/30 border-t-gold animate-spin" />
      </div>
    );

  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-line px-6 py-4 flex items-center justify-between bg-panel sticky top-0 z-10">
        <Logo />
        <Button variant="gold" size="sm" icon={Download} onClick={downloadPdf} loading={downloading}>
          Download PDF
        </Button>
      </header>
      <div className="py-10 px-4">
        <ResumePreview resume={resume} />
      </div>
    </div>
  );
}
