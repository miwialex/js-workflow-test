import { Render } from "@renderinc/sdk";
import { createWorkflowsClient } from "@renderinc/sdk/workflows"

async function run () {
  const render = new Render({
    useLocalDev: true,
    token: "foo",
  })
  const client = createWorkflowsClient({
    useLocalDev: true,
    token: "foo",
  })

  const result = await render.workflows.runTask("workflows/addSquares", [2,4]);

  console.log({ result });

  const result2 = await client.runTask("workflows/addSquares", [4,8]);

  console.log({result2})
}

run();