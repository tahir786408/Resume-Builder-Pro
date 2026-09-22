import CardShell from "./CardShell";
import { Field } from "../ui/Field";

export default function PersonalSection({ resume, update }) {
  return (
    <CardShell title="Personal details" id="sec-personal">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Full name" value={resume.fullName} onChange={(v) => update("fullName", v)} className="col-span-2 sm:col-span-1" />
        <Field label="Professional title" value={resume.title} onChange={(v) => update("title", v)} placeholder="e.g. MERN Stack Developer" className="col-span-2 sm:col-span-1" />
        <Field label="Email" type="email" value={resume.email} onChange={(v) => update("email", v)} />
        <Field label="Phone" value={resume.phone} onChange={(v) => update("phone", v)} />
        <Field label="Location" value={resume.location} onChange={(v) => update("location", v)} className="col-span-2 sm:col-span-1" />
        <Field label="Website" value={resume.website} onChange={(v) => update("website", v)} placeholder="yourname.dev" className="col-span-2 sm:col-span-1" />
        <Field label="LinkedIn" value={resume.linkedin} onChange={(v) => update("linkedin", v)} placeholder="linkedin.com/in/you" />
        <Field label="GitHub" value={resume.github} onChange={(v) => update("github", v)} placeholder="github.com/you" />
      </div>
    </CardShell>
  );
}
