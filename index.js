import { task, flow } from "@renderinc/sdk/workflows"
import { readFileSync } from "fs"
import { randomUUID } from "node:crypto";

const square = task(
  { name: "square" },
  async (_ctx, num, time = 0) => {
    await new Promise(resolve => setTimeout(resolve, time))
    return num * num;
  }
)

task(
  { name: "addSquares", plan: "4c-8g" },
  async (ctx, a, b, time = 0) => {
    const num1 = await ctx.run(square, a, time);
    const num2 = await ctx.run(square, b, time);
    return num1 + num2
  }
)

task(
  { name: "greet", plan: "pro" },
  (_ctx, person) => {
    const message = `${process.env.GREET} ${person}!!!`
    console.log('message: ' + message)
    return message
  }
)

task(
  { name: "passFail" },
  (_ctx, status) => {
    if (status === "fail") {
      throw new Error("FAILED!!!!");
    }
    return "passed"
  }
)

task(
  { name: "bigObject", plan: "flex" },
  async (_ctx, count = 200) => {
    const items = []
    for (let i = 0; i < count; i++) {
      items.push({
        id: i,
        name: `item-${i}`,
        payload: "x".repeat(64),
      })
    }
    console.log("waiting 10 seconds");
    await new Promise(resolve => setTimeout(resolve, 10000));
    console.log("done!")
    return { count, items }
  }
)

task(
  { name: "readFile" },
  (_ctx) => {
    return readFileSync("/etc/secrets/test", "utf8");
  }
)

function sq (num) {
  console.log("squaring " + num);
  return num * num;
}

flow ({ name: "addSquaresFlow" }, async (ctx, a, b) => {
  console.log("starting flow")
  const r1 = await ctx.step("squarea", sq, [a]);
  const r2 = await ctx.step("squareb", sq, [b]);
  const sum = await ctx.step("sum", () => {
    console.log("calculating sum")
    return r1 + r2
  });
  return sum;
});

flow ({ name: "factorial" }, async (ctx, num) => {
  console.log("calculating factorial for " + num);
  let sum = 1;
  let start = num;
  while (start > 0) {
    await ctx.step("calculate", (current) => {
      console.log("next step for " + start);
      sum *= start;
      start--
    })
  }
  return sum;
})

// New in every process, so a replay sees a different value than attempt 0.
const PROCESS_TOKEN = randomUUID();

flow({ name: "longTime", timeoutSeconds: 20 * 60 }, async (ctx) => {
  console.log(`starting long time in process ${PROCESS_TOKEN}`);

  // Non-deterministic on purpose: this step's input changes between attempts.
  const step1 = await ctx.step("step 1", (token) => {
    console.log("step 1 with " + token);
    return 1;
  }, [PROCESS_TOKEN]);

  const step2 = await ctx.step("step 2", async (val) => {
    console.log("starting step 2 with " + val + "; kill the node now");
    await new Promise((resolve) => setTimeout(resolve, 30000));
    console.log("ending step 2");
    return 2;
  }, [1]);

  return step1 + step2;
});
