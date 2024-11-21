import { CodeIcon } from "lucide-react";
import { Task } from "../type";

export const PageToHtmlTask = {
  type: "PAGE_TO_HTML",
  label: "Get HTML from page",
  icon: (props) => <CodeIcon className="stroke-rose-400" {...props} />,
  isEntryPoint: false,
  credits: 2,

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
} as const satisfies Task;
