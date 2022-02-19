import React, { useEffect, useMemo, useState } from 'react';

import { ChannelHeader, MessageList, MessageInput, Thread, Window, MessageSearchList, useChannelStateContext } from 'stream-chat-react';

export const ChannelInner = () => {
  const { channel } = useChannelStateContext();
  console.log(channel);

  const [results, setResults] = useState('');

  let thing = useMemo(() => results, [results]);

  const NewInput = (props: any) => {
    const { onSearch, query, results } = props;

    thing = results.results;

    console.log('results in input:', results.results);

    return (
      <input
        onChange={(event: React.BaseSyntheticEvent) => onSearch(event)}
        placeholder='Search'
        type='text'
        value={query}
        results={results}
    />
    )
  }

  useEffect(() => {
    // @ts-ignore
    setResults(thing);
  }, [thing]);

  return (
    <>
    <MessageSearchList Input={NewInput} />
      <Window>
        <ChannelHeader />
        {results ? <div>results</div> : <MessageList />}
        <MessageInput grow focus />
      </Window>
      <Thread />
    </>
  );
};
