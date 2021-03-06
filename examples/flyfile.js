import { stat, readdir } from "mz/fs"
import { exec } from "mz/child_process"
import { join } from "path"

export default function* () {
  for (let sample of yield readdir(this.root)) {
    if (!(yield stat(sample)).isDirectory()) {
      this.log(`Skipping ${sample}`)
      continue
    }
    try {
      yield stat(join(sample, "node_modules"))
    } catch (_) {
      process.chdir(sample)
      this.log(`Installing → ${process.cwd()}`)
      yield exec("npm i")
      process.chdir(this.root)
    }
  }
}
