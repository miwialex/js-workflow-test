import { task } from "@renderinc/sdk/workflows"
import { readFileSync } from "fs"

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
    return { count, items }
  }
)

task(
  { name: "readFile" },
  (_ctx) => {
    return readFileSync("/etc/secrets/test", "utf8");
  }
)