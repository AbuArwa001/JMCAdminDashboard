"use client";

import { ACTIVE_DRIVES, RECENT_DONATIONS } from "@/lib/data";
import DriveProgressCard from "@/components/dashboard/DriveProgressCard";
import DonorsTable from "@/components/dashboard/DonorsTable";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default function DriveDetailsPage({ params }: { params: { id: string } }) {
    const drive = ACTIVE_DRIVES.find((d) => d.id === params.id);

    if (!drive) {
        return notFound();
    }

    // Filter donations for this drive
    const driveDonations = RECENT_DONATIONS.filter((d) => d.driveId === params.id);

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/drives" className="p-2 hover:bg-gray-100 rounded-full text-gray-600">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">{drive.title}</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <DriveProgressCard drive={drive} />
                    <div className="mt-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h4 className="font-bold text-gray-900 mb-4">Drive Details</h4>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Category</span>
                                <span className="font-medium">{drive.category}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Start Date</span>
                                <span className="font-medium">{drive.startDate}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Status</span>
                                <span className="font-medium">{drive.status}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2">
                    <DonorsTable donations={driveDonations} driveTitle={drive.title} />
                </div>
            </div>
        </div>
    );
}
