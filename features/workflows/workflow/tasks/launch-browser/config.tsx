import { GlobeIcon } from "lucide-react";
import { Task } from "../../node/type";

export const LaunchBrowserTask = {
  type: "LAUNCH_BROWSER",
  label: "Launch browser",
  icon: (props) => <GlobeIcon className="stroke-pink-400" {...props} />,
  isEntryPoint: true,
  credits: 5,

  inputs: [
    {
      name: "Website Url",
      type: "STRING",
      helperText: "eg: https://www.google.com",
      required: true,
      hideHandle: true,
    },
  ],
  outputs: [
    {
      name: "Web page",
      type: "BROWSER_INSTANCE",
    },
  ],
} satisfies Task;
