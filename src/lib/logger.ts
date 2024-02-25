import log4js from "log4js";

log4js.configure({
  appenders: {
    out: {
      type: "stdout",
      layout: { type: "pattern", pattern: "%[%5p%] %m" },
    },
  },
  categories: {
    default: { appenders: ["out"], level: "debug" },
    production: { appenders: ["out"], level: "info" },
    development: { appenders: ["out"], level: "debug" },
  },
});

const logger = log4js.getLogger(process.env.NODE_ENV && ["production", "development"].includes(process.env.NODE_ENV) ? process.env.NODE_ENV : undefined);

export default logger;
