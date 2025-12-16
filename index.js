import { startTaskServer, task } from "@renderinc/sdk/workflows"

const square = task(
  { name: "square" },
  (num) => {
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

startTaskServer()
  .then(() =>{
    console.log("task server started")
  }).catch(e => {
    console.log("an error happened: ", e);
  })