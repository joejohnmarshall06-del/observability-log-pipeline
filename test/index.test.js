import test from "node:test";
import assert from "node:assert/strict";
import { LogPipeline } from "../src/index.js";
test("redacts secrets", () => {
  const p = new LogPipeline();
  assert.equal(p.ingest("t INFO api token=abc").message.includes("abc"), false);
});
test("detects error anomaly", () => {
  const p = new LogPipeline();
  p.ingest("t ERROR api bad"); p.ingest("t ERROR api bad"); p.ingest("t ERROR api bad");
  assert.equal(p.anomalies({ threshold: 3 }), true);
});
