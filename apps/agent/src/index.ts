import path from "node:path";
import {existsSync, writeFileSync} from "node:fs";
import {readFileSync} from "fs";
import {logger} from "./logger";
import { v4 as uuid } from "uuid";
import os from "os";
import {Job, Runner} from "./types";
import axios, {AxiosError} from "axios";
import {spawn} from "node:child_process";

const BACKEND_URL = "http://localhost:3000";
const RUNNER_CONFIG_PATH = path.join(__dirname, 'runner.json');
let RUNNER_ID = ""

const axiosInstance = axios.create({
    baseURL: BACKEND_URL,
    headers: {
        "Content-Type": "application/json"
    }
})

const getRunnerDetails = () => {
    return {
        id: uuid(),
        name: os.homedir(),
        platform: os.platform(),
        release: os.release(),
        architecture: os.arch(),
    } as Runner
}

const getRunnerConfig = async () => {
    try {
        logger.info(`Getting runner config from ${RUNNER_CONFIG_PATH}`);
        const isExists = existsSync(RUNNER_CONFIG_PATH);
        if (isExists) {
            const getConfig = JSON.parse(readFileSync(RUNNER_CONFIG_PATH, "utf8")) as Runner;
            RUNNER_ID = getConfig['id'];
            return getConfig;
        }
        logger.info("Config not Found")

        const currentRunnerDetails = getRunnerDetails()

        RUNNER_ID = currentRunnerDetails.id;
        writeFileSync(RUNNER_CONFIG_PATH, JSON.stringify(currentRunnerDetails, null, 2), "utf-8");

        logger.info("New Config Created")

        return currentRunnerDetails;

    } catch (e) {
        logger.error(`Error while getting runner config: ${e}`);
        throw e;
    }
}

const streamLogs = async (jobId: string, type: string, data: string) => {
    try {
        await axiosInstance.post(`/jobs/logs`, {
            agentId: RUNNER_ID,
            jobId,
            type,
            data
        })
    } catch (e) {
        logger.error(`Error while streaming logs: ${e}`);
        throw e;
    }
}

const executeCommand = async (job: Job) => {
    const { id, type, data } = job;

    const child = spawn(data.commands[1], { shell: true });

    let logBuffer = ""
    const BUFFER_SIZE_BYTES = 50 * 1024;
    let lastSentTime = Date.now();
    const SEND_INTERVAL_MS = 500

    const sendBuffer = (type: string) => {
        if (logBuffer.length > 0) {
            streamLogs(id, type, logBuffer);
            logBuffer = "";
            lastSentTime = Date.now();
        }
    }

    child.stdout.on('data', (data: any) => {
        logBuffer += data.toString();
        if (logBuffer.length >= BUFFER_SIZE_BYTES) {
            sendBuffer("stdout")
        }
    })

    child.stderr.on('data', (data: any) => {
        logBuffer += data.toString();
        if (logBuffer.length >= BUFFER_SIZE_BYTES) {
            sendBuffer("stderr")
        }
    })

    const bufferTimer = setInterval(() => {
        if (Date.now() - lastSentTime > SEND_INTERVAL_MS) {
            sendBuffer("stdout_stderr")
        }
    }, SEND_INTERVAL_MS);

    child.on("close", (code) => {
        clearInterval(bufferTimer);
        sendBuffer("stdout_stderr")
        const status = code === 0 ? "completed" : "failed"
        streamLogs(id, "status", status);
    })

}

async function startPolling() {

    let runnerConfig = await getRunnerConfig();
    const response = await axiosInstance.post(`/agents`, runnerConfig);

    if (response.status === 200) {
        logger.info("Registered or updated agent...")
    }

    logger.info(`Agent Started with ID: ${runnerConfig.id}`);
    logger.info("Starting Polling...")

    while (true) {
        try {

            const response = await axiosInstance.post(`/jobs/poll`, { agentId: RUNNER_ID });

            if (response.status === 200) {
                const job = response.data as Job;
                logger.info(`Job ${job.id} started`);
                await executeCommand(job);
            }

        } catch (e) {
            if (e instanceof AxiosError) {
                if (axios.isCancel(e) || e.code === "ECONNABORTED" || e.response?.status === 204) {
                    logger.info("No new jobs, Retrying")
                }
            } else {
                logger.error(`Polling Error: ${e instanceof Error ? e.message : e}`);
                throw e;
            }

        }
    }
}

startPolling();