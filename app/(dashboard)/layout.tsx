import DashboardLayout from "@/components/layout/DashboardLayout";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySession } from "@/lib/firebase-admin";

export default async function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const cookieStore = cookies();
    const token = cookieStore.get("firebaseToken")?.value;

    if (!token) {
        redirect("/login");
    }

    const session = await verifySession(token);
    if (!session) {
        // Redirect with error to bypass middleware check and trigger client-side cleanup
        redirect("/login?error=session_expired");
    }

    return (
        <DashboardLayout>
            {children}
        </DashboardLayout>
    );
}
