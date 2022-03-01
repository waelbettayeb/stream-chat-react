import React, { useCallback } from 'react';

import { Virtuoso } from 'react-virtuoso';

import { usePrependedMessagesCount } from '../MessageList/hooks/usePrependMessagesCount';

import { useTranslationContext } from '../../context/TranslationContext';

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

const PREPEND_OFFSET = 10 ** 7;

export type MessageSearchResultsProps<
  At extends DefaultAttachmentType = DefaultAttachmentType,
  Ch extends DefaultChannelType = DefaultChannelType,
  Co extends DefaultCommandType = DefaultCommandType,
  Ev extends DefaultEventType = DefaultEventType,
  Me extends DefaultMessageType = DefaultMessageType,
  Re extends DefaultReactionType = DefaultReactionType,
  Us extends DefaultUserType<Us> = DefaultUserType
> = {
  clearState: () => void;
  results: StreamMessage<At, Ch, Co, Ev, Me, Re, Us>[];
  searching: boolean;
  selectMessage: (result: StreamMessage<At, Ch, Co, Ev, Me, Re, Us>) => Promise<void> | void;
};

export const MessageSearchResults = <
  At extends DefaultAttachmentType = DefaultAttachmentType,
  Ch extends DefaultChannelType = DefaultChannelType,
  Co extends DefaultCommandType = DefaultCommandType,
  Ev extends DefaultEventType = DefaultEventType,
  Me extends DefaultMessageType = DefaultMessageType,
  Re extends DefaultReactionType = DefaultReactionType,
  Us extends DefaultUserType<Us> = DefaultUserType
>(
  props: MessageSearchResultsProps<At, Ch, Co, Ev, Me, Re, Us>,
) => {
  const { clearState, results, searching, selectMessage } = props;

  const { t } = useTranslationContext('SearchResults');

  const numItemsPrepended = usePrependedMessagesCount(results);

  const messageRenderer = useCallback(
    (messageList: StreamMessage<At, Ch, Co, Ev, Me, Re, Us>[], virtuosoIndex: number) => {
      const streamMessageIndex = virtuosoIndex + numItemsPrepended - PREPEND_OFFSET;

      const message = messageList[streamMessageIndex];

      return (
        <button
          aria-label={`Select Message: ${message?.text || ''}`}
          onClick={() => {
            selectMessage(message);
            clearState();
          }}
        >
          Message: {message.text}, {message.id}{' '}
        </button>
      );
    },
    [],
  );

  if (searching) {
    return <div>{t('Searching...')}</div>;
  }

  if (!results.length) {
    return <div>{t('No results found')}</div>;
  }

  return (
    <Virtuoso
      firstItemIndex={PREPEND_OFFSET - numItemsPrepended}
      initialTopMostItemIndex={results.length ? results.length - 1 : 0}
      itemContent={(i) => messageRenderer(results, i)}
      style={{ display: 'flex', width: '100px', zIndex: 1000 }}
      totalCount={results.length}
    />
  );
};
