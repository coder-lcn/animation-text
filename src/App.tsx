import { TransitionEventHandler, useEffect, useRef, useState } from "react";
import "./App.css";

const App = () => {
  const words = useRef(["a", "b"]);
  const [index, setIndex] = useState(-1);

  const onTransitionEnd: TransitionEventHandler<HTMLDivElement> = (e) => {
    console.log(e.target);
  };

  useEffect(() => {
    setTimeout(() => {
      setIndex(0);
    }, 100);
  }, []);

  return (
    <div className="container">
      {words.current.map((item, i) => {
        return (
          <div
            key={i}
            className={`item ${i === index ? "active" : ""}`}
            onTransitionEnd={onTransitionEnd}
          >
            {item.split("").map((item, j) => {
              return <span key={i + j}>{item}</span>;
            })}
          </div>
        );
      })}
    </div>
  );
};

export default App;
