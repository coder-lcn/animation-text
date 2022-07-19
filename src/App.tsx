import { TransitionEventHandler, useCallback, useEffect, useRef, useState } from "react";
import "./App.css";

// 开始切换下一个单词的间隔时间
const word_wait = 200;

// 切换到下一个字母的间隔时间
const letter_wait = 100;

const wait = (t: number) => new Promise(resolve => setTimeout(resolve, t))

const App = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const words = useRef(["hellooooo", "world", "hahah"]);
  const [index, setIndex] = useState(0);
  const lastIndex = useRef(-1);
  const indexRef = useRef(0);

  const onTransitionEnd: TransitionEventHandler<HTMLDivElement> = useCallback(async (e) => {
    const target = e.target as HTMLElement;
    const container = target.parentElement as HTMLSpanElement;

    if (container.classList.contains("hide")) {
      container.classList.remove("hide");
    }

    if (container.classList.contains('show')) {
      if (container.parentElement && container === container.parentElement.lastElementChild) {
        let i = indexRef.current + 1;
        i %= words.current.length;
        await wait(word_wait)
        setIndex(i)
      }
    }
  }, []);

  const action = async (item: HTMLDivElement) => {
    if (!item || !item.children) return;

    let i = 0;
    const lastChildren =
      item.parentElement && item.parentElement.children[lastIndex.current];

    for await (const span of Array.from(item.children)) {
      await wait(letter_wait);
      span.classList.add("show");


      if (lastChildren) {
        const nextSpan = lastChildren.children[i];

        if (nextSpan && nextSpan.classList.contains("show")) {
          nextSpan.classList.remove("show");
          nextSpan.classList.add("hide");
        }
      }

      i++;
    }

    if (lastChildren) {
      const loss = Array.from(lastChildren.children).filter(item => item.classList.contains('show'))
      for (const nextSpan of loss) {
        nextSpan.classList.remove("show");
        nextSpan.classList.add("hide");
      }
    }
  };

  // useEffect(() => {
  //   lastIndex.current = index - 1;
  //   if (lastIndex.current < 0) lastIndex.current = words.current.length - 1;

  //   setTimeout(() => {
  //     let i = index;
  //     i++;
  //     i %= words.current.length;
  //     setIndex(i);
  //   }, 2000);
  // }, [index]);

  useEffect(() => {
    indexRef.current = index;

    if (index < 0) return;
    const target = containerRef.current;
    if (!target) return;

    lastIndex.current = index - 1;
    if (lastIndex.current < 0) lastIndex.current = words.current.length - 1;

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
