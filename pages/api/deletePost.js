import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0"
import clientPromise from "../../lib/mongodb";
import { ObjectId } from "mongodb";


export default  withApiAuthRequired(async function handler(req,res){
try {
    const session = await getSession(req,res);
    const client = await clientPromise;
    const db = client.db("SmartBlogger");

    const {postId}=req.body

    await db.collection('posts').deleteOne({
        userId:session.user.sub,
       _id:new ObjectId(postId)
    })
    
    res.status(200).json({sucess:true})
} catch (error) {
    console.log('DELETE POST:',error)
}

return

})