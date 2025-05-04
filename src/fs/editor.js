import {readFile, copyFile, open, rm, rename, access, mkdir} from "node:fs/promises"
import {pipeline} from 'node:stream/promises';
import {stdout} from 'node:process';
import {constants, createReadStream, createWriteStream} from "node:fs"
import {EOL} from 'node:os';
import {sep} from 'node:path';
import {getFileName} from "../util.js";

class Editor {
    async read(path) {
        try {
            const data = (await readFile(path, 'utf8'))
            stdout.write(data + EOL)
        } catch (e) {
            console.log('Operation failed')
        }
    }

    async add(path) {
        let file;
        try {
            file = await open(path, 'a');
            if (file == null) {
                console.log('Operation failed')
            }
        } catch (e) {
            console.log('Operation failed')
        } finally {
            if (file != null) await file.close();
        }
    }

    async rm(path) {
        let file;
        try {
            file = await open(path);
            const stat = await file.stat();
            if (!stat.isFile()) {
                console.log('Operation failed')
            } else {
                await rm(path);
            }
        } finally {
            if (file != null) await file.close();
        }
    }

    async mkdir(path) {
        try {
            await access(path, constants.R_OK);
            console.log('Operation failed',)
        } catch (e) {
            await mkdir(path);
        }
    }

    async rename(from, to) {
        let file;
        try {
            file = await open(from);
            const stat = await file.stat();
            if (!stat.isFile()) {
                console.log('Operation failed')
            } else {
                const parts = from.split(sep)
                parts[parts.length - 1] = to
                const file = parts.join(sep)
                await rename(from, file);
            }
        } catch (e) {
            console.log('Operation failed')
        } finally {
            if (file != null) await file.close();
        }
    }

    async cp(from, to) {
        let file, dest;
        let isSuccess = true;
        try {
            file = await open(from);
            const stat = await file.stat();
            if (!stat.isFile()) {
                console.log('Operation failed')
                isSuccess = false;
            } else {
                dest = await open(to);
                const destStat = await dest.stat();

                if (!destStat.isDirectory()) {
                    console.log('Operation failed')
                    isSuccess = false;
                } else {
                    const newFile = getFileName(from, to)
                    await pipeline(
                        createReadStream(from),
                        createWriteStream(newFile, {flags: 'w'})
                    )
                }
            }
        } catch (e) {
            console.log('Operation failed')
            isSuccess = false;
        } finally {
            if (file != null) await file.close();
            if (dest != null) await dest.close();
        }
        return isSuccess
    }
}

export const editor = new Editor()