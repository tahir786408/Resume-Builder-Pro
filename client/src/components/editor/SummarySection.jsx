import { useState } from "react";
import CardShell from "./CardShell";
import { TextArea } from "../ui/Field";
import AiButton from "../ui/AiButton";
import api from "../../api/axios";
import { useToast } from "../../context/ToastContext";

export default function SummarySection({ resume, update }) {
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const generate = async () => {
    setLoading(true);
    try {
      const { data } = await api.post("/ai/summary", { resume, current: resume.summary });
      update("summary", data.text);
      toast.success("Summary refreshed by AI.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not generate a summary.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CardShell
      title="Profile summary"
      id="sec-summary"
      action={<AiButton onClick={generate} loading={loading}>{resume.summary ? "Improve with AI" : "Write with AI"}</AiButton>}
    >
      <TextArea
        value={resume.summary}
        onChange={(v) => update("summary", v)}
        rows={4}
        maxLength={2000}
        placeholder="A short, confident summary of who you are and what you bring."
      />
    </CardShell>
  );
}
