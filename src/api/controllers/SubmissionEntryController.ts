import {BaseController} from "./BaseController.js";
import {Controller, Post} from "@overnightjs/core";
import {container, singleton} from "tsyringe";
import {SubmissionInfoDispatcher} from "../services/SubmissionInfoDispatcher.js";
import {Typeings} from "../../model/Typeings.js";
import {StatusCodes} from "http-status-codes";
import type {Request, Response} from "express";
import logger from "../../utils/LoggerFactory.js";
import SubmissionPayload = Typeings.SubmissionPayload;

@singleton()
@Controller("bot")
export class SubmissionEntryController extends BaseController {

    private readonly _submissionInfoDispatcher: SubmissionInfoDispatcher;

    public constructor() {
        super();
        this._submissionInfoDispatcher = container.resolve(SubmissionInfoDispatcher);
    }

    @Post(`postSubmission`)
    private async postSubmission(req: Request, res: Response): Promise<Response> {
        const body: SubmissionPayload = req.body;
        try {
            const result = await this._submissionInfoDispatcher.postToChannel(body);
            return super.ok(res, {
                success: `sent`,
                messageId: result.id
            });
        } catch (e) {
            logger.warn(e.message);
            return super.doError(res, e.message, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}
