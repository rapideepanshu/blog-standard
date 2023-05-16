import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { AppLayout } from "../../components/AppLayout";
import { useState } from "react";
import { useRouter } from "next/router";
import {getAppProps} from "../../utils/getAppProps";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBrain } from "@fortawesome/free-solid-svg-icons";

export default function NewPost(props) {
  const router = useRouter();
  const [topic, setTopic] = useState("");
  const [keywords, setKeywords] = useState("");
  const [generating, setGenerating]= useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      setGenerating(true)
    const response = await fetch("/api/generatePost", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ topic, keywords }),
    });

    const json = await response.json();
  
    if (json?.postId) {
      router.push(`/post/${json.postId}`);
    }}
    catch(e){
      setGenerating(false)
    }
  };

  return (
    <div className="h-full overflow-hidden ">
      {!!generating &&(
      <div className="text-black flex h-full animate-pulse w-full flex-col justify-center items-center">
        <FontAwesomeIcon icon={faBrain} className="text-8xl" />
        <h6>Loading ...</h6>
      </div>
      )}
      {!generating &&(

    
      <div className="w-full h-full flex flex-col">
      <form onSubmit={handleSubmit} className="m-auto w-full max-w-screen-sm bg-slate-200 rounded-md p-4 shadow-xl border border-slate-200 shadow-slate-200">
        <div>
          <label>
            <strong>Generate a blog post on the topic:</strong>
          </label>
          <textarea
            className="resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            maxLength={80}
          />
        </div>
        <div>
          <label>
            <strong>Targeting the following keywords:</strong>
          </label>
          <textarea
            className="resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            maxLength={80}
          />
          <small className="block mb-2">Separate keywords with a comma</small>
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white tracking-wider w-full text-center cursor-pointer uppercase px-4 py-2 rounded-md hover:bg-green-700 transition-colors block disabled:bg-green-200 disabled:cursor-not-allowed"
      disabled={!topic.trim() || !keywords.trim()}  >
          Generate
        </button>
      </form>
      </div>
        )}
    </div>
  );
}

NewPost.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};

export const getServerSideProps = withPageAuthRequired( {
async getServerSideProps(ctx){
const props= await getAppProps(ctx)
return{
  props
}
}
});
