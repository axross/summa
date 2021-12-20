import { action } from "@storybook/addon-actions";
import * as React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import {
  PlayerTable,
  PlayerTableLoadingRow,
  PlayerTableInputRow,
  PlayerTableRow,
} from "~/components/player-table";

export default {
  title: "Components/PlayerTable",
  component: PlayerTable,
  args: {
    className: "w-full",
  },
} as ComponentMeta<typeof PlayerTable>;

const gameSession = {
  id: "game-session-id",
  name: "Hello, game!",
  startedAt: new Date(),
  endedAt: null,
  buyinBb: 100,
  rate: 0.05,
  creatorId: "creator-id",
};

export const Example: ComponentStory<typeof PlayerTable> = (args) => (
  <PlayerTable {...args}>
    <PlayerTableRow
      gameSession={gameSession}
      player={{
        gameSessionId: gameSession.id,
        userId: "",
        buyins: 1,
        stackBb: 150,
      }}
      user={{
        name: "John Due",
        username: "johndue",
        avatarUrl: "https://i.pravatar.cc/64?img=1",
      }}
    />

    <PlayerTableRow
      gameSession={gameSession}
      player={{
        gameSessionId: gameSession.id,
        userId: "",
        buyins: 1,
        stackBb: 100,
      }}
      user={{
        name: "Foo Bar",
        username: "foobar",
        avatarUrl: "https://i.pravatar.cc/64?img=2",
      }}
      onRemoveClick={action("onRemoveClick")}
      className="border-t border-slate-300"
    />

    <PlayerTableRow
      gameSession={gameSession}
      player={{
        gameSessionId: gameSession.id,
        userId: "",
        buyins: 1,
        stackBb: 50,
      }}
      user={{
        name: "Neo",
        username: "neo",
        avatarUrl: "https://i.pravatar.cc/64?img=3",
      }}
      onRemoveClick={action("onRemoveClick")}
      className="border-t border-slate-300"
    />

    <PlayerTableInputRow
      onChange={action("onChange")}
      onPressEnter={action("onPressEnter")}
      className="border-t border-slate-300"
    />
  </PlayerTable>
);

export const Loading: ComponentStory<typeof PlayerTable> = (args) => (
  <PlayerTable {...args}>
    <PlayerTableLoadingRow />

    <PlayerTableLoadingRow className="border-t border-slate-300" />

    <PlayerTableLoadingRow className="border-t border-slate-300" />

    <PlayerTableInputRow
      onChange={action("onChange")}
      onPressEnter={action("onPressEnter")}
    />
  </PlayerTable>
);

export const PartiallyLoading: ComponentStory<typeof PlayerTable> = (args) => (
  <PlayerTable {...args}>
    <PlayerTableRow
      gameSession={gameSession}
      player={{
        gameSessionId: gameSession.id,
        userId: "",
        buyins: 1,
        stackBb: 100,
      }}
      user={{
        name: "John Due",
        username: "johndue",
        avatarUrl: "https://i.pravatar.cc/64?img=1",
      }}
      onRemoveClick={action("onRemoveClick")}
    />

    <PlayerTableRow
      gameSession={gameSession}
      player={{
        gameSessionId: gameSession.id,
        userId: "",
        buyins: 1,
        stackBb: 100,
      }}
      user={{
        name: "Foo Bar",
        username: "foobar",
        avatarUrl: "https://i.pravatar.cc/64?img=2",
      }}
      onRemoveClick={action("onRemoveClick")}
      className="border-t border-slate-300"
    />

    <PlayerTableLoadingRow className="border-t border-slate-300" />

    <PlayerTableInputRow
      onChange={action("onChange")}
      onPressEnter={action("onPressEnter")}
      className="border-t border-slate-300"
    />
  </PlayerTable>
);
