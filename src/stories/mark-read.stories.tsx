/* eslint-disable @typescript-eslint/no-explicit-any */
import '@stream-io/stream-chat-css/dist/css/index.css';
import React from 'react';
import { ChannelSort, StreamChat } from 'stream-chat';
import { v4 as uuid } from 'uuid';
import {
  Channel,
  ChannelHeader,
  ChannelList,
  ChannelPreview,
  ChannelPreviewProps,
  ChannelPreviewUIComponentProps,
  MessageList,
  useChannelStateContext,
  Window,
} from '../index';
import { apiKey, ConnectedUser, ConnectedUserProps, StreamChatGenerics } from './utils';

const channelId = import.meta.env.E2E_ADD_MESSAGE_CHANNEL;
if (!channelId || typeof channelId !== 'string') {
  throw new Error('expected ADD_MESSAGE_CHANNEL');
}

const Controls = () => {
  const { channel } = useChannelStateContext();

  return (
    <div>
      <button data-testid='truncate' onClick={() => channel.truncate()}>
        Truncate
      </button>
      <button
        data-testid='add-message'
        onClick={() =>
          channel.sendMessage({
            text: uuid(),
          })
        }
      >
        Add message
      </button>
    </div>
  );
};

// Sort in reverse order to avoid auto-selecting unread channel
const sort: ChannelSort = { last_updated: 1 };

const chatClient = StreamChat.getInstance<StreamChatGenerics>(apiKey);

const Custom = ({
  activeChannel,
  channel,
  displayTitle,
  setActiveChannel,
  unread,
  watchers,
}: ChannelPreviewUIComponentProps) => {
  const avatarName =
    displayTitle || channel.state.messages[channel.state.messages.length - 1]?.user?.id;

  return (
    <div
      data-testid={`channel-${channel.id}`}
      onClick={() => setActiveChannel?.(channel, watchers)}
      style={{ background: channel.cid === activeChannel?.cid ? '#fff' : 'initial' }}
    >
      <span>{avatarName}</span> || <span data-testid='unread-count'>{unread}</span>
    </div>
  );
};

const CustomPreview = (props: ChannelPreviewProps) => (
  <ChannelPreview {...props} Preview={Custom} />
);

const WrappedConnectedUser = ({ token, userId }: Omit<ConnectedUserProps, 'children'>) => (
  <ConnectedUser client={chatClient} token={token} userId={userId}>
    <ChannelList
      filters={{ members: { $in: [userId] }, name: { $autocomplete: 'mr-channel' } }}
      Preview={CustomPreview}
      setActiveChannelOnMount={false}
      sort={sort}
    />
    <Channel>
      <Window>
        <ChannelHeader />
        <MessageList />
        <Controls />
      </Window>
    </Channel>
  </ConnectedUser>
);

export const User1 = () => {
  const userId = import.meta.env.E2E_TEST_USER_1;
  const token = import.meta.env.E2E_TEST_USER_1_TOKEN;
  if (!userId || typeof userId !== 'string') {
    throw new Error('expected TEST_USER_1');
  }
  if (!token || typeof token !== 'string') {
    throw new Error('expected TEST_USER_1_TOKEN');
  }
  return <WrappedConnectedUser token={token} userId={userId} />;
};

export const User2 = () => {
  const userId = import.meta.env.E2E_TEST_USER_2;
  const token = import.meta.env.E2E_TEST_USER_2_TOKEN;
  if (!userId || typeof userId !== 'string') {
    throw new Error('expected TEST_USER_2');
  }
  if (!token || typeof token !== 'string') {
    throw new Error('expected TEST_USER_2_TOKEN');
  }
  return <WrappedConnectedUser token={token} userId={userId} />;
};
