/*
 * React Virtual implementation
 * Written: 12/9/21
 */

import React, { useLayoutEffect, useRef, useCallback, useEffect } from "react";
import { useVirtual } from "react-virtual";

import "./window.css";

const ItemMeasurer = ({
  children,
  measure,
  ...additionalProps
}: {
  children: any;
  measure: any;
  style: React.CSSProperties;
}) => {
  const resizeObserverRef = React.useRef<ResizeObserver | null>(null);
  const elementRef = React.useRef<Element | null>(null);
  const measureRef = React.useRef(measure);

  measureRef.current = measure;

  const refSetter = useCallback((el) => {
    // Forcibly reset the resizeObserver
    const resizeObserver = resizeObserverRef.current;

    if (resizeObserver !== null && elementRef.current !== null) {
      resizeObserver.unobserve(elementRef.current);
    }

    elementRef.current = el;

    if (resizeObserver !== null && elementRef.current !== null) {
      resizeObserver.observe(elementRef.current);
    }
  }, []);

  useLayoutEffect(() => {
    const update = () => {
      measureRef.current(elementRef.current);
    };

    update(); // Synchronize measurements for initial render

    const resizeObserver = resizeObserverRef.current
      ? resizeObserverRef.current
      : new ResizeObserver(update);

    const element = elementRef.current;
    if (element !== null) {
      resizeObserver.observe(element);
    }
    resizeObserverRef.current = resizeObserver;

    return () => {
      if (resizeObserver?.disconnect) {
        resizeObserver.disconnect();
      } else {
        console.error(
          "[window.tsx] - Unable to disconnect resizeObserver, something went very wrong!"
        );
      }
    };
  }, []);

  return (
    <div className="f-window-item" ref={refSetter} {...additionalProps}>
      {children}
    </div>
  );
};

export default function Window(props: {
  items: any[];
  children: ({ index }: { index: number }) => JSX.Element;
  autoScrollToBottom?: boolean;
}) {
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtual({
    size: props.items.length,
    // useObserver: useSizeObserver,
    parentRef: parentRef,
  });

  useEffect(() => {
    if (props.autoScrollToBottom) {
      // ! BUG: This doesn't quite work, probably since react-virtual has a hard time
      // telling how tall each object is without giving it a rough estimate.
      rowVirtualizer.scrollToIndex(props.items.length - 1);
    }
  }, [props, rowVirtualizer]);

  return (
    <>
      <div ref={parentRef} className="f-window">
        <div
          style={{
            height: `${rowVirtualizer.totalSize}px`,
            width: "100%",
            position: "relative",
          }}
        >
          {rowVirtualizer.virtualItems.map((virtualRow) => (
            <ItemMeasurer
              key={virtualRow.index}
              measure={virtualRow.measureRef}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                // height: `${rows[virtualRow.index]}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              {props.children({ index: virtualRow.index })}
            </ItemMeasurer>
          ))}
        </div>
      </div>
    </>
  );
}
