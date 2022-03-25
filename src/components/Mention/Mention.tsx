import React, { PropsWithChildren } from 'react';
import type { UserResponse } from 'stream-chat';

import { useComponentContext } from '../../context';
import { DefaultMentionUI } from './';
import type { DefaultStreamChatGenerics } from '../../types/types';

export type MentionProps<
  StreamChatGenerics extends DefaultStreamChatGenerics = DefaultStreamChatGenerics
> = PropsWithChildren<{
  mentioned_user: UserResponse<StreamChatGenerics>;
}>;

export const Mention = <
  StreamChatGenerics extends DefaultStreamChatGenerics = DefaultStreamChatGenerics
>(
  props: PropsWithChildren<MentionProps<StreamChatGenerics>>,
) => {
  const { Mention: MentionUI = DefaultMentionUI } = useComponentContext();

  return <MentionUI {...props} />;
};
