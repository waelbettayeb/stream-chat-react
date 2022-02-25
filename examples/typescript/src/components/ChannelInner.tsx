import React from 'react';

import { Channel, ChannelHeader, MessageList, MessageInput, Thread, Window } from 'stream-chat-react';

export const ChannelInner = () => {
  return (
    <>
      <Channel>
        <Window>
          <ChannelHeader />
          <MessageList />
          <MessageInput grow focus />
        </Window>
        <Thread />
      </Channel>
    </>
  );
};
