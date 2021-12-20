import * as React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import {
  GameSessionCard,
  GameSessionCardPlayerAvatar,
  GameSessionEmptyCard,
  LoadingGameSessionCard,
  LoadingGameSessionCardPlayerAvatar,
} from "~/components/game-session-card";

export default {
  title: "Components/GameSessionCard",
  component: GameSessionCard,
  args: {
    gameSession: {
      id: "game-session-id",
      name: "Hello, world!",
      startedAt: new Date(),
      endedAt: null,
      buyinBb: 100,
      rate: 0.05,
      creatorId: "creator-id",
    },
    myStackBb: 100,
    myBuyins: 2,
    avatars: [
      <GameSessionCardPlayerAvatar
        playerName="John Due"
        playerAvatarUrl="https://i.pravatar.cc/64?img=1"
        key="1"
      />,
      <GameSessionCardPlayerAvatar
        playerName="John Due"
        playerAvatarUrl="https://i.pravatar.cc/64?img=2"
        key="2"
      />,
      <GameSessionCardPlayerAvatar
        playerName="John Due"
        playerAvatarUrl="https://i.pravatar.cc/64?img=3"
        key="3"
      />,
    ],
    className: "w-64",
  },
} as ComponentMeta<typeof GameSessionCard>;

export const Example: ComponentStory<typeof GameSessionCard> = (args) => (
  <GameSessionCard {...args} />
);

export const Loading: ComponentStory<typeof GameSessionCard> = (args) => (
  <LoadingGameSessionCard {...args} />
);

export const PartiallyLoading: ComponentStory<typeof GameSessionCard> = (
  args
) => <GameSessionCard {...args} />;
PartiallyLoading.args = {
  avatars: [
    <LoadingGameSessionCardPlayerAvatar key="1" />,
    <LoadingGameSessionCardPlayerAvatar key="2" />,
    <LoadingGameSessionCardPlayerAvatar key="3" />,
  ],
};

export const Empty: ComponentStory<typeof GameSessionEmptyCard> = (args) => (
  <GameSessionEmptyCard {...args} />
);
