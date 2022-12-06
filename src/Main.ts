import "reflect-metadata";
import dotenv from "dotenv";
import {container} from "tsyringe";
import * as v8 from "v8";
import logger from "./utils/LoggerFactory.js";
import {registerInstance} from "./model/framework/DI/moduleRegistrar.js";
import {dirname, importx} from "@discordx/importer";
import {Client, ClientOptions, DIService, ILogger, tsyringeDependencyRegistryEngine} from "discordx";
import {IntentsBitField} from "discord.js";
import {Typeings} from "./model/Typeings.js";
import {Property} from "./model/framework/decorators/Property.js";
import propTypes = Typeings.propTypes;

dotenv.config();

export class Main {
    @Property("TOKEN")
    private static readonly token: string;

    @Property("NODE_ENV")
    private static readonly envMode: propTypes["NODE_ENV"];

    public static async start(): Promise<void> {
        DIService.engine = tsyringeDependencyRegistryEngine.setInjector(container);
        logger.info(process.execArgv);
        logger.info(`max heap sapce: ${v8.getHeapStatistics().total_available_size / 1024 / 1024}`);
        const clientOps: ClientOptions = {
            intents: [
                IntentsBitField.Flags.Guilds
            ],
            logger: new class djxLogger implements ILogger {
                public error(...args: unknown[]): void {
                    logger.error(args);
                }

                public info(...args: unknown[]): void {
                    logger.info(args);
                }

                public log(...args: unknown[]): void {
                    logger.info(args);
                }

                public warn(...args: unknown[]): void {
                    logger.warn(args);
                }
            },
            silent: false,
        };
        const client = new Client(clientOps);
        registerInstance(client);
        await importx(`${dirname(import.meta.url)}/{events,commands}/**/*.{ts,js}`);
        await client.login(this.token);
    }

}

await Main.start();
