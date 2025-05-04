import {sep} from "node:path"

export function getFileName(file, path) {
    const parts = file.split(sep)
    const fileName = parts[parts.length - 1]

    const distParts = path.split(sep)
    let newFile;
    if (distParts[distParts.length-1] === '') {
        distParts[distParts.length-1] = fileName;
        newFile = distParts.join(sep)
    } else {
        newFile = path + sep + fileName;
    }
    return newFile
}