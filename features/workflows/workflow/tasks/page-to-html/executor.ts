import "server-only";
import { ExecutionEnvironment } from "../../execution/type";
import { PageToHtmlTask } from "./config";

export const pageToHTMLExecutor = async (
  environment: ExecutionEnvironment<typeof PageToHtmlTask>
) => {
  try {
    const html = await environment.getPage()!.content();
    environment.setOutput("Html", html);
    return true;
  } catch (e) {
    if (e instanceof Error) {
      environment.log.error(e.message);
    }
    console.error(e);
    environment.log.error("Something went wrong with: page to html");
    return false;
  }
};
