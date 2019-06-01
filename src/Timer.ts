import {EventEmitter} from "events";
export default class Timer extends EventEmitter {
    private interval: number;
    private timeoutTimer: NodeJS.Timer|null;
    private isProcessing: boolean;
    private waitingStopResolves: (() => void)[];
    constructor(interval: number) {
        super();
        this.interval = interval
        this.timeoutTimer = null;
        this.isProcessing = false;
        this.waitingStopResolves = [];
    }
    start(task: () => Promise<void>): void {
        this.timeoutTimer = setTimeout(async () => {
            try {
                this.isProcessing = true;
                await task();
            } catch (e) {
                this.emit("error", e);
            }
            this.isProcessing = false;
            if (!this.timeoutTimer) {
                this.waitingStopResolves.forEach(r => r());
                return;
            }
            this.start(task);
        }, this.interval)
    }
    stop(): Promise<void> {
        return new Promise<void>(resolve => {
            if (!this.timeoutTimer) {
                if (this.isProcessing) {
                    this.waitingStopResolves.push(resolve);
                }
                return;
            }
            clearTimeout(this.timeoutTimer);
            this.timeoutTimer = null;
            if (this.isProcessing) {
                this.waitingStopResolves.push(resolve);
            } else {
                resolve();
            }
        });
    }
}
