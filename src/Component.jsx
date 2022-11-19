import { useCallback, useEffect, useRef, useState } from "react";
import Details from "./ImageDetails";


export default function Component() {
  const [completeApiRes, setCompleteApiRes] = useState([]);
  const [datToShow, setDataToShow] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

  const observer = useRef();
  const lastElement = useCallback(
    (node) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setStartIndex((previndex) => previndex + 10);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading]
  );

  useEffect(() => {
    if (startIndex === 0) return;
    setIsLoading(true);
    let newDataLength = datToShow.length;
    const id = setTimeout(() => {
      setDataToShow((prev) => {
        const latestData = [
          ...prev,
          ...completeApiRes.slice(startIndex, startIndex + 10)
        ];
        newDataLength = latestData.length;
        return latestData;
      });
      setIsLoading(false);
    }, 800);
    if (newDataLength >= completeApiRes.length) setHasMore(false);

    return () => {
      clearTimeout(id);
    };
  }, [startIndex]);

  useEffect(() => {
    setIsLoading(true);
    fetch("https://jsonplaceholder.typicode.com/photos")
      .then((res) => res.json())
      .then((res) => {
        if (res.length >= 10) setHasMore(true);
        setCompleteApiRes(res);
        setDataToShow(res.slice(0, 10));
      })
      .catch((err) => {
        setHasMore(false);
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  console.log(isLoading, "isLoading");
  return (
    <div className="App">
      {isLoading && <div>Loading...</div>}
      <ol>
        {datToShow.map((e, idx, arr) => (
          <Details
            imageData={e}
            ref={idx === arr.length - 1 && hasMore ? lastElement : null} key={e.id}
          />
        ))}
      </ol>
    </div>
  );
}