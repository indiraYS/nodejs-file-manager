import process from 'node:process';
import os from 'node:os';
import readline from 'node:readline';
import {walker} from "./src/fs/walker.js";
import {printer} from "./src/fs/printer.js";
import {editor} from "./src/fs/editor.js";
import {info} from "./src/fs/info.js";
import {compress} from "./src/fs/compress.js";
import {hash} from "./src/fs/hash.js";

const usernameArg = await process.argv
    .find(x => x.startsWith("--"))

if (!usernameArg) {
    throw new Error("username argument required")
}
const username = usernameArg.split("=")[1]

process.on('SIGINT', function () {
    console.log(os.EOL + `Thank you for using File Manager, ${username}, goodbye!`);
    process.exit();
});


async function main() {
    const input = process.stdin;
    const rl = readline.createInterface({input});
    const isWindows = walker.isWindows()

    rl.on('line', chunk => {
        input.setEncoding('utf8')
        const parts = chunk.split(" ")
        const command = parts[0]
        switch (command) {
            case "up":
                walker.up(isWindows)
                    .finally(() => {
                        process.stdout.write(`You are currently in ${walker.path()}` + os.EOL)
                    })
                break
            case "cd":
                walker.cd(parts[1], isWindows)
                    .finally(() => {
                        process.stdout.write(`You are currently in ${walker.path()}` + os.EOL)
                    })
                break
            case "ls":
                printer.print(parts.length > 1 ? walker.make(parts[1]) : walker.path())
                break
            case "cat":
                if (parts.length !== 2) {
                    console.log("Invalid input")
                    break
                }
                editor.read(walker.make(parts[1]))
                break
            case "add":
                if (parts.length !== 2) {
                    console.log("Invalid input")
                    break
                }
                editor.add(walker.make(parts[1]))
                break
            case "rm":
                if (parts.length !== 2) {
                    console.log("Invalid input")
                    break
                }
                editor.rm(walker.make(parts[1]))
                break
            case "cp":
                if (parts.length !== 3) {
                    console.log("Invalid input")
                    break
                }
                editor.cp(walker.make(parts[1]), walker.make(parts[2]))
                break
            case "mv":
                if (parts.length !== 3) {
                    console.log("Invalid input")
                    break
                }
                const source = walker.make(parts[1])
                editor.cp(source, walker.make(parts[2])).then((success, err) => {
                    if (success) editor.rm(source)
                })
                break
            case "mkdir":
                if (parts.length !== 2) {
                    console.log("Invalid input")
                    break
                }
                editor.mkdir(walker.make(parts[1]))
                break
            case "rn":
                if (parts.length !== 3) {
                    console.log("Invalid input")
                    break
                }
                editor.rename(walker.make(parts[1]), parts[2])
                break
            case "os":
                if (parts.length !== 2) {
                    console.log("Invalid input")
                    break
                }
                info.get(parts[1].replace("--", ""))
                break
            case "compress":
                if (parts.length !== 3) {
                    console.log("Invalid input")
                    break
                }
                compress.compress(walker.make(parts[1]), walker.make(parts[2]))
                break
            case "decompress":
                if (parts.length !== 3) {
                    console.log("Invalid input")
                    break
                }
                compress.decompress(walker.make(parts[1]), walker.make(parts[2]))
                break
            case "hash":
                if (parts.length !== 2) {
                    console.log("Invalid input")
                    break
                }
                hash.get(walker.make(parts[1]))
                break
            default:
                console.log("Invalid input")
        }
    });
    process.stdout.write(`Welcome to the File Manager, ${username}!` + os.EOL)
    process.stdout.write(`You are currently in ${walker.path()}` + os.EOL)
}

main()
