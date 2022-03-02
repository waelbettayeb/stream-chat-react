import React, { useEffect, useState } from 'react';
import throttle from 'lodash.throttle';

import { MessageSearchResults } from './MessageSearchResults';

import { useChannelStateContext } from '../../context/ChannelStateContext';
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
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
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
  const { query, setQuery } = props;

  const { channel, client } = useChatContext<At, Ch, Co, Ev, Me, Re, Us>('MessageSearchList');
  const { selectMessageFromSearch } = useChannelStateContext('MessageSearchList');

  const [results, setResults] = useState<Array<StreamMessage<At, Ch, Co, Ev, Me, Re, Us>>>([]);
  const [searching, setSearching] = useState(false);

  const clearState = () => {
    setQuery('');
    setResults([]);
    setSearching(false);
  };

  const getMessages = async (text: string) => {
    if (!text || searching) return;
    setSearching(true);
    setResults([]);

    try {
      const filters = { id: channel.id, members: { $in: [client.userID] } };
      const response = await client.search(filters, text);

      const resolved = await Promise.resolve(response);
      const messages = resolved.results.map((result: StreamMessage) => result.message);

      setResults(messages);
    } catch (error) {
      clearState();
      console.error(error);
    }

    setSearching(false);
  };

  useEffect(() => {
    const getMessagesThrottled = throttle(getMessages, 200);

    getMessagesThrottled(query);
  }, [query]);

  return (
    <>
      {query && (
        <MessageSearchResults
          clearState={clearState}
          results={results}
          searching={searching}
          selectMessage={selectMessageFromSearch}
        />
      )}
    </>
  );
};
