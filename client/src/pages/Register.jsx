import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import Logo from "../components/ui/Logo";
import Button from "../components/ui/Button";
import { Field } from "../components/ui/Field";
import { UserPlus } from "lucide-react";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(name, email, password);
      navigate("/editor");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-onyx bg-onyx-radial bg-noise flex items-center justify-center px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <Logo dark />
        </div>
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl text-ivory">Create your account</h1>
          <p className="text-gold text-sm mt-1.5 italic">Craft a resume worth reading</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-onyxcard border border-white/10 rounded-xl shadow-panel p-7 space-y-4">
          {error && <p className="text-sm text-danger bg-danger/10 border border-danger/25 rounded-sm px-3 py-2">{error}</p>}
          <Field label="Full name" value={name} onChange={setName} />
          <Field label="Email" type="email" value={email} onChange={setEmail} />
          <Field label="Password" type="password" value={password} onChange={setPassword} />
          <p className="text-[11px] text-white/30 -mt-1">At least 6 characters.</p>
          <Button type="submit" loading={loading} icon={UserPlus} className="w-full mt-1">
            Create account
          </Button>
        </form>

        <p className="text-center text-sm text-white/50 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-gold hover:underline">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
