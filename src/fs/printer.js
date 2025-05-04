import {readdir} from "node:fs/promises"

class Printer {
    async print(path) {
        try {
            const files = await readdir(path, {withFileTypes: true})
            const fileMap = files.map(d => {
                var cur = {name: d.name}
                if (d.isBlockDevice()) {
                    cur['type'] = 'block_device'
                } else if (d.isCharacterDevice()) {
                    cur['type'] = 'character_device'
                } else if (d.isDirectory()) {
                    cur['type'] = 'directory'
                } else if (d.isFile()) {
                    cur['type'] = 'file'
                } else if (d.isSocket()) {
                    cur['type'] = 'socket'
                } else if (d.isSymbolicLink()) {
                    cur['type'] = 'symbolic_link'
                }
                return cur
            })
            console.table(fileMap);
        } catch (e) {
            console.log('Operation failed')
        }
    }
}

export const printer = new Printer()