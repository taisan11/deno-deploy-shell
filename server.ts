import {Context, Hono} from "hono"
import $ from "@david/dax";
import {CommandResult} from "@david/dax";
import { join } from "@std/path/join";

const app = new Hono()

let pwd = Deno.cwd()

app.get('/', (c:Context) => c.text('Hello Deno!'))

app.post('/cli/aaa',async (c:Context)=>{
  const body = await c.req.json()
  const command = String(body.command)
  if (!command) return c.json({log:"command not found"})
  let aaaa:CommandResult = {} as CommandResult;
  if (command.startsWith("cd")) {
    const path = command.split(" ")[1]
    if (path === "..") {
      pwd = join(pwd, "..")
    } else {
      pwd = join(pwd, path)
    }
    aaaa = await $.raw`cd ${pwd}`.stdout("piped")
  } else if(command.startsWith("ls")) {
    const lstemp = []
    for await (const entry of Deno.readDir(pwd)) {
      lstemp.push(entry.name+"\n")
    }
    aaaa = await $.raw`echo "${lstemp}"`.stdout("piped")
  }else {
    aaaa = await $.raw`${command}`.cwd(pwd).env(Deno.env.toObject()).stdout("piped")
  }
  return c.json({log:aaaa.stdout})
})

Deno.serve(app.fetch)