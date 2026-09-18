import NavBar from "@/components/NavBar/NavBarHome";
import Image from "next/image";
import StartMeeting from "@/components/StartMeeting";

export default function Home() {
  return (
    <>
      <NavBar />
      <div className="flex flex-col items-center justify-center h-full pt-14 pb-48">
        <Image
          className="rounded-full"
          height={380}
          width={380}
          src="/img/logo.svg"
          alt="Logo"
          priority
        />
        <h1 className="text-6xl md:text-9xl">
          <span className="font-bold">Dev</span>Meet
        </h1>
        <p className="font-thin text-2xl">Tech Interviews Made Easy</p>
        <StartMeeting />
        <footer className="absolute bottom-0 pb-2 font-thin text-sm text-gray-300">
          For Developers by Developers.
        </footer>
      </div>
    </>
  );
}
