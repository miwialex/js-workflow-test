import { task } from "@renderinc/sdk/workflows"
import { readFileSync } from "fs"

const square = task(
  { name: "square" },
  async (num) => {
    await new Promise(resolve => setTimeout(resolve, 30000))
    return num * num;
  }
)

task(
  { name: "addSquares" },
  async (a, b) => {
    const num1 = await square(a);
    const num2 = await square(b);
    return num1 + num2
  }
)

task(
  { name: "greet" },
  (person) => {
    const message = `${process.env.GREET} ${person}!`
    console.log(message)
    return message
  }
)

task(
  { name: "passFail" },
  (status) => {
    if (status === "fail") {
      throw new Error("FAILED!!!!");
    }
    return "passed"
  }
)

task(
  { name: "readFile" },
  () => {
    return readFileSync("/etc/secrets/test", "utf8");
  }
)