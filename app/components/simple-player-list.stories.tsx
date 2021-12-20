import { action } from "@storybook/addon-actions";
import * as React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import {
  LoadingSimplePlayerListRow,
  SimplePlayerList,
  SimplePlayerListEmptyRow,
  SimplePlayerListInputRow,
  SimplePlayerListRow,
} from "~/components/simple-player-list";

export default {
  title: "Components/SimplePlayerList",
  component: SimplePlayerList,
  args: {
    className: "w-96",
  },
} as ComponentMeta<typeof SimplePlayerList>;

export const Example: ComponentStory<typeof SimplePlayerList> = (args) => (
  <SimplePlayerList {...args}>
    <SimplePlayerListRow
      user={{
        name: "John Due",
        username: "johndue",
        avatarUrl: "https://i.pravatar.cc/64?img=1",
      }}
      onRemoveClick={action("onRemoveClick")}
    />

    <SimplePlayerListRow
      user={{
        name: "Foo Bar",
        username: "foobar",
        avatarUrl: "https://i.pravatar.cc/64?img=2",
      }}
      onRemoveClick={action("onRemoveClick")}
      className="border-t border-slate-300"
    />

    <SimplePlayerListRow
      user={{
        name: "Neo",
        username: "neo",
        avatarUrl: "https://i.pravatar.cc/64?img=3",
      }}
      onRemoveClick={action("onRemoveClick")}
      className="border-t border-slate-300"
    />

    <SimplePlayerListInputRow
      onChange={action("onChange")}
      onPressEnter={action("onPressEnter")}
      className="border-t border-slate-300"
    />
  </SimplePlayerList>
);

export const Loading: ComponentStory<typeof SimplePlayerList> = (args) => (
  <SimplePlayerList {...args}>
    <LoadingSimplePlayerListRow />

    <LoadingSimplePlayerListRow className="border-t border-slate-300" />

    <LoadingSimplePlayerListRow className="border-t border-slate-300" />

    <SimplePlayerListInputRow
      onChange={action("onChange")}
      onPressEnter={action("onPressEnter")}
    />
  </SimplePlayerList>
);

export const PartiallyLoading: ComponentStory<typeof SimplePlayerList> = (
  args
) => (
  <SimplePlayerList {...args}>
    <SimplePlayerListRow
      user={{
        name: "John Due",
        username: "johndue",
        avatarUrl: "https://i.pravatar.cc/64?img=1",
      }}
      onRemoveClick={action("onRemoveClick")}
    />

    <SimplePlayerListRow
      user={{
        name: "Foo Bar",
        username: "foobar",
        avatarUrl: "https://i.pravatar.cc/64?img=2",
      }}
      onRemoveClick={action("onRemoveClick")}
      className="border-t border-slate-300"
    />

    <LoadingSimplePlayerListRow className="border-t border-slate-300" />

    <SimplePlayerListInputRow
      onChange={action("onChange")}
      onPressEnter={action("onPressEnter")}
      className="border-t border-slate-300"
    />
  </SimplePlayerList>
);

export const Empty: ComponentStory<typeof SimplePlayerList> = (args) => (
  <SimplePlayerList {...args}>
    <SimplePlayerListEmptyRow />
  </SimplePlayerList>
);
