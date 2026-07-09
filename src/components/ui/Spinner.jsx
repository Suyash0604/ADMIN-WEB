import { Loader2 } from "lucide-react";

const Spinner = ({ size = 18, className = "" }) => (
  <Loader2
    size={size}
    strokeWidth={2.4}
    className={["animate-spin", className].join(" ")}
  />
);

export default Spinner;
