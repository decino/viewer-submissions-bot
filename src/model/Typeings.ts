import RECORDED_FORMAT from "./framework/constants/RecordedFormat";
import DOOM_ENGINE from "./framework/constants/DoomEngine";

export namespace Typeings {
    export type propTypes = envTypes & packageJsonTypes
    export type envTypes = {
        TOKEN: string;
        NODE_ENV: "production" | "development";
        API_SERVER_PORT: number;
        SUBMISSION_CHANNEL: string;
        PENDING_VALIDATION_CHANNEL: string;
        GUILD: string;
        WEBAPP_BASEURL: string;
        WEBAPP_USERNAME: string;
        PASSWORD: string;
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
        wadName: string;
        wadLevel: string;
        timeStamp: number;
        info: string | null;
        downloadUrl: string | null;
        recordFormat: RECORDED_FORMAT;
        mapCompatibility: DOOM_ENGINE;
        sourcePort: string | null;
    }

    export type PendingValidationPayload = {
        wadName: string,
        email: string,
        submitterName: string | null,
        info: string | null,
        id: number,
        map: string
    }

}
