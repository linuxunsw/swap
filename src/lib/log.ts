import { LOG_DEV_ONLY, LOG_DEBUG } from "$env/static/private";
const dev = LOG_DEV_ONLY === 'true';
const debug = LOG_DEBUG === 'true';

log('info', 'log', 'init', { dev, debug });

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const DEV_ONLY = Symbol('devOnly');
type DevOnly = { [DEV_ONLY]: unknown };
type LogData = Record<string, unknown | DevOnly>;

/**
 * Wraps a value so it is logged only in development.
 * Use as a value in the log data object.
 * @param value Value to wrap.
 * @returns Wrapped value safe to include in log data.
 */
export const devOnly = (value: unknown): DevOnly => ({ [DEV_ONLY]: value });

// unwraps or nukes any devonly fields depending on environment.
function resolveData(data: LogData): Record<string, unknown> {
	const out: Record<string, unknown> = {};
	for (const [k, v] of Object.entries(data)) {
		if (v && typeof v === 'object' && DEV_ONLY in v) {
			if (dev) {
				out[k] = (v as DevOnly)[DEV_ONLY];
			}
		} else {
			out[k] = v;
		}
	}
	return out;
}

/**
 * Logs a structured JSON message with consistent fields.
 * @param level Log severity (`debug`, `info`, `warn`, or `error`).
 * @param component Name of the source component.
 * @param event Name of the event.
 * @param data Extra fields to include. Wrap sensitive/dev-only values with `devOnly()` to omit them in production.
 */
export function log(level: LogLevel, component: string, event: string, data: LogData = {}): void {
	const payload = JSON.stringify({
		level,
		component,
		event,
		timestamp: new Date().toISOString(),
		...resolveData(data)
	});

	if (level === 'debug' && !debug) return;
	if (level === 'warn') return console.warn(payload);
	if (level === 'error') return console.error(payload);
	console.log(payload);
}
