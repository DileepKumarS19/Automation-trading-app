
import mongoose, {Schema} from "mongoose";
import { number, string } from "zod";
import { required } from "zod/mini";


const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    }
});


const EdgesSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    source: {
        type: String,
        required: true
    },
    target: {
        type: String,
        required: true,
    }
}, {
    _id: false,
});


const PositionSchema = new Schema({
    x: {
        type: Number,
        required: true
    },
    y:{
         type: Number,
         required: true
    },
    Credentials: {
        type: Schema.Types.Mixed,
    }

});


const NodeDataSchema = new Schema({
     
        kind: {
            type: String,
            enum: ["ACTION", "TRIGGER"],
            required: true
        },
        
        metadata: {
            type: Schema.Types.Mixed
        },
}, {

})
const WorkflowNodesSchema = new Schema({
    id: {
        type: String,
        required: true,
    },
    type: String,
    position: PositionSchema,
    credentials: [{
        API_KEY: string,
        ACCOUNT_INDEX: number,
        API_KEY_INDEX: number
    }],
    nodeId: {
        type: mongoose.Types.ObjectId,
        ref: "Nodes"
    },
    data: NodeDataSchema
}, {
    _id: false,
}) 

const workflowSchema = new Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "Users",
    },
    
    nodes: [WorkflowNodesSchema],
    edges: [EdgesSchema],
});

const CredentialsTypeSchema = new Schema({
    title: { type: String, required: true },
    required: { type: Boolean, required: true },
    values: {
        type: [String, Number]
    }
    // Removed 'value' because templates usually don't have them
}, { _id: false });

const MetadataSchema = new Schema({
    kind: { type: String, enum: ["SELECT", "TEXT", "NUMBER"], required: true },
    title: { type: String, required: true },
    description: { type: String, required: false },
    placeholder: { type: String, required: false },
    values: {
        type: [String],
        // The validator ensures SELECT fields aren't empty
        validate: {
            validator: function(v: any) {
                return this.kind !== "SELECT" || (v && v.length > 0);
            },
            message: 'SELECT fields must have at least one value'
        }
    }
}, { _id: false });

const NodesSchema = new Schema({
    
    title: {
        type: String,
        required: true, // "Lighter Exchange", "Backpack", etc.
    },
    description: {
        type: String,
        required: true,
    },
    kind: {
        type: String,
        enum: ["ACTION", "TRIGGER"],
        required: true,
    },
    type: {
        type: String,
        enum: ["lighter", "backpack", "hyperliquid"]
    },
    credentialsType: [CredentialsTypeSchema],
    metadataSchema: [MetadataSchema], 
});

const ExecutionSchema = new Schema({
    workflowId:{
        type: mongoose.Types.ObjectId,
        ref: 'workflows'
    },
    status:{
        type: String,
        enum: ["PENDING", "SUCCESS", "FAILURE"],
    },
    startTime:{
        type: Date,
        default: Date.now(),
        required: true
    },
    endTime: {
        type: Date,
    }
})

export const UserModel = mongoose.model("Users", UserSchema);
export const WorkflowModel = mongoose.model("Workflows", workflowSchema);
export const NodesModel = mongoose.model("Nodes", NodesSchema);
export const ExecutionModel = mongoose.model("Executions", ExecutionSchema);