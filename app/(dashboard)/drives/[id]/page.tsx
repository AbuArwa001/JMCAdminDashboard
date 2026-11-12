"use client";

import DriveProgressCard from "@/components/dashboard/DriveProgressCard";
import DriveImages from "@/components/dashboard/DriveImages";
import DonorsTable from "@/components/dashboard/DonorsTable";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useDriveDetail } from "@/hooks/use-drive-detail";
import { DriveMetaCard } from "@/components/drives/DriveMetaCard";

export default function DriveDetailsPage({ params }: { params: { id: string } }) {
  const { drive, loading, category, setDonations, driveDonations, fetchDrive } = useDriveDetail(params.id);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" />
          <p className="mt-2 text-gray-600">Loading drive details...</p>
        </div>
      </div>
    );
  }

  if (!drive) return notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/drives" className="p-2 hover:bg-gray-100 rounded-full text-gray-600">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">{drive.title}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full items-start">
        <div className="lg:col-span-1 space-y-6">
          <DriveProgressCard drive={drive} />
          <DriveMetaCard drive={drive} category={category} />
          <DriveImages driveId={drive.id} initialImages={drive.images || []} image_urls={drive.image_urls || []} onImagesUpdated={fetchDrive} />
        </div>

        <div className="lg:col-span-2">
          <DonorsTable
            donations={driveDonations}
            driveTitle={drive.title}
            onDonationDeleted={(deletedId) => {
              setDonations((prev) => prev.filter((d) => d.id !== deletedId));
              fetchDrive();
            }}
            onDonationUpdated={(updated) => {
              setDonations((prev) =>
                prev.map((d) =>
                  d.id === updated.id
                    ? { ...d, amount: updated.amount, payment_status: updated.status, payment_method: updated.paymentMethod, account_name: updated.donorName }
                    : d
                )
              );
              fetchDrive();
            }}
          />
        </div>
      </div>
    </div>
  );
}
