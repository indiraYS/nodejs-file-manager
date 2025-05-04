import crypto from 'node:crypto';
import {createReadStream} from "node:fs"

class Hash {
    async get(path) {
        const hash = crypto.createHash('sha256');
        const rs = createReadStream(path)
        rs.on('error', () => console.log("Operation failed"));
        rs.on('data', chunk => hash.update(chunk));
        rs.on('end', () => {
           console.log(hash.digest('hex'))
        });
    }
}

export const hash = new  Hash()