import DOOM_ENGINE from "../enums/DoomEngine.js";
import GZDoomActions from "../enums/GZDoomActions.js";

export namespace Typeings {
    export type propTypes = envTypes & packageJsonTypes
    export type envTypes = {
        TOKEN: string;
        NODE_ENV: "production" | "development";
        API_SERVER_PORT: number;
        CHANNEL: string;
        GUILD: string;
    };

    type packageJsonTypes = {
        "name"?: string,
        "version"?: string,
        "description"?: string,
        "type"?: string,
        "main"?: string,
        "scripts"?: { [key: string]: string },
        "repository"?: {
            "type"?: string,
            "url"?: string
        },
        "author"?: string,
        "license"?: string,
        "bugs"?: {
            "url"?: string
        },
        "dependencies"?: { [key: string]: string },
        "homepage"?: string,
        "devDependencies"?: { [key: string]: string }
    }


    export type SubmissionPayload = {
        wadName: string,
        wadLevel: string,
        wadEngine: DOOM_ENGINE,
        gzDoomActions?: GZDoomActions[],
        info?: string
    }

}
