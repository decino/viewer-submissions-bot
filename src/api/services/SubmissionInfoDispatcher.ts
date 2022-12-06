import {singleton} from "tsyringe";
import {Property} from "../../model/framework/decorators/Property.js";
import {Typeings} from "../../model/Typeings.js";
import {Client} from "discordx";
import {ChannelType} from "discord-api-types/v10";
import {EmbedBuilder, GuildMember, Message} from "discord.js";
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
            .setFields([
                {
                    name: "WAD name",
                    value: payload.wadName
                },
                {
                    name: "Map",
                    value: payload.wadLevel
                }
            ])
            .setAuthor({
                name: me.displayName,
                iconURL: avatarUrl
            })
            .setTimestamp();
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

}
