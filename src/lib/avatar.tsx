import { botttsNeutral, initials } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";


interface Props {
  seed: string;
  variants?: "botttsNeutral" | "initials";
}

export function generatedAvatarUri({ seed, variants = "botttsNeutral" }: Props) {
  let avatar;
  if (variants === "botttsNeutral") {
    avatar = createAvatar(botttsNeutral, {
      seed,
    });
  } else {
    avatar = createAvatar(initials, {
      seed,
      fontWeight: 500,
      fontSize: 42,
    });
  }
  return avatar.toDataUri();
}
