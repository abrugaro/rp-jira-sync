import * as util from "util";

export class Logger {
    private log: string;

    constructor() {
        this.log = "";
    }

    public info(message: any) {
        this.log = this.log.concat(`\n[INFO] ${util.format(message)}`);
    }

    public debug(message: any) {
        this.log = this.log.concat(`\n[DEBUG] ${util.format(message)}`);
    }

    public error(message: any) {
        this.log = this.log.concat(`\n[ERROR] ${util.format(message)}`);
    }

    public getLogs(): string {
        return this.log;
    }
}