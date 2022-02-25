import React from 'react';

import { VirtualizedMessageList } from '../MessageList/VirtualizedMessageList';

import { useTranslationContext } from '../../context/TranslationContext';

export type MessageSearchResultsProps<
  //   At extends DefaultAttachmentType = DefaultAttachmentType,
  //   Ch extends DefaultChannelType = DefaultChannelType,
  //   Co extends DefaultCommandType = DefaultCommandType,
  //   Ev extends DefaultEventType = DefaultEventType,
  //   Me extends DefaultMessageType = DefaultMessageType,
  //   Re extends DefaultReactionType = DefaultReactionType,
  //   Us extends DefaultUserType<Us> = DefaultUserType
> = {
  results: any[];
  searching: boolean;
};

export const MessageSearchResults =
  // <
  //   At extends DefaultAttachmentType = DefaultAttachmentType,
  //   Ch extends DefaultChannelType = DefaultChannelType,
  //   Co extends DefaultCommandType = DefaultCommandType,
  //   Ev extends DefaultEventType = DefaultEventType,
  //   Me extends DefaultMessageType = DefaultMessageType,
  //   Re extends DefaultReactionType = DefaultReactionType,
  //   Us extends DefaultUserType<Us> = DefaultUserType
  (props: MessageSearchResultsProps) => {
    const { results, searching } = props;

    const { t } = useTranslationContext('SearchResults');

    if (searching) {
      return <div>{t('Searching...')}</div>;
    }

    if (!results.length) {
      return <div>{t('No results found')}</div>;
    }

    return <VirtualizedMessageList messages={results} />;
  };
