import { TransitionEventHandler, useEffect, useRef, useState } from "react";
import "./App.css";

const wait = () => new Promise((resolve) => setTimeout(resolve, 100));

const App = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const words = useRef(["hello", "world", "hahah"]);
  const [index, setIndex] = useState(0);
  const lastIndex = useRef(-1);

  const onTransitionEnd: TransitionEventHandler<HTMLDivElement> = (e) => {
    const target = e.target as HTMLElement;
    const container = target.parentElement as HTMLSpanElement;
    if (container.classList.contains("hide")) {
      container.classList.remove("hide");
    }
  };

  const action = async (item: HTMLDivElement) => {
    if (!item || !item.children) return;

    let i = 0;
    for await (const span of Array.from(item.children)) {
      await wait();
      span.classList.add("show");

      const lastChildren =
        item.parentElement && item.parentElement.children[lastIndex.current];
      if (lastChildren) {
        const nextSpan = lastChildren.children[i];

        if (nextSpan && nextSpan.classList.contains("show")) {
          nextSpan.classList.remove("show");
          nextSpan.classList.add("hide");
        }
      }

      i++;
    }
  };

  useEffect(() => {
    lastIndex.current = index - 1;
    if (lastIndex.current < 0) lastIndex.current = words.current.length - 1;

    setTimeout(() => {
      let i = index;
      i++;
      i %= words.current.length;
      setIndex(i);
    }, 2000);
  }, [index]);

  useEffect(() => {
    if (index < 0) return;
    const target = containerRef.current;
    if (!target) return;

    const item = target.children[index] as HTMLDivElement;
    action(item);
  }, [index]);

  return (
    <div className="container" ref={containerRef}>
      {words.current.map((item, i) => {
        return (
          <div key={i} className="item" onTransitionEnd={onTransitionEnd}>
            {item.split("").map((item, j) => {
              return (
                <span key={i + j}>
                  <i>{item}</i>
                </span>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default App;
