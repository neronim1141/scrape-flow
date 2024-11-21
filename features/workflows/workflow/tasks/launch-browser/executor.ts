import "server-only";
import chromium from "@sparticuz/chromium-min";
import puppeteer from "puppeteer-core";
import { ExecutionEnvironment } from "../../execution/type";
import { LaunchBrowserTask } from "./config";
export const launchBrowserExecutor = async (
  environment: ExecutionEnvironment<typeof LaunchBrowserTask>
) => {
  try {
    const websiteUrl = environment.getInput("Website Url");
    const browser = await puppeteer.launch({
      args: [...chromium.args, "--hide-scrollbars", "--disable-web-security"],
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(
        `https://github.com/Sparticuz/chromium/releases/download/v131.0.0/chromium-v131.0.0-pack.tar`
      ),
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
