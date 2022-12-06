import {singleton} from "tsyringe";
import {Property} from "../../model/framework/decorators/Property.js";
import {Typeings} from "../../model/Typeings.js";
import {Client} from "discordx";
import {ChannelType} from "discord-api-types/v10.js";
import {EmbedBuilder, GuildMember, Message} from "discord.js";
import DOOM_ENGINE from "../../enums/DoomEngine.js";
import GZDoomActions from "../../enums/GZDoomActions.js";
import GZDOOM_ACTIONS from "../../enums/GZDoomActions.js";
import SubmissionPayload = Typeings.SubmissionPayload;

@singleton()
export class SubmissionInfoDispatcher {

    @Property("CHANNEL")
    private channelToPostId: string;

    @Property("GUILD")
    private guildId: string;

    public constructor(private _client: Client) {
    }

    public postToChannel(payload: SubmissionPayload): Promise<Message | null> {
        const guild = this._client.guilds.resolve(this.guildId);
        const channelTOPostTo = guild.channels.resolve(this.channelToPostId);
        const isText = channelTOPostTo.type === ChannelType.GuildText;
        if (!isText) {
            return null;
        }
        const me = guild?.members.me;
        const colour = me instanceof GuildMember ? me.displayHexColor : "#0099ff";
        const avatarUrl = me.displayAvatarURL({size: 1024});
        const infoEmbed = new EmbedBuilder()
            .setTitle("New submission")
            .setColor(colour)
            .setDescription("A new entry has been submitted")
            .setFields([
                {
                    name: "WAD name",
                    value: payload.wadName
                },
                {
                    name: "Map",
                    value: payload.wadLevel
                },
                {
                    name: "wad Engine",
                    value: this.getEngineName(payload.wadEngine)
                }
            ])
            .setAuthor({
                url: avatarUrl,
                name: me.displayName
            })
            .setTimestamp();
        if (payload.gzDoomActions) {
            infoEmbed.addFields([
                {
                    name: "gzDoom Actions",
                    value: this.parseGZDoomActions(payload.gzDoomActions)
                }
            ]);
        }
        if (payload.info) {
            infoEmbed.addFields([
                {
                    name: "info",
                    value: payload.info
                }
            ]);
        }
        return channelTOPostTo.send({
            embeds: [infoEmbed]
        });
    }

    private getEngineName(engine: DOOM_ENGINE): string {
        switch (engine) {
            case DOOM_ENGINE.GZDoom:
                return "GZDoom";
            case DOOM_ENGINE.Doom:
                return "DOOM";
            case DOOM_ENGINE.DoomII:
                return "DOOM II";
            case DOOM_ENGINE.FINAL_DOOM:
                return "Final Doom";
            case DOOM_ENGINE.BOOM:
                return "BOOM";
            case DOOM_ENGINE.MBF:
                return "MBF";
            case DOOM_ENGINE.MBF21:
                return "MBF21";

        }
    }

    private parseGZDoomActions(actions: GZDoomActions[]): string {
        return actions.map(action => {
            switch (action) {
                case GZDOOM_ACTIONS.JUMP:
                    return "Jump";
                case GZDOOM_ACTIONS.CROUCH:
                    return "Crouch";
                case GZDOOM_ACTIONS.MOUSE_LOOK:
                    return "Mouse look";

            }
        }).join(", ");
    }

}
