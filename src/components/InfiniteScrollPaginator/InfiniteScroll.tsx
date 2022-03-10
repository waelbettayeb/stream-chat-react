import React, { useCallback, useEffect, useRef } from 'react';

import { useChannelActionContext } from '../../context/ChannelActionContext';
import { useChannelStateContext } from '../../context/ChannelStateContext';

/**
 * Prevents Chrome hangups
 * See: https://stackoverflow.com/questions/47524205/random-high-content-download-time-in-chrome/47684257#47684257
 */
const mousewheelListener = (event: Event) => {
  if (event instanceof WheelEvent && event.deltaY === 1) {
    event.preventDefault();
  }
};

const calculateTopPosition = (element: HTMLElement | Element | null): number => {
  if (element instanceof HTMLElement) {
    return element.offsetTop + calculateTopPosition(element.offsetParent);
  }
  return 0;
};

/**
 * Computes by recursively summing offsetTop until an element without offsetParent is reached
 */
const calculateOffset = (element: HTMLElement, scrollTop: number) => {
  if (!element) {
    return 0;
  }

  return calculateTopPosition(element) + (element.offsetHeight - scrollTop - window.innerHeight);
};

export type InfiniteScrollProps = {
  className?: string;
  element?: React.ElementType;
  hasMore?: boolean;
  hasMoreNewer?: boolean;
  initialLoad?: boolean;
  isLoading?: boolean;
  isReverse?: boolean;
  listenToScroll?: (offset: number, reverseOffset: number, threshold: number) => void;
  loader?: React.ReactNode;
  loading?: React.ReactNode;
  loadMore?: (limit?: number, direction?: 'older' | 'newer') => void;
  pageStart?: number;
  threshold?: number;
  useCapture?: boolean;
  useWindow?: boolean;
};

export const InfiniteScroll: React.FC<InfiniteScrollProps> = (props) => {
  const {
    children,
    element = 'div',
    hasMore = false,
    hasMoreNewer = false,
    initialLoad = true,
    isLoading = false,
    isReverse = false,
    listenToScroll,
    loader,
    loadMore,
    threshold = 250,
    useCapture = false,
    useWindow = true,
    ...elementProps
  } = props;

  const { setJumpToMessageId } = useChannelActionContext('InfiniteScroll');
  const { jumpToMessageId, listShowingLatestMessages } = useChannelStateContext('InfiniteScroll');

  const scrollComponent = useRef<HTMLElement>();

  const scrollListener = useCallback(() => {
    const element = scrollComponent.current;
    if (!element) return;
    const { parentElement } = element;

    let offset = 0;
    let reverseOffset = 0;
    if (useWindow) {
      const doc = document.documentElement || document.body.parentNode || document.body;
      const scrollTop = window.pageYOffset !== undefined ? window.pageYOffset : doc.scrollTop;
      offset = calculateOffset(element, scrollTop);
      reverseOffset = scrollTop;
    } else if (parentElement) {
      offset = element.scrollHeight - parentElement.scrollTop - parentElement.clientHeight;
      reverseOffset = parentElement.scrollTop;
    }
    if (listenToScroll) {
      listenToScroll(offset, reverseOffset, threshold);
    }

    console.log('listShowingLatestMessages IS:', listShowingLatestMessages);

    // scrollHeight = pixel value of the element.
    // scrollTop = measurement of the distance from the element's top to its topmost visible content
    // clientHeight = number representing the inner height of the element
    // offset - pixels from bottom
    // threshold - 250px

    // Here we make sure the element is visible as well as checking the offset
    if (
      (isReverse ? reverseOffset : offset) < Number(threshold) &&
      element.offsetParent !== null &&
      typeof loadMore === 'function' &&
      hasMore
    ) {
      console.log('in the LOADMORE');
      loadMore();
    }

    // console.log('offset IS:', offset);
    // console.log('threshold:', threshold);
    // console.log('hasMoreNewer:', hasMoreNewer);
    // console.log('!listShowingLatestMessages IS:', !listShowingLatestMessages);

    /// yikes
    // if (
    //   scrollTop === 0 &&
    //   offset < 10 &&
    //   element.offsetParent !== null &&
    //   typeof loadMore === 'function' &&
    //   !listShowingLatestMessages &&
    //   hasMoreNewer
    // ) {
    //   console.log('*********NEWER*******in the loadmore NEWER***');
    //   loadMore(undefined, 'newer');
    // }
  }, [hasMore, hasMoreNewer, useWindow, isReverse, threshold, listenToScroll, loadMore]);

  useEffect(() => {
    const scrollElement = useWindow ? window : scrollComponent.current?.parentNode;
    if (isLoading || !scrollElement) {
      return () => undefined;
    }

    scrollElement.addEventListener('scroll', scrollListener, useCapture);
    scrollElement.addEventListener('resize', scrollListener, useCapture);

    if (initialLoad) {
      scrollListener();
    }

    return () => {
      scrollElement.removeEventListener('scroll', scrollListener, useCapture);
      scrollElement.removeEventListener('resize', scrollListener, useCapture);
    };
  }, [initialLoad, isLoading, scrollListener, useCapture, useWindow]);

  useEffect(() => {
    const scrollElement = useWindow ? window : scrollComponent.current?.parentNode;
    if (scrollElement) {
      scrollElement.addEventListener('wheel', mousewheelListener, { passive: false });
    }
    return () => {
      if (scrollElement) {
        scrollElement.removeEventListener('wheel', mousewheelListener, useCapture);
      }
    };
  }, [useCapture, useWindow]);

  useEffect(() => {
    if (jumpToMessageId) {
      console.log('in the scroll into view');
      document
        .getElementById(jumpToMessageId)
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    return () => {
      setJumpToMessageId(undefined);
    };
  }, [jumpToMessageId]);

  const attributes = {
    ...elementProps,
    ref: (element: HTMLElement) => {
      scrollComponent.current = element;
    },
  };

  const childrenArray = [children];
  if (isLoading && loader) {
    if (isReverse || hasMoreNewer) {
      childrenArray.unshift(loader);
    } else {
      childrenArray.push(loader);
    }
  }
  return React.createElement(element, attributes, childrenArray);
};
