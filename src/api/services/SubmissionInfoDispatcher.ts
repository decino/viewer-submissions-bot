import {singleton} from "tsyringe";
import {Property} from "../../model/framework/decorators/Property.js";
import {Typeings} from "../../model/Typeings.js";
import {Client} from "discordx";
import {ChannelType} from "discord-api-types/v10";
import {
    ActionRowBuilder,
    AnyThreadChannel,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
    GuildMember,
    MessageActionRowComponentBuilder
} from "discord.js";
import {parseDoomEngine} from "../../model/framework/constants/DoomEngine.js";
import SubmissionPayload = Typeings.SubmissionPayload;

@singleton()
export class SubmissionInfoDispatcher {

    @Property("SUBMISSION_CHANNEL")
    private channelToPostId: string;

    @Property("GUILD")
    private guildId: string;

    public constructor(private _client: Client) {
    }

    public async postToChannel(payload: SubmissionPayload): Promise<AnyThreadChannel | null> {
        const guild = await this._client.guilds.fetch(this.guildId);
        const channelTOPostTo = await guild.channels.fetch(this.channelToPostId);
        const isText = channelTOPostTo.type === ChannelType.GuildText;
        if (!isText) {
            return null;
        }
        const me = guild?.members.me;
        const colour = me instanceof GuildMember ? me.displayHexColor : "#0099ff";
        const avatarUrl = me.displayAvatarURL({size: 1024});
        const infoEmbed = new EmbedBuilder()
            .setTitle(payload.wadName)
            .setColor(colour)
            .setFields([
                {
                    name: "Map",
                    value: payload.wadLevel,
                },
                {
                    name: "Record format",
                    value: payload.recordFormat,
                    inline: true
                },
                {
                    name: "Compatibility",
                    value: parseDoomEngine(payload.mapCompatibility),
                    inline: true
                }
            ])
            .setAuthor({
                name: me.displayName,
                iconURL: avatarUrl
            })
            .setTimestamp(payload.timeStamp);
        if (payload.info) {
            infoEmbed.setDescription(payload.info.slice(0, 4096));
        }

        if(payload.sourcePort){
            infoEmbed.addFields([
                {
                    name: "Tested on",
                    value: payload.sourcePort,
                    inline: true
                }
            ])
        }

        const messageOptions: Record<string, unknown> = { embeds: [infoEmbed] };

        if (payload.downloadUrl) {
            const downloadButton = new ButtonBuilder()
                .setLabel("Download WAD")
                .setStyle(ButtonStyle.Link)
                .setURL(payload.downloadUrl);
            const buttonRow = new ActionRowBuilder<MessageActionRowComponentBuilder>()
                .addComponents(downloadButton);
            messageOptions.components = [buttonRow];
        }

        const msg = await channelTOPostTo.send(messageOptions);

        return msg.startThread({
            name: `${payload.wadName} ${payload.wadLevel}`,
            reason: "started via submissions bot"
        });
    }

}
