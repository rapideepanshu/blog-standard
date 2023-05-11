import Image from "next/image";
import Link from "next/link";
import BlogImage from "../public/blog.jpg";
import { Logo } from "../components/Logo";
export default function Home() {
  return (
    <div className="w-screen h-screen overflow-hidden flex justify-center items-center relative">
      <Image src={BlogImage} alt="blog" fill className="absolute" />
      <div className="relative z-10 text-white px-10 py-5 tx-center max-w-screen-sm bg-slate-900/90 rounded-md backdrop-blur-sm">
        <Logo />
        <p>
          The AI powered SAAS solution to generate SEO optimized blogs in
          minutes.
        </p>
        <Link
          href="/post/new"
          className="bg-white text-black tracking-wider w-full text-center cursor-pointer uppercase px-4 py-2 rounded-md hover:bg-gray-300 transition-colors block"
        >
          Begin
        </Link>
      </div>
    </div>
  );
}
