import {
  Action,
  ActionPanel,
  closeMainWindow,
  Icon,
  List,
  showHUD,
  showToast,
  Toast,
  useNavigation,
} from "@raycast/api";
import { pipe } from "fp-ts/lib/function";
import * as TE from "fp-ts/TaskEither";
import { useEffect, useState } from "react";

import { Track } from "./util/models";
import { SFSymbols } from "./util/models";
import * as music from "./util/scripts";
import { handleTaskEitherError } from "./util/utils";

const ratings = [0, 1, 2, 3, 4, 5];

export default function SetRating() {
  const [track, setTrack] = useState<Readonly<Track> | null>(null);

  useEffect(() => {
    pipe(
      music.currentTrack.getCurrentTrack(),
      handleTaskEitherError((error) => error, setTrack)
    )();
  }, []);

  return (
    <List isLoading={!track}>
      {ratings.map((rating) => (
        <List.Item key={rating} title={rating.toString()} icon={Icon.Star} actions={<Actions value={rating} />} />
      ))}
    </List>
  );
}

function Actions({ value }: { value: number }) {
  const { pop } = useNavigation();
  const title = SFSymbols.STAR + "  Rate track";

  const handleRating = async () => {
    await pipe(
      music.currentTrack.setCurrentTrackRating(value),
      TE.mapLeft((error) => {
        console.error(error);
        showToast(Toast.Style.Failure, "Could not rate this track");
      }),
      TE.map(() => {
        showHUD(SFSymbols.STAR_FILL.repeat(value));
        closeMainWindow();
      })
    )();

    pop();
  };

  return (
    <ActionPanel>
      <Action title={title} onAction={handleRating} />
    </ActionPanel>
  );
}
