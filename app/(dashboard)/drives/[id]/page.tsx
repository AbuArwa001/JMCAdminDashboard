"use client";

import { DonationDrive, RECENT_DONATIONS } from "@/lib/data";
import DriveProgressCard from "@/components/dashboard/DriveProgressCard";
import DonorsTable from "@/components/dashboard/DonorsTable";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { getDonationDriveById } from "@/lib/api_data";

export default function DriveDetailsPage({ params }: { params: { id: string } }) {
    // params is NOT a Promise - it's a regular object
    const { id } = params;
    
    console.log("Drive ID:", id);
    
    const [drive, setDrive] = useState<DonationDrive | undefined>();
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchDrive = async () => {
            try {
                setLoading(true);
                console.log("Fetching drive with ID:", id);
                const driveData = await getDonationDriveById(id);
                console.log("Drive data received:", driveData);
                setDrive(driveData);
            } catch (error) {
                console.error("Error fetching drive:", error);
                setDrive(undefined);
            } finally {
                setLoading(false);
            }
        };
        
        if (id) {
            fetchDrive();
        }
    }, [id]);

    // Show loading state
    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading drive details...</p>
                </div>
            </div>
        );
    }

    // Only show notFound after loading is complete and no drive data
    if (!drive) {
        return notFound();
    }

    // Filter donations for this drive
    const driveDonations = RECENT_DONATIONS.filter((d) => d.driveId === id);

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
                                <span className="font-medium">{drive.start_date}</span>
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