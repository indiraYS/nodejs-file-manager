import os from "node:os"
import { constants, promises }  from "node:fs"
import {sep, isAbsolute, resolve} from "node:path"

class Walker {
    #current;
    constructor() {
        this.#current = os.homedir();
    }

    path()  { return this.#current }

    isWindows() {
        return os.type() === 'Windows_NT'
    }

    // param isWin for test
    up(isWin) {
        const {changed, url} = this.relative(this.#current, ".." + sep, isWin)
        if (changed) {
            this.#current = url
        }
        return changed
    }

    make(url) {
        let path;
        if (!isAbsolute(url)) {
            path = resolve(this.#current, url)
        } else {
            path = url
        }
        return path;
    }

    async cd(path, isWin) {
        let done = true


        if (!isAbsolute(path)) {
            let {changed, url} = this.relative(this.#current, path, isWin)
            if (changed) {
                path = url;
            }
        }

        try {
            await promises.access(path, constants.R_OK | constants.W_OK)
            this.#current = path
        } catch (e) {
            console.log("err", e)
            done = false
        }
        return done
    }

    // param isWin for test
    relative(url, to, isWin)  {
        let changed = false;
        let moves = to.split(sep);
        if (moves[moves.length-1] === '') moves = moves.slice(0, moves.length-1) // replace last empty

        for (let part in moves) {
            if (moves[part] === '..') {
                const parts = url.split(sep)
                if (isWin) {
                    // 'c:', '', '' => c://
                    if (parts.length > 2 && parts[parts.length-1] !== '') {
                        changed = true
                        url = parts.slice(0, parts.length - 1).join(sep)
                        if (parts.length === 3) url = url + sep // to make c://dir to c://
                    } else {
                        changed = false
                        break
                    }
                } else {
                    if (parts.length > 1 && parts[parts.length-1] !== '') {
                        changed = true
                        url = parts.slice(0, parts.length - 1).join(sep)
                        if (url === '') url += sep
                    } else {
                        changed = false
                        break
                    }
                }
            } else {
                url += sep + moves[part]
                changed = true
            }
        }

        return {changed, url}
    }
}

export const walker = new Walker()