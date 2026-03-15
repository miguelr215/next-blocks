import build from "pino-abstract-transport";
import SonicBoom from "sonic-boom";
import { once } from "node:events";
import path from "node:path";

/**
 * Custom Pino transport that routes logs to separate files based on the `module` field.
 *
 * Logs with `{ module: "sports" }` go to `logs/sports.log`,
 * logs with `{ module: "games" }` go to `logs/games.log`, etc.
 * Logs without a `module` field go to `logs/app.log`.
 *
 * @param {object} opts - Transport options
 * @param {string} [opts.logDir="."] - Directory to write log files into
 * @param {string} [opts.defaultModule="app"] - Default module name for untagged logs
 */
export default async function logRouter(opts) {
	const streams = new Map();
	const logDir = opts.logDir || ".";
	const defaultModule = opts.defaultModule || "app";

	return build(
		async function (source) {
			for await (const obj of source) {
				const moduleName = obj.module || defaultModule;

				// Lazily create a file stream per module
				if (!streams.has(moduleName)) {
					const dest = new SonicBoom({
						dest: path.join(logDir, `${moduleName}.log`),
						mkdir: true,
						sync: false,
					});
					await once(dest, "ready");
					streams.set(moduleName, dest);
				}

				const line = JSON.stringify(obj) + "\n";
				const toDrain = !streams.get(moduleName).write(line);

				// Handle backpressure
				if (toDrain) {
					await once(streams.get(moduleName), "drain");
				}
			}
		},
		{
			async close() {
				for (const stream of streams.values()) {
					stream.end();
					await once(stream, "close");
				}
			},
		},
	);
}
