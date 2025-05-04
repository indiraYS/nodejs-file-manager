import os  from "node:os"
class Info {
    get(arg) {
        switch (arg) {
            case "EOL":
                console.log(os.EOL)
                break
            case "cpus":
                const cpus = os.cpus().map(info => {
                   return {model: info.model, clock_rate: info.speed/1000}
                })
                console.log(`cpu count: ${os.cpus().length}`)
                console.table(cpus)
                break
            case "homedir":
                console.log(os.homedir());
                break
            case "username":
                console.log(os.userInfo().username);
                break
            case "architecture":
                console.log(os.arch());
                break
            default:
                console.log("Operation failed")
        }
    }
}

export const info = new Info()