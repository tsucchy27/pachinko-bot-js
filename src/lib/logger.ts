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
  },
});

const logger = log4js.getLogger();

export default logger;
