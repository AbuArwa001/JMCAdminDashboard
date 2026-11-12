"use client";

import { Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRBAC } from "@/hooks/useRBAC";
import { useSettingsPage } from "@/hooks/use-settings-page";
import { SettingsSidebar } from "@/components/settings/SettingsSidebar";
import { SettingsProfileTab } from "@/components/settings/SettingsProfileTab";
import { SettingsClearanceTab } from "@/components/settings/SettingsClearanceTab";
import { SettingsSecurityTab } from "@/components/settings/SettingsSecurityTab";
import { SettingsNotificationsTab } from "@/components/settings/SettingsNotificationsTab";
import { SettingsEmailModal } from "@/components/settings/SettingsEmailModal";

export default function SettingsPage() {
  const { staffUser, isSuperAdmin, permissions, hasPermission } = useRBAC();
  const {
    activeTab, setActiveTab, isFetching, isSavingProfile, initialEmail, isEmailChanged,
    isEmailModalOpen, setIsEmailModalOpen, formData, setFormData, handleProfileSubmit, confirmEmailChange
  } = useSettingsPage(staffUser);

  const roleName = staffUser?.role?.role_name || (isSuperAdmin ? "Super Admin" : "Staff Administrator");
  const roleColor = staffUser?.role?.color || (isSuperAdmin ? "#c99335" : "#10b981");

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1a1512] to-[#2d2520] flex items-center justify-center shadow-md">
          <Settings className="w-5 h-5 text-gray-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#1a1512] tracking-tight" style={{ fontFamily: "var(--font-cinzel), serif" }}>Portal Settings</h1>
          <p className="text-sm text-gray-500 font-medium mt-0.5">Manage your account preferences, credentials, and verify your role permissions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <SettingsSidebar
          formData={formData}
          roleName={roleName}
          roleColor={roleColor}
          isSuperAdmin={isSuperAdmin}
          hasPermission={hasPermission}
          activeTab={activeTab}
          onSelectTab={setActiveTab}
        />

        <div className="md:col-span-8">
          <motion.div key={activeTab} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25 }} className="form-section">
            {activeTab === "profile" && (
              <SettingsProfileTab
                formData={formData}
                initialEmail={initialEmail}
                isEmailChanged={isEmailChanged}
                isFetching={isFetching}
                isSavingProfile={isSavingProfile}
                onChange={(f, v) => setFormData((p) => ({ ...p, [f]: v }))}
                onSubmit={handleProfileSubmit}
                onOpenEmailModal={() => setIsEmailModalOpen(true)}
              />
            )}
            {activeTab === "clearance" && (
              <SettingsClearanceTab
                roleName={roleName}
                roleColor={roleColor}
                isSuperAdmin={isSuperAdmin}
                permissions={permissions}
                roleDescription={staffUser?.role?.description}
              />
            )}
            {activeTab === "security" && <SettingsSecurityTab initialEmail={initialEmail} />}
            {activeTab === "notifications" && <SettingsNotificationsTab />}
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {isEmailModalOpen && (
          <SettingsEmailModal
            initialEmail={initialEmail}
            newEmail={formData.email.trim().toLowerCase()}
            onClose={() => setIsEmailModalOpen(false)}
            onConfirm={confirmEmailChange}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
