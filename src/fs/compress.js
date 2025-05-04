import zlib from 'node:zlib';
import {createReadStream, createWriteStream} from "node:fs"
import {pipeline} from 'node:stream/promises';
import {getFileName} from "../util.js";


class Compress {

    async compress(file, path) {
        try {
            await pipeline(
                createReadStream(file),
                zlib.createBrotliCompress(),
                createWriteStream(getFileName(file, path) + ".zip"),
            )
        } catch (e) {
            console.log("Operation failed")
        }
    }

    async decompress(file, path) {
        try {
            await pipeline(
                createReadStream(file),
                zlib.createBrotliDecompress(),
                createWriteStream(getFileName(file, path).replace(".zip", "")),
            )
        } catch (e) {
            console.log("Operation failed")
        }
    }
}

export const compress = new Compress()