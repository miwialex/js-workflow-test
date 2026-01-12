import { Render } from "@renderinc/sdk";
import { createWorkflowsClient } from "@renderinc/sdk/workflows"

async function run () {
  const render = new Render()
  const client = createWorkflowsClient();
  
  const result = await render.workflows.runTask("js-workflow-test/addSquares", [2,4]);

  console.log({ result });

  const result2 = await client.runTask("js-workflow-test/addSquares", [4,8]);

  console.log({result2})
}

run();