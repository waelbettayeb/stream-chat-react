import React from 'react';
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
  MessageSearchListInputProps,
  Window,
} from 'stream-chat-react';

// import { ChannelInner } from './components/ChannelInner'

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
  const NewInput = (props: MessageSearchListInputProps) => {
    const { onSearch, query } = props;

    return (
      <input
        onChange={(event: React.BaseSyntheticEvent) => onSearch(event)}
        placeholder='Search for Messages'
        type='text'
        value={query}
    />
    )
  }

  return (
    <Chat client={chatClient} theme={undefined}>
      <MessageSearchList SearchInput={NewInput} />
        <ChannelList filters={filters} sort={sort} options={options} showChannelSearch />
        <Channel>
          <Window>
            <ChannelHeader />
            {/* {query ? <div>{query}</div> : <MessageList />} */}
            <MessageList />
            <MessageInput grow focus />
          </Window>
          <Thread />
        </Channel>
  </Chat>
  )
};

export default App;
