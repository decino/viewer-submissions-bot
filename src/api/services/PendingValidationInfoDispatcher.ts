import {singleton} from "tsyringe";
import {Property} from "../../model/framework/decorators/Property.js";
import {Client} from "discordx";
import {Typeings} from "../../model/Typeings.js";
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    EmbedBuilder,
    GuildMember,
    Message,
    MessageActionRowComponentBuilder
} from "discord.js";
import {ChannelType} from "discord-api-types/v10";
import fetch, {HeadersInit} from 'node-fetch';
import PendingValidationPayload = Typeings.PendingValidationPayload;

@singleton()
export class PendingValidationInfoDispatcher {

    @Property("PENDING_VALIDATION_CHANNEL")
    private channelToPostId: string;

    @Property("GUILD")
    private guildId: string;

    @Property("WEBAPP_BASEURL")
    private webappUrl: string;

    @Property("WEBAPP_USERNAME")
    private username: string;

    @Property("PASSWORD")
    private password: string;

    public constructor(private _client: Client) {
    }

    public async postToChannel(payload: PendingValidationPayload): Promise<Message | null> {
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
            .setTitle("New Entry")
            .setColor(colour)
            .setFields([
                {
                    name: "Wad Name",
                    value: payload.wadName
                },
                {
                    name: "Map",
                    value: payload.map
                },
                {
                    name: "Email",
                    value: payload.email
                }
            ]).setAuthor({
                name: me.displayName,
                iconURL: avatarUrl
            })
            .setTimestamp();
        if (payload.info) {
            infoEmbed.setDescription(payload.info.slice(0, 4096));
        }
        if (payload.submitterName) {
            infoEmbed.addFields([{
                name: "Submitter Name",
                value: payload.submitterName
            }]);
        }
        const verifyButton = new ButtonBuilder()
            .setLabel("Verify")
            .setStyle(ButtonStyle.Success)
            .setCustomId("verify");
        const rejectButton = new ButtonBuilder()
            .setLabel("Reject")
            .setStyle(ButtonStyle.Danger)
            .setCustomId("reject");
        const deleteButton = new ButtonBuilder()
            .setLabel("Delete")
            .setStyle(ButtonStyle.Secondary)
            .setCustomId("delete");

        const buttonRow =
            new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
                verifyButton, rejectButton, deleteButton
            );
        const message = await channelTOPostTo.send({
            embeds: [infoEmbed],
            components: [buttonRow]
        });
        const collector = message.createMessageComponentCollector();
        collector.on("collect", async (collectInteraction: ButtonInteraction) => {
            try {
                await collectInteraction.deferUpdate();
                const buttonId = collectInteraction.customId;

                let ok = false;
                let messageStr = "";

                switch (buttonId) {
                    case"reject":
                        ok = await this.deleteSubmission(payload.id, true);
                        messageStr = "rejected";
                        break;
                    case"delete":
                        ok = await this.deleteSubmission(payload.id, false);
                        messageStr = "deleted";
                        break;
                    case"verify":
                        ok = await this.verifySubmission(payload.id);
                        messageStr = "verified";
                        break;
                }

                if (ok) {
                    const followUp = await collectInteraction.followUp({
                        content: `Submission has been ${messageStr} successfully`
                    });
                    await message.delete();
                    setTimeout(() => {
                        followUp.delete().catch();
                    }, 3000);
                } else {
                    const followup = await collectInteraction.followUp({
                        content: `Unable to ${buttonId}`
                    });
                    setTimeout(() => {
                        followup.delete().catch();
                    }, 3000);
                }
            } catch (e) {
                console.error(e);
            }
        });
        return message;
    }

    private async deleteSubmission(id: number, notify: boolean): Promise<boolean> {
        const response = await fetch(`${this.webappUrl}/rest/submission/deleteEntries?notify=${notify}`, {
            method: "DELETE",
            headers: this.getHeaders(),
            body: JSON.stringify([id])
        });
        if (!response.ok) {
            console.error(response.statusText);
        }
        return response.ok;
    }

    private async verifySubmission(id: number): Promise<boolean> {
        const response = await fetch(`${this.webappUrl}/rest/submission/verifyEntries`, {
            method: "POST",
            headers: this.getHeaders(),
            body: JSON.stringify([id])
        });
        if (!response.ok) {
            console.error(response.statusText);
        }
        return response.ok;
    }

    private getHeaders(): HeadersInit {
        const Authorization = `Basic ${Buffer.from(`${this.username}:${this.password}`).toString('base64')}`;
        return {
            Authorization,
            'Content-Type': 'application/json'
        };
    }

}
