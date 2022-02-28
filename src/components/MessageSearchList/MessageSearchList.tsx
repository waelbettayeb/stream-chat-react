import React, { useRef, useState } from 'react';
import throttle from 'lodash.throttle';

import { MessageSearchResults } from './MessageSearchResults';

import { useChatContext } from '../../context/ChatContext';

import type { StreamMessage } from '../../context/ChannelStateContext';

import type {
  DefaultAttachmentType,
  DefaultChannelType,
  DefaultCommandType,
  DefaultEventType,
  DefaultMessageType,
  DefaultReactionType,
  DefaultUserType,
} from '../../types/types';

// const DEFAULT_FILTERS = {};
// const DEFAULT_OPTIONS = {};
// const DEFAULT_SORT = {};

export type MessageSearchListInputProps<
  // At extends DefaultAttachmentType = DefaultAttachmentType,
  // Ch extends DefaultChannelType = DefaultChannelType,
  // Co extends DefaultCommandType = DefaultCommandType,
  // Ev extends DefaultEventType = DefaultEventType,
  // Me extends DefaultMessageType = DefaultMessageType,
  // Re extends DefaultReactionType = DefaultReactionType,
  // Us extends DefaultUserType<Us> = DefaultUserType
> = {
  inputRef: React.RefObject<HTMLInputElement>;
  onSearch: (event: React.BaseSyntheticEvent) => void;
  query: string;
};

export type MessageSearchListProps<
  // At extends DefaultAttachmentType = DefaultAttachmentType,
  // Ch extends DefaultChannelType = DefaultChannelType,
  // Co extends DefaultCommandType = DefaultCommandType,
  // Ev extends DefaultEventType = DefaultEventType,
  // Me extends DefaultMessageType = DefaultMessageType,
  // Re extends DefaultReactionType = DefaultReactionType,
  // Us extends DefaultUserType<Us> = DefaultUserType
> = {
  /** Custom Input component handling how the message input is rendered */
  SearchInput: React.ComponentType<MessageSearchListInputProps>;
  // will include channel and message filters
};

export const MessageSearchList = <
  At extends DefaultAttachmentType = DefaultAttachmentType,
  Ch extends DefaultChannelType = DefaultChannelType,
  Co extends DefaultCommandType = DefaultCommandType,
  Ev extends DefaultEventType = DefaultEventType,
  Me extends DefaultMessageType = DefaultMessageType,
  Re extends DefaultReactionType = DefaultReactionType,
  Us extends DefaultUserType<Us> = DefaultUserType
>(
  props: MessageSearchListProps,
) => {
  const { SearchInput } = props;

  const { client } = useChatContext<At, Ch, Co, Ev, Me, Re, Us>('MessageSearchList');

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Array<StreamMessage<At, Ch, Co, Ev, Me, Re, Us>>>([]);

  const [searching, setSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const clearState = () => {
    setQuery('');
    setResults([]);
    setSearching(false);
  };

  const getMessages = async (text: string) => {
    if (!text || searching) return;
    setSearching(true);

    try {
      const filters = { members: { $in: [client.userID] } };
      const response = await client.search(filters, text, { limit: 30, offset: 0 });

      const resolved = await Promise.resolve(response);
      const messages = resolved.results.map((result: StreamMessage) => result.message);

      setResults(messages);
    } catch (error) {
      clearState();
      console.error(error);
    }

    setSearching(false);
  };

  const getMessagesThrottled = throttle(getMessages, 200);

  const onSearch = (event: React.BaseSyntheticEvent) => {
    event.preventDefault();
    setQuery(event.target.value);
    getMessagesThrottled(event.target.value);
  };

  return (
    <>
      <SearchInput inputRef={inputRef} onSearch={onSearch} query={query} />
      {query && <MessageSearchResults results={results} searching={searching} />}
    </>
  );
};
