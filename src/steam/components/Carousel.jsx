import { useEffect } from "react";
import { useState } from "react";
import "./Carousel.css";

function Carousel({ images, actual, handleGroupChange, autoPlay }) {
  const [current, setCurrent] = useState(0);
  const [autPlay, setAutoPlay] = useState(true);
  let timeOut = null;


  useEffect(() => {
    if (autoPlay) {
      timeOut = setTimeout(() => {
        slideRight();
      }, 6000);
    }

    return () => {
      clearTimeout(timeOut);
    };
  }, [current, autoPlay]);

  const slideRight = () => {
    setCurrent(current === images.length - 1 ? 0 : current + 1);
  };

  const slideLeft = () => {
    setCurrent(current === 0 ? images.length - 1 : current - 1);
  };


  useEffect(() => {
    setCurrent(actual);
  }, [actual]);


  return (
    <div
      className="carousel"
      onMouseEnter={() => {
        setAutoPlay(false);
        clearTimeout(timeOut);
      }}
      onMouseLeave={() => {
        setAutoPlay(true);
      }}
    >

      <div className="carousel_wrapper">
        {images.map((image, index) => (
          <div
            key={index}
            className={
              index === actual
                ? "carousel_card carousel_card-active"
                : "carousel_card"
            }
          >
            <img className="card_image" src={image.image} alt="" />
            <div className="card_overlay">
              <h2 className="card_title">{image.title}</h2>
            </div>
          </div>
        ))}
        <div className="carousel_arrow_left" onClick={slideLeft}>
          &lsaquo;
        </div>
        <div className="carousel_arrow_right" onClick={slideRight}>
          &rsaquo;
        </div>

        <div className="carousel_pagination">
          {images.map((_, index) => {
            return (
              <div
                key={index}
                className={
                  index == actual
                    ? "pagination_dot pagination_dot-active"
                    : "pagination_dot"
                }
                onClick={() => handleGroupChange(index)}
              ></div>
            );
          })}
          </div>
      </div>
    </div>
  );
}

export default Carousel;