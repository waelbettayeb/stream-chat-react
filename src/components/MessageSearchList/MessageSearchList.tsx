import React, { useRef, useState } from 'react';
import throttle from 'lodash.throttle';

import { useChatContext } from '../../context/ChatContext';

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

export type MessageSearchInputProps<
  // At extends DefaultAttachmentType = DefaultAttachmentType,
  // Ch extends DefaultChannelType = DefaultChannelType,
  // Co extends DefaultCommandType = DefaultCommandType,
  // Ev extends DefaultEventType = DefaultEventType,
  // Me extends DefaultMessageType = DefaultMessageType,
  // Re extends DefaultReactionType = DefaultReactionType,
  Us extends DefaultUserType<Us> = DefaultUserType
> = {
  // channelSearchParams: {
  //   setQuery: React.Dispatch<React.SetStateAction<string>>;
  //   setResults: React.Dispatch<
  //     React.SetStateAction<ChannelOrUserResponse<At, Ch, Co, Ev, Me, Re, Us>[]>
  //   >;
  //   setResultsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  //   setSearching: React.Dispatch<React.SetStateAction<boolean>>;
  // };
  inputRef: React.RefObject<HTMLInputElement>;
  onSearch: (event: React.BaseSyntheticEvent) => void;
  query: string;
  results: any[];
  // searchFunction?: (
  //   params: ChannelSearchFunctionParams<At, Ch, Co, Ev, Me, Re, Us>,
  //   event: React.BaseSyntheticEvent,
  // ) => Promise<void> | void;
};

export type MessageSearchListProps<
  // At extends DefaultAttachmentType = DefaultAttachmentType,
  // Ch extends DefaultChannelType = DefaultChannelType,
  // Co extends DefaultCommandType = DefaultCommandType,
  // Ev extends DefaultEventType = DefaultEventType,
  // Me extends DefaultMessageType = DefaultMessageType,
  // Re extends DefaultReactionType = DefaultReactionType,
  Us extends DefaultUserType<Us> = DefaultUserType
> = {
  /** Custom Input component handling how the message input is rendered */
  Input: React.ComponentType<MessageSearchInputProps<Us>>;
  // query: string;
};

const UnMemoizedMessageSearchList = <
  At extends DefaultAttachmentType = DefaultAttachmentType,
  Ch extends DefaultChannelType = DefaultChannelType,
  Co extends DefaultCommandType = DefaultCommandType,
  Ev extends DefaultEventType = DefaultEventType,
  Me extends DefaultMessageType = DefaultMessageType,
  Re extends DefaultReactionType = DefaultReactionType,
  Us extends DefaultUserType<Us> = DefaultUserType
>(
  props: MessageSearchListProps<Us>,
) => {
  const { Input } = props;

  const { client } = useChatContext<At, Ch, Co, Ev, Me, Re, Us>('MessageSearchList');

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Array<any>>([]);

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

    console.log('text is:', text);

    try {
      const filters = { members: { $in: ['anna-baldy'] } };
      const response = await client.search(filters, text, { limit: 2, offset: 0 });

      const thing = await Promise.resolve(response);

      console.log('messages:', thing);

      setResults(thing);
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

  if (!Input) {
    console.warn(`Needs an Input component`);
  }

  return <Input inputRef={inputRef} onSearch={onSearch} query={query} results={results} />;
};

/**
 * Renders a preview list of Channels, allowing you to select the Channel you want to open
 */
export const MessageSearchList = React.memo(
  UnMemoizedMessageSearchList,
) as typeof UnMemoizedMessageSearchList;
