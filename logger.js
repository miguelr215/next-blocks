import pino from "pino";

const __dirname = import.meta.dirname;

const transport = pino.transport({
	targets: [
		{
			target: `${__dirname}/log-router.mjs`,
			options: { logDir: `${__dirname}/logs`, defaultModule: "app" },
		},
		{
			target: "pino-pretty",
			options: { colorize: true },
		},
	],
});

const logger = pino(
	{
		level: process.env.PINO_LOG_LEVEL || "info",
		timestamp: pino.stdTimeFunctions.isoTime,
	},
	transport,
);

/**
 * Creates a child logger tagged with a module name.
 * Logs are routed to `logs/{moduleName}.log` and stdout.
 *
 * @param {string} moduleName - The module/page name for log routing
 * @returns {pino.Logger} A child logger instance
 */
export function createModuleLogger(moduleName) {
	return logger.child({ module: moduleName });
}

export default logger;
