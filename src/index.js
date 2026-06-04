export class LogPipeline {
  constructor() { this.events = []; this.redactions = [/password=[^\s]+/gi, /token=[^\s]+/gi]; }
  ingest(line) {
    const clean = this.redactions.reduce((text, pattern) => text.replace(pattern, "secret=REDACTED"), line);
    const event = parseLine(clean); this.events.push(event); return event;
  }
  countBy(field) {
    return this.events.reduce((acc, event) => (acc[event[field]] = (acc[event[field]] || 0) + 1, acc), {});
  }
  anomalies({ field = "level", value = "error", threshold = 3 }) {
    return (this.countBy(field)[value] || 0) >= threshold;
  }
}
export function parseLine(line) {
  const [time, level, service, ...message] = line.split(" ");
  return { time, level: level?.toLowerCase(), service, message: message.join(" ") };
}
