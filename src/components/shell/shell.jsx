import { getPresetShell } from "../../theme/appearance";
import { useAppearance } from "../../theme/appearance-context";
import CloudControlShell from "./cloud-control/cloud-control-shell";
import StandardShell from "./standard-shell";

export default function Shell(props) {
  const { preset } = useAppearance();
  const shell = getPresetShell(preset);

  if (shell === "cloud-control") {
    return <CloudControlShell key="cloud-control" {...props} />;
  }

  return <StandardShell key="standard" {...props} />;
}
