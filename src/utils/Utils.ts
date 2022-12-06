import {CommandInteraction, InteractionReplyOptions, MessageComponentInteraction} from "discord.js";

export class ObjectUtil {
    public static validString(...strings: Array<unknown>): boolean {
        if (strings.length === 0) {
            return false;
        }
        for (const currString of strings) {
            if (typeof currString !== "string") {
                return false;
            }
            if (currString.length === 0) {
                return false;
            }
            if (currString.trim().length === 0) {
                return false;
            }
        }
        return true;
    }

    public static async replyOrFollowUp(interaction: CommandInteraction | MessageComponentInteraction, replyOptions: (InteractionReplyOptions & { ephemeral?: boolean }) | string): Promise<void> {
        // if interaction is already replied
        if (interaction.replied) {
            await interaction.followUp(replyOptions);
            return;
        }

        // if interaction is deferred but not replied
        if (interaction.deferred) {
            await interaction.editReply(replyOptions);
            return;
        }

        // if interaction is not handled yet
        await interaction.reply(replyOptions);
    }
}
