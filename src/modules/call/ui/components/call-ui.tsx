import { StreamTheme, useCall } from "@stream-io/video-react-sdk";
import { useState } from "react";
import { CallLobby } from "./call-lobby";
import { CallActive } from "./call-active";
import { CallEnded } from "./call-ended";


interface Props {
  meetingName: string;
}

export const CallUi = ({ meetingName }: Props) => {

  const call = useCall();
  const [show, setShow] = useState<'lobby' | 'call' | 'ended'>('lobby');

  const onJoin = async () => {
    if(!call) {
      return;
    }
    await call.join();
    setShow('call')
  }

  const onLeave = async () => {
    if(!call) {
      return;
    }
    await call.endCall();
    setShow('ended');
  }
  return (
    <StreamTheme className="h-screen">
      {show === 'lobby' && (
        <CallLobby onJoin={onJoin} />
      )}
      {show === 'call' && (
        <CallActive meetingName={meetingName} onLeave={onLeave} />
      )}
      {show === 'ended' && (
        <CallEnded />
      )}
    </StreamTheme>
  )
}