import Link from "next/link";
import { useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import Sidebar from "../sidebar/main";

export default function Navbar() {
    const [isMenu, setIsMenu] = useState(false);

    return (
        <div>
            <div
                onClick={() => setIsMenu(false)}
                className={`md:hidden absolute z-[99] w-full bg-black/50 transition-all duration-300 ${isMenu ? 'opacity-100' : 'opacity-0'} ${isMenu ? 'visible' : 'invisible'}`}
            >
                <div className={`transition-all duration-500 ${isMenu ? 'ml-0' : 'ml-[-300px]'}`}>
                    <Sidebar />
                </div>
            </div>
            <div className="flex w-full md:justify-end justify-between items-center py-4 md:px-32 px-8 ">
                <div
                    onClick={() => setIsMenu(true)}
                    className="md:hidden"
                >
                    <AiOutlineMenu size={20} />
                </div>
                <Link href="/">
                    <button className="bg-white px-6 py-3 rounded-3xl text-black text-xs hover:bg-blue-600 duration-200">Home</button>
                </Link>
            </div>
        </div>
    );
}
