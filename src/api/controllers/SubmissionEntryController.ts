import {BaseController} from "./BaseController.js";
import {Controller, Post} from "@overnightjs/core";
import {container, singleton} from "tsyringe";
import {SubmissionInfoDispatcher} from "../services/SubmissionInfoDispatcher.js";
import {PendingValidationInfoDispatcher} from "../services/PendingValidationInfoDispatcher.js";
import {Typeings} from "../../model/Typeings.js";
import {StatusCodes} from "http-status-codes";
import type {Request, Response} from "express";
import logger from "../../utils/LoggerFactory.js";
import SubmissionPayload = Typeings.SubmissionPayload;
import PendingValidationPayload = Typeings.PendingValidationPayload;


@singleton()
@Controller("bot")
export class SubmissionEntryController extends BaseController {

    private readonly _submissionInfoDispatcher: SubmissionInfoDispatcher;
    private readonly _pendingValidationInfoDispatcher: PendingValidationInfoDispatcher;

    public constructor() {
        super();
        this._submissionInfoDispatcher = container.resolve(SubmissionInfoDispatcher);
        this._pendingValidationInfoDispatcher = container.resolve(PendingValidationInfoDispatcher);
    }

    @Post(`postPendingValidationRequest`)
    private async postPendingValidationRequest(req: Request, res: Response): Promise<Response> {
        const body: PendingValidationPayload = req.body;
        try {
            const result = await this._pendingValidationInfoDispatcher.postToChannel(body);
            return super.ok(res, {
                success: `sent`,
                messageId: result.id
            });
        } catch (e) {
            logger.warn(e.message);
            return super.doError(res, e.message, StatusCodes.INTERNAL_SERVER_ERROR);
        }
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

    @Post(`congratulations`)
    private async postCongratulations(req: Request, res: Response): Promise<Response> {
        try {
            const result = await this._submissionInfoDispatcher.postCongratulations();
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
