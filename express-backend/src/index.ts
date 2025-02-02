import express from 'express';
import { createClient } from 'redis';

const app=express();
app.use(express.json());
const client= createClient();

client.on('error',(err)=>console.log('Redis client error',err)
);

app.post('/submit',async(req,res)=>{
    const problemid=req.body.problemid;
    const code=req.body.code;
    const language=req.body.language;
    try {
        await client.lPush("problems",JSON.stringify({code,language,problemid}));
        res.status(200).send("Submission recieved and stored");
    } catch (error) {
        console.log("Redis error",error);
        res.status(500).send("Failed to store submission")
        
    }
})

async function startServer(){
    try {
        await client.connect();
        console.log("Connected to Redis");

        app.listen(3000, () => {
            console.log("Server is running on port 3000");
        });
    } catch (error) {
        console.error("Failed to connect to Redis", error);
    }
}

startServer();