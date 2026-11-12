import { useState } from "react";
import { UserPlus, X, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { RoleDetail } from "@/lib/rbac_api";

interface Props {
  roles: RoleDetail[];
  submitting: boolean;
  onClose: () => void;
  onSubmit: (form: { full_name: string; email: string; phone_number: string; password: string; role_id: string }) => void;
}

export function UserInviteModal({ roles, submitting, onClose, onSubmit }: Props) {
  const [form, setForm] = useState({ full_name: "", email: "", phone_number: "", password: "", role_id: roles[0]?.id || "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1a1512]/60 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-lg bg-white rounded-3xl border border-gray-100 shadow-2xl overflow-hidden p-6 md:p-8">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-50 text-[#c99335]"><UserPlus className="w-5 h-5" /></div>
            <div>
              <h3 className="text-lg font-bold text-[#1a1512]" style={{ fontFamily: "var(--font-cinzel), serif" }}>Grant Portal Clearance</h3>
              <p className="text-xs text-gray-400">Provision a new staff account or promote user</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 pt-5">
          <div><label className="form-label">Full Name</label><input type="text" required value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} placeholder="Sheikh Omar Farouk" className="form-input text-xs" /></div>
          <div><label className="form-label">Email Address</label><input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="officer@jamiamosque.co.ke" className="form-input text-xs" /></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div><label className="form-label">Phone (Optional)</label><input type="text" value={form.phone_number} onChange={(e) => setForm({ ...form, phone_number: e.target.value })} placeholder="+254 700 000 000" className="form-input text-xs" /></div>
            <div>
              <label className="form-label">Temporary Password</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Blank to auto-generate" className="form-input text-xs pr-10" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">{showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}</button>
              </div>
            </div>
          </div>
          <div>
            <label className="form-label">Assign Role Clearance</label>
            <select required value={form.role_id} onChange={(e) => setForm({ ...form, role_id: e.target.value })} className="form-input text-xs bg-white">
              {roles.map((r) => (<option key={r.id} value={r.id}>{r.role_name} — {r.description || `${r.permissions.length} perms`}</option>))}
            </select>
          </div>
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button type="button" onClick={onClose} className="btn-secondary py-2.5 px-4 text-xs">Cancel</button>
            <button type="submit" disabled={submitting} className="btn-primary py-2.5 px-5 text-xs shadow-gold-sm">{submitting ? "Provisioning..." : "Confirm & Grant Access"}</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
