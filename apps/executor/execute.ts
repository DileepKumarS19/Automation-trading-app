import { executor as lighterExector } from "./executors/lighter/lighter";
type NodeDocumant = {
    id: string;
    credentials?: [{
        API_KEY: string;
        ACCOUNT_INDEX: number;
        API_KEY_INDEX: number;
    }];
    type?: string | null | undefined;
    position?: {
        x: number;
        y: number;
    } | null | undefined;
    data?: {
        metadata?: any;
        kind?: "ACTION" | "TRIGGER" | null | undefined;
    }
    nodeId?: string;
}

type EdgeDocument = {
    source: string;
    target: string;
}


export async function execute(nodes: NodeDocumant[], edges: EdgeDocument[]) {
    const trigger = nodes.find(x => x.data?.kind === "TRIGGER");
    if (!trigger) {
        return;
    }
    await executeRecurssive(trigger.id, nodes, edges);

}
export async function executeRecurssive(sourceId: string, nodes: NodeDocumant[], edges: EdgeDocument[]) {
    const nodesToExecute = edges.filter(({ source, target }) => source === sourceId).map(({ target }) => target);

    await Promise.all(nodesToExecute.map(async (nodeClientId) => {
        const node = nodes.find(({ id }) => id === nodeClientId);

        if (!node) {
            return;
        }

        switch (node.type) {
            case "lighter":
                const cred = node.credentials?.[0];
                if (!cred) {
                    console.log(`node, ${node}`);
                    console.error(`No credentials found for node ${node.id}`);
                    break;
                }
                await lighterExector(node.data?.metadata.asset, node.data?.metadata.qty, node.data?.metadata.type, cred.API_KEY, cred.ACCOUNT_INDEX, cred.API_KEY_INDEX);
        }
    }))

    await Promise.all(nodesToExecute.map(id => executeRecurssive(id, nodes, edges)));
}