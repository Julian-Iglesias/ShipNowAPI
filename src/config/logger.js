
import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import config from "./env.config.js";


const levels = {
  fatal: 0,
  error: 1,
  warning: 2,
  info: 3,
  http: 4,
  debug: 5,
};


const logFormat = winston.format.combine(
  winston.format.timestamp({
    format: "YYYY-MM-DD HH:mm:ss",
  }),
  winston.format.printf(({ timestamp, level, message }) => {
    return `${timestamp} [${level}] ${message}`;
  })
);


const errorFileTransport = new DailyRotateFile({
  dirname: "logs",
  filename: "error-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  maxSize: "10m",
  maxFiles: "14d",
  level: "error",
  format: logFormat,
});

const logger = winston.createLogger({
  levels,

  level: config.nodeEnv === "development" ? "debug" : "info",

  transports: [
    new winston.transports.Console({
      format: logFormat,
    }),
    errorFileTransport,
  ],
});

export default logger;
