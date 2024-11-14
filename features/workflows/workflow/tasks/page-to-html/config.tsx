import { CodeIcon } from "lucide-react";
import { Task } from "../../node/type";

export const PageToHtmlTask = {
  type: "PAGE_TO_HTML",
  label: "Page to html",
  icon: (props) => <CodeIcon className="stroke-rose-400" {...props} />,
  isEntryPoint: false,
  inputs: [
    {
      name: "Web page",
      type: "BROWSER_INSTANCE",
      required: true,
    },
  ],
  outputs: [
    {
      name: "Html",
      type: "STRING",
    },
    {
      name: "Web page",
      type: "BROWSER_INSTANCE",
    },
  ],
} satisfies Task;
