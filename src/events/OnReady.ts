import {ArgsOf, Client, Discord, DIService, On} from "discordx";
import {ActivityType, ChannelType, InteractionType} from "discord-api-types/v10";
import {container, injectable} from "tsyringe";
import logger from "../utils/LoggerFactory.js";
import {ObjectUtil} from "../utils/Utils.js";
import {BotServer} from "../api/BotServer.js";

@Discord()
@injectable()
export class OnReady {

    public constructor(private _client: Client) {
    }

    public initAppCommands(): Promise<void> {
        return this._client.initApplicationCommands();
    }

    @On()
    private async ready([client]: ArgsOf<"ready">): Promise<void> {
        client.user.setActivity('Doom V', {type: ActivityType.Playing});
        await this.initAppCommands();
        this.initDi();
        this.initWebServer();
    }

    private initWebServer(): void {
        container.resolve(BotServer);
    }

    @On()
    private async interactionCreate([interaction]: ArgsOf<"interactionCreate">, client: Client): Promise<void> {
        try {
            await client.executeInteraction(interaction);
        } catch (e) {
            if (e instanceof Error) {
                logger.error(e.message);
            } else {
                logger.error(e);
            }
            const me = interaction?.guild?.members?.me ?? interaction.user;
            if (interaction.type === InteractionType.ApplicationCommand || interaction.type === InteractionType.MessageComponent) {
                const channel = interaction.channel;
                if (channel && (channel.type !== ChannelType.GuildText || !channel.permissionsFor(me).has("SendMessages"))) {
                    logger.error(`cannot send warning message to this channel`, interaction);
                    return;
                }
                try {
                    await ObjectUtil.replyOrFollowUp(
                        interaction,
                        "Something went wrong, please notify my developer: <@697417252320051291>"
                    );
                } catch (e) {
                    logger.error(e);
                }
            }
        }
    }

    private initDi(): void {
        DIService.allServices;
    }
}
