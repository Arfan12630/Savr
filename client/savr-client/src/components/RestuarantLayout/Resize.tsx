import React, { useRef, useEffect } from "react";
import "./Resize.css";

function Resize() {
  const ref = useRef<HTMLDivElement | null>(null);
  const refLeft = useRef<HTMLDivElement | null>(null);
  const refTop = useRef<HTMLDivElement | null>(null);
  const refRight = useRef<HTMLDivElement | null>(null);
  const refBottom = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const resizeableEle = ref.current;
    if (!resizeableEle) return;
    const styles = window.getComputedStyle(resizeableEle);
    let width = parseInt(styles.width, 10);
    let height = parseInt(styles.height, 10);
    let x = 100;
    let y = 100;

  
    // Right resize
    const onMouseMoveRightResize = (event: MouseEvent) => {
      const dx = event.clientX - x;
      x = event.clientX;
      width = width + dx;
      resizeableEle.style.width = `${width}px`;
    };

    const onMouseUpRightResize = () => {
      document.removeEventListener("mousemove", onMouseMoveRightResize);
      document.removeEventListener("mouseup", onMouseUpRightResize);
    };

    const onMouseDownRightResize = (event: MouseEvent) => {
      x = event.clientX;
      resizeableEle.style.left = styles.left;
      resizeableEle.style.right = "";
      document.addEventListener("mousemove", onMouseMoveRightResize);
      document.addEventListener("mouseup", onMouseUpRightResize);
    };

    // Top resize
    const onMouseMoveTopResize = (event: MouseEvent) => {
      const dy = event.clientY - y;
      height = height - dy;
      y = event.clientY;
      resizeableEle.style.height = `${height}px`;
    };

    const onMouseUpTopResize = () => {
      document.removeEventListener("mousemove", onMouseMoveTopResize);
      document.removeEventListener("mouseup", onMouseUpTopResize);
    };

    const onMouseDownTopResize = (event: MouseEvent) => {
      y = event.clientY;
      resizeableEle.style.bottom = styles.bottom;
      resizeableEle.style.top = "";
      document.addEventListener("mousemove", onMouseMoveTopResize);
      document.addEventListener("mouseup", onMouseUpTopResize);
    };

    // Bottom resize
    const onMouseMoveBottomResize = (event: MouseEvent) => {
      const dy = event.clientY - y;
      height = height + dy;
      y = event.clientY;
      resizeableEle.style.height = `${height}px`;
    };

    const onMouseUpBottomResize = () => {
      document.removeEventListener("mousemove", onMouseMoveBottomResize);
      document.removeEventListener("mouseup", onMouseUpBottomResize);
    };

    const onMouseDownBottomResize = (event: MouseEvent) => {
      y = event.clientY;
      resizeableEle.style.top = styles.top;
      resizeableEle.style.bottom = "";
      document.addEventListener("mousemove", onMouseMoveBottomResize);
      document.addEventListener("mouseup", onMouseUpBottomResize);
    };

    // Left resize
    const onMouseMoveLeftResize = (event: MouseEvent) => {
      const dx = event.clientX - x;
      x = event.clientX;
      width = width - dx;
      resizeableEle.style.width = `${width}px`;
    };

    const onMouseUpLeftResize = () => {
      document.removeEventListener("mousemove", onMouseMoveLeftResize);
      document.removeEventListener("mouseup", onMouseUpLeftResize);
    };

    const onMouseDownLeftResize = (event: MouseEvent) => {
      x = event.clientX;
      resizeableEle.style.right = styles.right;
      resizeableEle.style.left = "";
      document.addEventListener("mousemove", onMouseMoveLeftResize);
      document.addEventListener("mouseup", onMouseUpLeftResize);
    };

    // Add mouse down event listener
    const resizerRight = refRight.current;
    const resizerTop = refTop.current;
    const resizerBottom = refBottom.current;
    const resizerLeft = refLeft.current;

    if (resizerRight) resizerRight.addEventListener("mousedown", onMouseDownRightResize);
    if (resizerTop) resizerTop.addEventListener("mousedown", onMouseDownTopResize);
    if (resizerBottom) resizerBottom.addEventListener("mousedown", onMouseDownBottomResize);
    if (resizerLeft) resizerLeft.addEventListener("mousedown", onMouseDownLeftResize);

    return () => {
      if (resizerRight) resizerRight.removeEventListener("mousedown", onMouseDownRightResize);
      if (resizerTop) resizerTop.removeEventListener("mousedown", onMouseDownTopResize);
      if (resizerBottom) resizerBottom.removeEventListener("mousedown", onMouseDownBottomResize);
      if (resizerLeft) resizerLeft.removeEventListener("mousedown", onMouseDownLeftResize);
    };
  }, []);

  return (
    <div className="container">
      <div ref={ref} className="resizeable">
        <div ref={refLeft} className="resizer resizer-l"></div>
        <div ref={refTop} className="resizer resizer-t"></div>
        <div ref={refRight} className="resizer resizer-r"></div>
        <div ref={refBottom} className="resizer resizer-b"></div>
      </div>
    </div>
  );
}

export default Resize;