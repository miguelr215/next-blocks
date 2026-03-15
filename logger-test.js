import logger, { createModuleLogger } from "./logger.js";

const sportsLogger = createModuleLogger("sports");
const gamesLogger = createModuleLogger("games");

logger.info("Hello from default logger!"); // → logs/app.log + stdout
sportsLogger.info("Fetching sports events..."); // → logs/sports.log + stdout
gamesLogger.info("Creating a new game..."); // → logs/games.log + stdout
