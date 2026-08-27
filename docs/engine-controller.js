(function () {
  'use strict';

  window.StockfishController = class StockfishController {
    constructor(onState) {
      this.onState = onState;
      this.ready = false; this.failed = false; this.active = null; this.queue = []; this.generation = 0;
      this.start();
    }
    state(message, status = '') { this.onState?.(message, status); }
    start() {
      const generation = ++this.generation;
      clearTimeout(this.startupTimer);
      this.startupTimer = setTimeout(() => {
        if (generation === this.generation && !this.ready) this.fail('Stockfish failed to load');
      }, 30000);
      try {
        this.worker = new Worker('stockfish-18-lite-single.js#stockfish-18-lite-single.wasm');
        this.worker.onmessage = event => {
          if (generation !== this.generation) return;
          String(event.data).split(/\r?\n/).forEach(line => this.handle(line.trim()));
        };
        this.worker.onerror = () => {
          if (generation === this.generation) this.fail('Engine unavailable — serve this folder over HTTP');
        };
        this.worker.postMessage('uci');
      } catch { this.fail('Engine unavailable — serve this folder over HTTP'); }
    }
    fail(message) {
      clearTimeout(this.startupTimer);
      this.failed = true; this.state(message);
      this.rejectPending(message);
    }
    rejectPending(message) {
      this.queue.splice(0).forEach(job => job.reject(new Error(message)));
      if (this.active) {
        clearTimeout(this.active.timer);
        this.active.reject(new Error(message)); this.active = null;
      }
    }
    restart(message = 'Stockfish restarted') {
      clearTimeout(this.startupTimer);
      this.generation++;
      this.worker?.terminate();
      this.rejectPending(message);
      this.ready = false; this.failed = false;
      this.state('Loading Stockfish…');
      this.start();
    }
    cancel() { if (this.active || this.queue.length) this.restart('Stockfish stopped'); }
    handle(line) {
      if (line === 'uciok') {
        clearTimeout(this.startupTimer);
        this.ready = true; this.state('Stockfish 18 ready', 'ready'); this.pump(); return;
      }
      if (!this.active) return;
      if (line.startsWith('info ') && line.includes(' score ') && line.includes(' pv ')) {
        const scoreMatch = line.match(/score (cp|mate) (-?\d+)/);
        const pvMatch = line.match(/\spv\s+(.+)$/);
        const multiMatch = line.match(/multipv (\d+)/);
        if (scoreMatch && pvMatch) {
          let score = Number(scoreMatch[2]);
          if (scoreMatch[1] === 'mate') score = Math.sign(score || 1) * (100000 - Math.abs(score) * 100);
          this.active.lines.set(Number(multiMatch?.[1] || 1), {score, pv:pvMatch[1].trim().split(/\s+/)});
        }
      }
      if (line.startsWith('bestmove ')) {
        const result = {bestMove:line.split(/\s+/)[1], lines:[...this.active.lines.entries()].sort((a,b) => a[0]-b[0]).map(entry => entry[1])};
        clearTimeout(this.active.timer);
        this.active.resolve(result); this.active = null; this.pump();
      }
    }
    analyze(fen, depth = 9, multiPV = 1, skill = 20) {
      if (this.failed) return Promise.reject(new Error('Engine unavailable'));
      return new Promise((resolve, reject) => { this.queue.push({fen, depth, multiPV, skill, resolve, reject, lines:new Map()}); this.pump(); });
    }
    pump() {
      if (!this.ready || this.active || !this.queue.length) return;
      this.active = this.queue.shift();
      this.worker.postMessage(`setoption name MultiPV value ${this.active.multiPV}`);
      this.worker.postMessage(`setoption name Skill Level value ${this.active.skill}`);
      this.worker.postMessage(`position fen ${this.active.fen}`);
      this.worker.postMessage(`go depth ${this.active.depth}`);
      this.active.timer = setTimeout(() => this.restart('Stockfish search timed out'), 30000);
    }
  };
}());
