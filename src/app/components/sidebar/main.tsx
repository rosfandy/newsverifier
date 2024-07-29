"use client"
import Link from "next/link"
import { AiFillHome } from "react-icons/ai";
import { LuChevronFirst, LuChevronLast } from "react-icons/lu";
import { FaCircleDollarToSlot } from "react-icons/fa6";
import { useSearchParams, usePathname } from 'next/navigation'
import { useState } from "react";

const sidebarItems = [
    {
        name: "Dashboard",
        href: "/main/dashboard",
        icon: AiFillHome,
    },
];


export default function Sidebar() {
    const pathname = usePathname()
    const [expanded, setExpanded] = useState(true)

    return (
        <div className={`bg-white shadow min-h-screen px-4 py-8 flex flex-col gap-y-8 transition-all duration-300 ${expanded ? "w-[16em]" : 'w-[4.4em]'}`}>
            <div className="flex justify-between items-center">
                <div className={`font-bold duration-200 text-blue-800 ${expanded ? "" : " md:ml-[-200px] "}`}>NewsVerifier</div>
                <button onClick={() => setExpanded((isExpanded) => !isExpanded)} className="bg-blue-100 px-2 py-1 rounded-md cursor-pointer">
                    {expanded ? (
                        <LuChevronFirst size={24} className="md:inline hidden" />
                    ) : (
                        <LuChevronLast size={24} className="md:inline hidden" />
                    )}
                </button>
            </div>
            <div className="flex flex-col gap-y-2">
                {sidebarItems.map(({ name, href, icon: Icon }) => {
                    return (
                        <div className="" key={name}>
                            <Link href={href}>
                                <div className={`rounded duration-200 hover:bg-blue-100 hover:text-blue-800 ${pathname === href ? 'bg-blue-100 text-blue-800' : 'text-slate-500'}`}>
                                    <div className={`flex gap-x-2 px-2 py-2 transition-all ${!expanded ? "" : ""}`}>
                                        <Icon />
                                        <span className={`text-sm font-[500] overflow-hidden transition-all ${expanded ? "" : "hidden"}`}>{name}</span>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}