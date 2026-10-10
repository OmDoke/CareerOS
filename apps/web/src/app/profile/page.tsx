"use client";

import { ProfileForm } from "../../features/user/components/ProfileForm";
import { ChangePasswordForm } from "../../features/user/components/ChangePasswordForm";
import Link from "next/link";
import { Button } from "../../components/ui/button";

export default function ProfilePage() {
  return (
    <>
      <div className="max-w-4xl mx-auto py-8">
        <div className="flex justify-between items-center mb-8 border-b border-slate-200/80 pb-4">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">User Profile</h1>
          <Link href="/dashboard">
            <Button variant="outline" className="rounded-full">Back to Dashboard</Button>
          </Link>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200/80 bg-white/85 backdrop-blur-xl p-8 shadow-soft shadow-[inset_0_1px_1px_0_rgba(255,255,255,1)]">
              <h2 className="text-xl font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Update Profile</h2>
              <ProfileForm />
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200/80 bg-white/85 backdrop-blur-xl p-8 shadow-soft shadow-[inset_0_1px_1px_0_rgba(255,255,255,1)]">
              <h2 className="text-xl font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Change Password</h2>
              <ChangePasswordForm />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
