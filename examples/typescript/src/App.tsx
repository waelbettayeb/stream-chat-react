import React, { useState } from 'react';
import { ChannelFilters, ChannelOptions, ChannelSort, StreamChat } from 'stream-chat';
import {
  Chat,
  Channel,
  ChannelHeader,
  ChannelList,
  MessageList,
  MessageInput,
  MessageSearchList,
  Thread,
  Window,
} from 'stream-chat-react';

import '@stream-io/stream-chat-css/dist/css/index.css';
import './App.css';

const apiKey = process.env.REACT_APP_STREAM_KEY as string;
const userId = process.env.REACT_APP_USER_ID as string;
const userToken = process.env.REACT_APP_USER_TOKEN as string;

const filters: ChannelFilters = { type: 'messaging' };
const options: ChannelOptions = { state: true, presence: true, limit: 10 };
const sort: ChannelSort = { last_message_at: -1, updated_at: -1 };

const chatClient = StreamChat.getInstance(apiKey);

if (process.env.REACT_APP_CHAT_SERVER_ENDPOINT) {
  chatClient.setBaseURL(process.env.REACT_APP_CHAT_SERVER_ENDPOINT);
}

chatClient.connectUser({ id: userId }, userToken);

const App = () => {
  const [query, setQuery] = useState('');

  const MessageSearchInput = () => {
    return (
      <input
        onChange={(event: React.BaseSyntheticEvent) => setQuery(event.target.value)}
        placeholder='Search for Messages'
        type='text'
        style={{ height: '200px', display: 'display-block'}}
        value={query}
    />
    )
  }

  return (
    <Chat client={chatClient} theme={undefined}>
        <ChannelList filters={filters} sort={sort} options={options} showChannelSearch />
        <Channel>
          <MessageSearchInput />
          <MessageSearchList {...{ query, setQuery }} />
          <Window>
            <ChannelHeader />
            <MessageList />
            <MessageInput grow focus />
          </Window>
          <Thread />
        </Channel>
  </Chat>
  )
};

export default App;
