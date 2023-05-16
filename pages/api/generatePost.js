import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { Configuration, OpenAIApi } from "openai";
import clientPromise from "../../lib/mongodb";

export default withApiAuthRequired(async function handler(req, res) {
  const { user } = await getSession(req, res);
  const client = await clientPromise;
  const db = client.db("SmartBlogger");

  const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const openai = new OpenAIApi(config);
  const { topic, keywords } = req.body;

  if(!topic || ! keywords){
    res.status(422);
    return
  }

  if(topic.length > 80 || keywords.length > 80){
    res.status(422);
    return
  }

  //   const topic = "Add a comparison of the best jazz music of 70's and 80's";
  //   const keywords = "jazz music , best jazz musician";

  const postContentResult = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are a blog post generator.",
      },
      {
        role: "user",
        content: `Write a long and detailed SEO-friendly blog post about ${topic}, that targets the following comma-separated keywords: ${keywords}. 
      The response should be formatted in SEO-friendly HTML, 
      limited to the following HTML tags: p, h1, h2, h3, h4, h5, h6, strong, i, ul, li, ol.`,
      },
    ],
    temperature: 0,
  });

  const postContent = postContentResult.data.choices[0]?.message.content;

  const titleResponse = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are a blog post generator.",
      },
      {
        role: "user",
        content: `Write a long and detailed SEO-friendly blog post about ${topic}, that targets the following comma-separated keywords: ${keywords}. 
      The response should be formatted in SEO-friendly HTML, 
      limited  to the following HTML tags: p, h1, h2, h3, h4, h5, h6, strong, i, ul, li, ol.Do not use title HTML tag`,
      },
      {
        role: "assistant",
        content: postContent,
      },
      {
        role: "user",
        content: "Generate appropriate title tag text for the above blog post",
      },
    ],
    temperature: 0,
  });

  const metaDescriptionResponse = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are a blog post generator.",
      },
      {
        role: "user",
        content: `Write a long and detailed SEO-friendly blog post about ${topic}, that targets the following comma-separated keywords: ${keywords}. 
      The response should be formatted in SEO-friendly HTML, 
      limited to the following HTML tags: p, h1, h2, h3, h4, h5, h6, strong, i, ul, li, ol.`,
      },
      {
        role: "assistant",
        content: postContent,
      },
      {
        role: "user",
        content:
          "Generate SEO-friendly meta description content for the above blog post",
      },
    ],
    temperature: 0,
  });

  const imagePromptResponse = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are a blog post generator.",
      },
      {
        role: "user",
        content: `Write a long and detailed SEO-friendly blog post about ${topic}, that targets the following comma-separated keywords: ${keywords}. 
      The response should be formatted in SEO-friendly HTML, 
      limited to the following HTML tags: p, h1, h2, h3, h4, h5, h6, strong, i, ul, li, ol,.`,
      },
      {
        role: "assistant",
        content: postContent,
      },
      {
        role: "user",
        content:
          "Generate a professional image generation text prompt for the above blog post",
      },
    ],
    temperature: 0,
  });

  const title = titleResponse.data.choices[0]?.message?.content || "";
  const metaDescription =
    metaDescriptionResponse.data.choices[0]?.message?.content || "";

  const imagePrompt =
    imagePromptResponse.data.choices[0]?.message?.content || "";

  // console.log("POST CONTENT", postContent);
  // console.log("TITLE", title);
  // console.log("POST CONTENT", metaDescription);

  // console.log('IMAGE PROMPT:',imagePrompt )


  




const response = await openai.createImage({
  prompt:`${imagePrompt}`,
  n: 1,
  size: "1024x1024",
});
console.log('RESPONSE:',response.data.data[0].url)

  const post = await db.collection("posts").insertOne({
    postContent,
    title,
    metaDescription,
    topic,
    keywords,
    userId: user.sub,
    created: new Date(),
    image:response?.data.data[0].url || ""
    

  });

  res.status(200).json({
    postId: post.insertedId,
  });
});
