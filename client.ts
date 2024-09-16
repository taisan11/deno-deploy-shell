import "@std/dotenv/load"

const url = Deno.env.get("URL") || "http://localhost:8000/cli/aaa"

while (true) {
    const commandName = prompt(">");
    if (commandName === "exit") {
        break;
    }
    if (commandName === null) {
        console.log("command not found");
        continue;
    }
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ command: commandName })
    });
    try {
        const json = await response.json();
        // if (String(json.log).startsWith(" ")) json.log = String(json.log).slice(1);
        console.log(json.log);
    } catch (error) {
        console.log("Invalid response from server:", error);
    }
}