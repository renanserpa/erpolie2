import * as React from "react";
import { Loader2 } from "lucide-react";

const Loading: React.FC = (): React.ReactElement => (
  <div className="flex items-center justify-center min-h-screen">
    <Loader2 className="h-6 w-6 animate-spin" />
  </div>
);

export default Loading;
