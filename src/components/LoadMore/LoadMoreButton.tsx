import React, { useRef } from 'react';
import { LoadingIndicator } from 'react-file-utils';
import { FocusRing, FocusRingScope } from 'react-focus-rings';

export type LoadMoreButtonProps = {
  /** onClick handler load more button. Pagination logic should be executed in this handler. */
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  /** If true, LoadingIndicator is displayed instead of button */
  refreshing?: boolean;
};

const UnMemoizedLoadMoreButton: React.FC<LoadMoreButtonProps> = (props) => {
  const { children = 'Load more', onClick, refreshing } = props;

  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className='str-chat__load-more-button' ref={containerRef} style={{ position: 'relative' }}>
      <FocusRingScope containerRef={containerRef}>
        <FocusRing>
          <button
            aria-label={'Load More Channels'}
            className='str-chat__load-more-button__button'
            data-testid='load-more-button'
            disabled={refreshing}
            onClick={onClick}
          >
            {refreshing ? <LoadingIndicator /> : children}
          </button>
        </FocusRing>
      </FocusRingScope>
    </div>
  );
};

export const LoadMoreButton = React.memo(
  UnMemoizedLoadMoreButton,
) as typeof UnMemoizedLoadMoreButton;
