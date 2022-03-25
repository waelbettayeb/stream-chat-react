import React from 'react';
import type { MentionProps } from './';

export const DefaultMentionUI = ({ children, mentioned_user: mentionedUser }: MentionProps) => (
  <span className='str-chat__message-mention' data-user-id={mentionedUser.id}>
    {children}
  </span>
);
