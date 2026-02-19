

import { z } from "zod";

export const SignupSchema = z.object({
    username: z.string().min(3).max(50),
    password: z.string().min(7).max(15),
})

export const SigninSchema = z.object({
    username: z.string().min(3).max(50),
    password: z.string().min(7).max(15),
})


export const CreateWorkflowSchema = z.object({

    nodes: z.array(z.object({
        nodeId: z.string(),
        type: z.string(),
        id: z.string(),
        position: z.object({
            x: z.number(),
            y: z.number(),
        }),
        credentials: z.array(
            z.object({
                API_KEY: z.string() ,
                ACCOUNT_INDEX: z.number(),
                API_KEY_INDEX: z.number(),
            })
        ).optional(),
        data: z.object({
            kind: z.enum(["ACTION", "TRIGGER"]),
            metadata: z.record(z.string(), z.any()).optional(),

        }),
    })),
    edges: z.array(z.object({
        id: z.string(),
        source: z.string(),
        target: z.string(),
    })),
})

export const UpdateWorkflowSchema = z.object({
    nodes: z.array(z.object({
        nodeId: z.string(),
        data: z.object({
            kind: z.enum(["ACTION", "TRIGGER"]),
            metadata: z.any(),
        }),
        credential: z.array(
            z.object({
                API_KEY: z.string() ,
                ACCOUNT_INDEX: z.number(),
                API_KEY_INDEX: z.number(),
            })
        ).optional(),
        id: z.string(),
        position: z.object({
            x: z.number(),
            y: z.number(),
        }),

    })),
    edges: z.array(z.object({
        id: z.string(),
        source: z.string(),
        target: z.string(),
    })),
})