"use client"
import { ReactNode, useState } from 'react';
import Navbar from '../components/navbar/admin';
import Sidebar from '../components/sidebar/main';

interface LayoutProps {
    children: ReactNode;
}

export default function DashboardLayout({ children }: LayoutProps) {
    const [showSidebar, setShowSidebar] = useState(false);

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-700">
            <div className="flex">
                {/* <div className="md:inline hidden">
                    <Sidebar />
                </div> */}
                <div className="w-full flex flex-col gap-y-4">
                    <Navbar />
                    {children}
                </div>
            </div>
        </div>
    );
}
