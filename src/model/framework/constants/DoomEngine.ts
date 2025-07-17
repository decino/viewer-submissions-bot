enum DOOM_ENGINE {
    UNKNOWN = -2,
    NA = 0,
    GZDoom = -1,
    Doom = 3,
    DoomII = 2,
    FINAL_DOOM = 4,
    BOOM = 9,
    MBF = 11,
    MBF21 = 21,
    DOOM_64,
}

export function parseDoomEngine(engine: DOOM_ENGINE): string {
    switch (engine) {
        case DOOM_ENGINE.NA:
            return "Not Available";
        case DOOM_ENGINE.GZDoom:
            return "GZDoom";
        case DOOM_ENGINE.Doom:
            return "Doom";
        case DOOM_ENGINE.DoomII:
            return "Doom II";
        case DOOM_ENGINE.FINAL_DOOM:
            return "Final Doom";
        case DOOM_ENGINE.BOOM:
            return "Boom";
        case DOOM_ENGINE.MBF:
            return "MBF";
        case DOOM_ENGINE.MBF21:
            return "MBF21";
        case DOOM_ENGINE.DOOM_64:
            return "Doom 64";
        default:
            return "Unknown";
    }
}


export default DOOM_ENGINE;
