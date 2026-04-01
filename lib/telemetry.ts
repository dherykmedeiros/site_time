type TelemetryPayload = Record<string, unknown>;

export function trackOperationalEvent(event: string, payload: TelemetryPayload = {}) {
  try {
    const record = {
      event,
      payload,
      ts: new Date().toISOString(),
    };

    console.info("[ops-event]", JSON.stringify(record));
  } catch {
    // Never break the request flow due to telemetry issues.
  }
}
