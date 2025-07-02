import Link from "next/link";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import { Button } from "@/components/ui/button";


export const CallEnded = () => {
  
  return (
    <div className="flex flex-col items-center justify-center h-full bg-radial from-sidebar-ac to-sidebar-bg">
      <div className="flex flex-col items-center justify-center gap-y-6 bg-background rounded-lg p-10 shadow-sm">
        <div className="flex flex-col items-center justify-center gap-y-4 text-center">
          <h6 className="font-bold text-xl">
            You have ended the call.
          </h6>
          <p className="text-sm text-gray-500">
            Summary will appear in a few minutes.
          </p>
        </div>
        <Button asChild>
          <Link href="/meetings" className="text-white">
            Back to meetings
          </Link>
        </Button>
      </div>
    </div>
  )
}

