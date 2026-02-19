import dns from 'node:dns/promises';

// Forces Node to use public DNS servers that support SRV records
dns.setServers(['1.1.1.1', '8.8.8.8']);
import express from "express";
import { ExecutionModel, NodesModel, UserModel, WorkflowModel } from "db/client";
import  mongoose  from "mongoose"
import { SignupSchema, SigninSchema, CreateWorkflowSchema, UpdateWorkflowSchema } from "common/types";
import bcrypt  from "bcrypt";
import  jwt  from 'jsonwebtoken';
import { authMiddleware } from './middleware';
import { id } from 'zod/locales';
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());



mongoose.set('bufferCommands', false); // This makes the error happen instantly instead of waiting 10s

async function startServer() {
    try {
        await mongoose.connect(process.env.MONGO_URL!);
        console.log("✅ MongoDB Connected Successfully");

        app.listen(process.env.PORT || 3000, () => {
            console.log("server started");
        });
    } catch (e) {
        console.error("❌ Failed to connect to DB", e);
    }
}

startServer();

app.post("/signup", async (req, res) => {
    const {success, data } = SignupSchema.safeParse(req.body);

    if(!success){
        res.status(403).json({message: "wrong username or password"});
        return;
    }

   

    try{
        const hashedPassword = await bcrypt.hash(data.password, parseInt(process.env.SALT_ROUNDS!));
        const user = await UserModel.create({
            username: data.username,
            password: hashedPassword,
        })
        res.status(200).json({
            id: user._id
        })
        
    }catch(e: any){
        if(e.code === 11000){
            return res.status(409).json({
                message: "username already exists",
            })
        }
        res.status(500).json({
            message: "Internal Error",
        })
    }
    
})

app.post("/signin", async (req, res) => {

    const result  = SigninSchema.safeParse(req.body);
    if(!result.success){
        return  res.status(403).json({
            message: "Invalid Info",
        })
    }

    const data = result.data;

    try{
        const user =  await UserModel.findOne({
            username: data?.username,  
        });


        if(!user){
            return res.status(401).json({
                message: "user not found",
            })
        }

        const isMatch =  await bcrypt.compare(data.password, user.password);

        if(!isMatch){
            res.status(401).json({
                message: "incorrect username or password"
            })
            return;
        }

        const token = jwt.sign(
            {id: user._id},
            process.env.JWT_SECRET_KEY!,
            {expiresIn: "24h"}

        
        )

        res.status(200).json({
            id: user._id,
            token: token,
        })

        
    }catch(e){
        console.log(e);
        res.status(500).json({
            message: "internal server error",
        })
    }

});


app.post("/workflow", authMiddleware, async (req, res) => {
    const userId = req.userId!;
    console.log(userId);

    const {success, data} = CreateWorkflowSchema.safeParse(req.body);
    if(!success){
        console.log("wrong data");
        res.status(403).json({
            message: "incorrect data",
        })
        return;
    }
    const { nodes, edges} = data;
    
   
    const resolvedNode = await  Promise.all(nodes.map(async (node) => {
            const nodeTemplate = await NodesModel.findOne({kind: node.data.kind})

            if(!nodeTemplate){
                throw new Error(`Invalid node type found: ${node.data.kind}. Please seed your database.`)
            }

            return {
                ...node,
                nodeId: nodeTemplate._id, 
                data: {
                    kind: node.data.kind, // "ACTION" or "TRIGGER"
                    metadata: node.data.metadata,
                }
            };
    }))
    try{
        const workflow = await WorkflowModel.create({
            userId,
            nodes: resolvedNode,
            edges: data.edges,
        });

        res.status(200).json({
            id:  workflow._id,
        })

    }catch(e){
        res.status(411).json({
            message: "Failed to create workflow",
        })
    }
})

app.put("/workflow/:workflowId", authMiddleware,  async (req, res) => {
    const {success, data} = UpdateWorkflowSchema.safeParse(req.body);
    if(!success){
        res.status(403).json({
            message: "incorrect data",
        })
        return;
    }

    try{
        const workflow = await WorkflowModel.findOneAndUpdate({_id: req.params.workflowId}, data, {new: true} );
        if(!workflow){
            res.status(411).json({
                message: "Incorrect details",
            })
            return;
        }
        res.status(200).json({
        id: workflow._id,
        })

    }catch(e){
        res.status(411).json({
            message: "Failed to create workflow",
        })
    }
})

app.get("/workflow/:workflowId", authMiddleware, async (req, res) => {

    try{
        const workflow = await WorkflowModel.findById(req.params.workflowId);
        if(!workflow || workflow.userId.toString() !== req.userId){
            res.status(404).json({
                message: "Workflow not found"
            })
            return;
        }
        res.json(workflow);
    }catch(e){
        res.status(500).json({
                message: "Internal Error/ DataBase Error"
            })
    }
    

});

app.get("/workflows", authMiddleware, async(req, res) => {
    console.log("reached and logged in", req.userId);
    const workflows = await WorkflowModel.find({ userId: req.userId });
    res.json(workflows);
})  

app.get("/workflow/executions/:workflowId", authMiddleware, async (req, res) => {
    const executions = await ExecutionModel.find({ 
        workflowId: req.params.workflowId 
    });
    res.json(executions);
});

app.get("/nodes", async (req, res) => {
    try{
        const nodes = await NodesModel.find({});
        res.json(nodes);
    }catch(e) {
        console.log(e);
        res.json({
            message: "Internal server error",
        })
    }
    

})

   