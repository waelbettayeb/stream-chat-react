import React, { DetailedHTMLProps, HTMLAttributes } from 'react';

export type TooltipProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

export const Tooltip = (props: TooltipProps) => <div className='str-chat__tooltip' {...props} />;
