import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
import { AppLayout } from "../../components/AppLayout";
import clientPromise from "../../lib/mongodb";
import { ObjectId } from "mongodb";
import { faHashtag } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getAppProps } from "../../utils/getAppProps";
import Image from "next/image";
import { useState } from "react";

export default function Post(props) {
  const [showDeleteConfirm, setShowDeleteCofirm] = useState(false);

  return (
    <div className="overflow-auto h-full">
      <div className="max-w-screen-sm mx-auto">
        <div className="text-sm font-bold mt-6 p-2 bg-stone-200 rounded-sm">
          SEO title and meta description
        </div>
        <div className="p-4 my-2 border border-stone-200 rounded-md">
          <div className="text-blue-600 text-2xl font-bold">{props.title}</div>
          <div className="mt-2">{props.metaDescription}</div>
        </div>
        <div className="text-sm font-bold mt-6 p-2 bg-stone-200 rounded-sm">
          Keywords
        </div>
        <div className="flex flex-wrap pt-2 gap-1">
          {props.keywords.split(",").map((keyword, i) => (
            <div key={i} className="p-2 rounded-full bg-slate-800 text-white">
              <FontAwesomeIcon icon={faHashtag} /> {keyword}
            </div>
          ))}
        </div>
        <div className="text-sm font-bold mt-6 p-2 bg-stone-200 rounded-sm">
          Blog post
        </div>
        <div className="my-1">
          <Image src={props.image} alt="image" height={200} width={640} />
        </div>
        <div
          dangerouslySetInnerHTML={{ __html: props.postContent || "" }}
        ></div>
        <div className="my-4">
          {!showDeleteConfirm && (
        <button onClick={()=>setShowDeleteCofirm(true)} className="bg-red-600 text-white tracking-wider w-full text-center cursor-pointer uppercase px-4 py-2 rounded-md hover:bg-red-700 transition-colors block">
        Delete Post
      </button>
          )}
        
        </div>
      </div>
    </div>
  );
}

Post.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const session = await getSession(ctx.req, ctx.res);
    const props = await getAppProps(ctx);
    // console.log('PROPSSSS:',props)
    const client = await clientPromise;
    const db = client.db("SmartBlogger");
    const post = await db.collection("posts").findOne({
      _id: new ObjectId(ctx.params.postId),
      userId: session.user.sub,
    });

    if (!post) {
      return {
        redirect: {
          destination: "/post/new",
          permanent: false,
        },
      };
    }

    return {
      props: {
        postContent: post.postContent,
        title: post.title,
        metaDescription: post.metaDescription,
        keywords: post.keywords,
        image: post.image ? post.image : "",
        ...props,
      },
    };
  },
});
