import { task, flow } from "@renderinc/sdk/workflows"
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
  return num * num;
}

flow ({ name: "addSquaresFlow" }, async (ctx, a, b) => {
  const r1 = await ctx.step("squarea", sq, [a]);
  const r2 = await ctx.step("squareb", sq, b);
  const sum = await ctx.step("sum", () => r1 + r2);
  return sum;
})