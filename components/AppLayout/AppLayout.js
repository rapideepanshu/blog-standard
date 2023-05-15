import Link from "next/link";
import Image from "next/image";
import { useUser } from "@auth0/nextjs-auth0/client";
import { Logo } from "../Logo/logo";
export const AppLayout = ({ children ,posts,postId}) => {
  const { user } = useUser();
  console.log("User:", posts);

  return (
    <div className="grid grid-cols-[300px_1fr] h-screen max-h-screen">
      <div className="flex flex-col text-white overflow-hidden">
        <div className="bg-gray-600 px-2">
          <Logo />
          <Link
            href="/post/new"
            className="bg-white text-black tracking-wider w-full text-center cursor-pointer uppercase px-4 py-2 rounded-md hover:bg-gray-300 transition-colors block"
          >
            New Post
          </Link>
        </div>
        <div className="px-4 flex-1 overflow-auto bg-gradient-to-b from-gray-600 to-black  ">
        {posts.map(post=>{
        
        
          return <Link key={post._id} href={`/post/${post._id}`} className={` py-1 border border-white/0 block text-ellipsis overflow-hidden whitespace-nowrap my-1 px-2 bg-white/10 cursor-pointer rounded-sm ${postId === post._id ? "bg-white/20 border-white":""}`}>{post.topic}</Link>
        })}
        </div>
        <div className="bg-black flex items-center gap-2 border-t border-white/50 h-20 px-2">
          {!!user ? (
            <>
              <div className="min-w-[50px]">
                <Image
                  src={user.picture}
                  alt={user.name}
                  height={50}
                  width={50}
                  className="rounded-full"
                />
              </div>
              <div className="flex-1">
                <div className="font-bold text-sm">{user.email}</div>
                <Link className="text-sm" href="/api/auth/logout">
                  Logout
                </Link>
              </div>
            </>
          ) : (
            <Link href="/api/auth/login">Login</Link>
          )}
        </div>
      </div>
      {children}
    </div>
  );
};
