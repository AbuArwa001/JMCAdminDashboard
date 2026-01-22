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

            {/* Right Side - Branding Section */}
            <div className="hidden lg:flex flex-col items-center justify-center relative bg-primary overflow-hidden">
                {/* Background Pattern/Gradient */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary-bronze via-primary to-primary-bronze opacity-90" />

                {/* Subtle Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full blur-3xl -ml-48 -mb-48" />

                <div className="relative z-10 text-center px-12 space-y-8">
                    <div className="relative w-32 h-32 mx-auto bg-white rounded-2xl p-4 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
                        <Image
                            src="/logo.png"
                            alt="JMC Logo"
                            fill
                            className="object-contain p-2"
                            priority
                        />
                    </div>

                    <div className="space-y-4 max-w-sm mx-auto">
                        <h2 className="text-4xl font-bold text-white tracking-tight">
                            Jamia Mosque <br />
                            <span className="text-primary-bronze brightness-150">Admin Portal</span>
                        </h2>
                        <p className="text-white/80 text-lg leading-relaxed">
                            A centralized platform for transparent donation tracking and efficient management of Jamia Mosque's charitable initiatives.
                        </p>
                    </div>

                    <div className="pt-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white/90 text-sm font-medium">
                            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                            Live Statistics Tracking
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
