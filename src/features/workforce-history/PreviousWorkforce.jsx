import { useEffect, useRef, useState } from 'react';

// The archived document contains the previous exploration without modifying
// its source. Its own isolated runtime retains the original interactions.
export default function PreviousWorkforce() {
  const frame = useRef(null), observer = useRef(null);
  const [height, setHeight] = useState(1100);
  useEffect(() => () => observer.current?.disconnect(), []);

  const measure = () => {
    observer.current?.disconnect();
    const body = frame.current?.contentDocument?.body;
    if (!body) return;
    const resize = () => {
      const measured = Math.ceil(body.getBoundingClientRect().height);
      if (measured > 0) setHeight(Math.min(20000, measured));
    };
    observer.current = new ResizeObserver(resize);
    observer.current.observe(body);
    resize();
  };

  return <iframe ref={frame} className="workforce-original-frame"
    title="Original AI workforce exploration"
    src={`${import.meta.env.BASE_URL}explorations/workforce-original.html`}
    onLoad={measure} style={{ height }} />;
}
