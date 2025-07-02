import Link from "next/link";
import { LogInIcon } from "lucide-react";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import { DefaultVideoPlaceholder, StreamVideoParticipant, ToggleAudioPreviewButton, ToggleVideoPreviewButton, useCallStateHooks, VideoPreview } from "@stream-io/video-react-sdk";
import { authClient } from "@/lib/auth-client";
import { generatedAvatarUri } from "@/lib/avatar";
import { Button } from "@/components/ui/button";

interface Props {
  onJoin: () => void;
}

const DisabledVideoPreview = () => {
  const { data } = authClient.useSession();

  return (
    <DefaultVideoPlaceholder
      className="w-16 h-16 rounded-full"
      participant={{
        name: data?.user.name ?? "Unknown",
        image: data?.user.image ?? generatedAvatarUri({
          seed: data?.user.name ?? "Unknown",
          variants: "initials"
        })
      } as StreamVideoParticipant}
    />
  )
};

const AllowBrowserPermission = () => {

  return (
    <p className="text-sm">
      Please allow access to your microphone and camera.
    </p>
  )
}

export const CallLobby = ({ onJoin }: Props) => {
  const { useMicrophoneState, useCameraState } = useCallStateHooks();

  const { hasBrowserPermission: hasMicrophonePermission } = useMicrophoneState();
  const { hasBrowserPermission: hasCameraPermission } = useCameraState();

  const hasBrowserMediaPermission = hasMicrophonePermission && hasCameraPermission;
  return (
    <div className="flex flex-col items-center justify-center h-full bg-radial from-sidebar-ac to-sidebar-bg">
      <div className="flex flex-col items-center justify-center gap-y-6 bg-background rounded-lg p-10 shadow-sm">
        <div className="flex flex-col items-center justify-center gap-y-4 text-center">
          <h6 className="font-bold text-xl">
            Join the meeting
          </h6>
          <p className="text-sm text-gray-500">
            Please make sure your browser has access to your microphone and camera.
          </p>
        </div>
        <VideoPreview
          DisabledVideoPreview={
            hasBrowserMediaPermission ? DisabledVideoPreview : AllowBrowserPermission
          }
        ></VideoPreview>
        <div className="flex gap-x-2">
          <ToggleAudioPreviewButton />
          <ToggleVideoPreviewButton />
        </div>
        <div className="flex gap-x-2 justify-between w-full">
          <Button variant="ghost">
            <Link href="/meetings"></Link>
            Cancel
          </Button>
          <Button onClick={onJoin}>
            <LogInIcon  className="size-4"/>
            Join Call
          </Button>
        </div>
      </div>
    </div>
  )
}

