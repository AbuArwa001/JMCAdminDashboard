import Image from "next/image";

export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Left Side - Form */}
            <div className="flex items-center justify-center p-8 md:p-12 lg:p-16">
                <div className="w-full max-w-md space-y-8">
                    {children}
                </div>
            </div>

            {/* Right Side - Image */}
            <div className="hidden lg:block relative bg-muted">
                <Image
                    src="/logo.png"
                    alt="JMC Admin Dashboard"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/20" /> {/* Optional overlay for better text contrast if needed later */}
            </div>
        </div>
    );
}
