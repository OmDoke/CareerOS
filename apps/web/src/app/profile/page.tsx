"use client";

import { ProfileForm } from "../../features/user/components/ProfileForm";
import { ChangePasswordForm } from "../../features/user/components/ChangePasswordForm";
import Link from "next/link";
import { Button } from "../../components/ui/button";

export default function ProfilePage() {
  return (
    <>
      <div className="max-w-4xl mx-auto py-8">
        <div className="flex justify-between items-center mb-8 border-b pb-4">
          <h1 className="text-3xl font-bold">User Profile</h1>
          <Link href="/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg border shadow-sm">
              <h2 className="text-xl font-semibold mb-4 border-b pb-2">Update Profile</h2>
              <ProfileForm />
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg border shadow-sm">
              <h2 className="text-xl font-semibold mb-4 border-b pb-2">Change Password</h2>
              <ChangePasswordForm />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
