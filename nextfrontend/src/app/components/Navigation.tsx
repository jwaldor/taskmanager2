"use client";

import { usePathname } from "next/navigation";
// import { useLoadState, useSaveState } from "../LoadState";

export default function Navigation() {
    const pathname = usePathname();
    // useLoadState();
    // useSaveState();
    return (
        <nav className="bg-gray-800 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <div className="text-white font-bold">Your Logo</div>
                <div className="space-x-4">
                    {pathname !== "/" && (
                        <a href="/" className="text-white hover:text-gray-300">Home</a>
                    )}
                    {pathname !== "/alltasks" && (
                        <a href="/alltasks" className="text-white hover:text-gray-300">All Tasks</a>
                    )}
                    {pathname !== "/tabview" && (
                        <a href="/tabview" className="text-white hover:text-gray-300">Tab View</a>
                    )}
                    {pathname !== "/theme" && (
                        <a href="/theme" className="text-white hover:text-gray-300">Set Theme</a>
                    )}
                    {pathname !== "/epics" && (
                        <a href="/epics" className="text-white hover:text-gray-300">Epics</a>
                    )}
                </div>
            </div>
        </nav>
    );
}