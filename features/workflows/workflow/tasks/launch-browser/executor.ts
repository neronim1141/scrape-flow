import "server-only";
import chromium from "chrome-aws-lambda";
import { ExecutionEnvironment } from "../../execution/type";
import { LaunchBrowserTask } from "./config";
let chrome = {};
let puppeteer;

if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
  // running on the Vercel platform.
  chrome = require("chrome-aws-lambda");
  puppeteer = require("puppeteer-core");
} else {
  // running locally.
  puppeteer = require("puppeteer");
}
export const launchBrowserExecutor = async (
  environment: ExecutionEnvironment<typeof LaunchBrowserTask>
) => {
  try {
    const websiteUrl = environment.getInput("Website Url");
    const browser = await puppeteer.launch({
      args: [...chromium.args, "--hide-scrollbars", "--disable-web-security"],
      defaultViewport: chromium.defaultViewport,
      executablePath: chromium.executablePath,
      headless: chromium.headless,
    });
    environment.log.info("Browser started successfully");
    environment.setBrowser(browser);
    const page = await browser.newPage();
    await page.goto(websiteUrl);
    environment.setPage(page);
    environment.log.info(`Opened page at ${websiteUrl}`);

    return true;
  } catch (e) {
    if (e instanceof Error) {
      environment.log.error(e.message);
    }
    console.error(e);
    environment.log.error("Something went wrong");
    return false;
  }
};
