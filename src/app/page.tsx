import Navbar from "./components/navbar/home";
import Link from "next/link";

export default function Home() {
  return (
    <main className="w-full min-h-screen">
      <Navbar />
      <div className="flex justify-center items-center md:px-32">
        <div className="flex w-full md:px-8 md:pt-40 pt-32">
          <div className="md:w-2/3 px-8 flex flex-col gap-y-4 justify-center">
            <h3 className="md:text-[36px] text-[32px] font-bold">Analyze News for Hoaxes and Misinformation</h3>
            <p className="md:text-[18px] text-[14px]">Leverage our cutting-edge tools to identify hoaxes and misinformation in the news. Use our advanced algorithms to ensure the integrity of the information you consume, helping you stay well-informed with accurate news.</p>
            <div>
              <Link href={'/main/dashboard'}>
                <button className="border border-black rounded-3xl px-6 py-3 hover:bg-black/80 hover:text-white text-sm duration-200">Learn more</button>
              </Link>
            </div>
          </div>
          <div className="w-1/2 hidden md:flex justify-center">
            <div style={{ backgroundImage: "url('/hoax.png')" }}
              className="bg-cover h-[300px] w-[450px] ">
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
