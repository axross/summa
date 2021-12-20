import * as React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Card } from "~/components/card";
import {
  Layout,
  LayoutContent,
  LayoutGlobalNavigationLink,
  LayoutHeader,
  LayoutHeaderTitle,
} from "~/components/layout";

export default {
  title: "Components/Layout",
  component: Layout,
  args: {
    links: [
      <LayoutGlobalNavigationLink to="/lorem" key="link-1">
        Lorem
      </LayoutGlobalNavigationLink>,
      <LayoutGlobalNavigationLink to="/lorem" key="link-2">
        Ipsum
      </LayoutGlobalNavigationLink>,
      <LayoutGlobalNavigationLink to="/auxites" key="link-3">
        Auxites
      </LayoutGlobalNavigationLink>,
    ],
  },
  parameters: {
    layout: "fullscreen",
  },
} as ComponentMeta<typeof Layout>;

export const Example: ComponentStory<typeof Layout> = (args) => (
  <Layout {...args}>
    <LayoutHeader>
      <LayoutHeaderTitle>Hello, page!</LayoutHeaderTitle>
    </LayoutHeader>

    <LayoutContent>
      <Card>Hello, page!</Card>
    </LayoutContent>
  </Layout>
);

export const CustomTitle: ComponentStory<typeof Layout> = (args) => (
  <Layout {...args}>
    <LayoutHeader>
      <LayoutHeaderTitle>Hello, page!</LayoutHeaderTitle>

      <div className="text-slate-500">
        You can put additional content inside the header.
      </div>
    </LayoutHeader>

    <LayoutContent>
      <Card className="h-screen">Hello, page!</Card>
    </LayoutContent>
  </Layout>
);

export const Authenticated = Example.bind({});
Authenticated.args = {
  myself: {
    id: "user-id",
    email: "john@due.dev",
    username: "johndue",
    name: "John Due",
    avatarUrl: "https://i.pravatar.cc/64?img=1",
    isAdmin: true,
  },
};
