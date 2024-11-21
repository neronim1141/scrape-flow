import "server-only";
import { ExecutionEnvironment } from "../../execution/type";
import { ExtractTextFromElementTask } from "./config";
import * as cheerio from "cheerio";
export const extractTextFromElementExecutor = async (
  environment: ExecutionEnvironment<typeof ExtractTextFromElementTask>
) => {
  try {
    const html = environment.getInput("Html");
    const selector = environment.getInput("Selector");
    const $ = cheerio.load(html);
    const element = $(selector);
    if (!element) {
      environment.log.error("Element not found");
      return false;
    }
    const extractedText = $.text(element);
    if (!extractedText) {
      environment.log.error("Element has no text");
      return false;
    }
    environment.setOutput("Extracted text", extractedText);
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
