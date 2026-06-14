import React, { useState, useRef } from "react";
import "./Step2Tent.css";

const Step2Tent = () => {
  const [appliedItems, setAppliedItems] = useState({
    clothes: false,
    cocoa: false,
    blanket: false,
  });
  const [showSparkle, setShowSparkle] = useState(false);
  const [wrongShake, setWrongShake] = useState(null);
  const [message, setMessage] = useState(
    "민수를 따뜻하게 해 주려고 해요. 알맞은 물건을 골라보세요!"
  );

  const rustleSound = useRef(new Audio("/sounds/rustle.mp3"));
  const waterSound = useRef(new Audio("/sounds/pour_water.mp3"));
  const wrongSound = useRef(new Audio("/sounds/wrong_buzzer.mp3"));
  const praiseVoice = useRef(new Audio("/sounds/praise_female_voice.mp3"));

  const gameItems = [
    {
      id: "clothes",
      type: "correct",
      img: "/iimages/clothes_item.png",
      alt: "두꺼운 겉옷",
    },
    {
      id: "icecream",
      type: "wrong",
      img: "/iimages/icecream_item.png",
      alt: "차가운 아이스크림",
    },
    {
      id: "cocoa",
      type: "correct",
      img: "/iimages/cocoa_cup.png",
      alt: "따뜻한 코코아",
    },
    { id: "fan", type: "wrong", img: "/iimages/fan_item.png", alt: "선풍기" },
    {
      id: "blanket",
      type: "correct",
      img: "/iimages/blanket_item.png",
      alt: "포근한 담요",
    },
  ];

  const handleItemClick = (item) => {
    if (item.type === "wrong") {
      wrongSound.current.play();
      setWrongShake(item.id);
      setMessage("앗! 그걸 사용하면 민수가 더 추워하려고 해요!");
      setTimeout(() => setWrongShake(null), 500);
      return;
    }

    if (appliedItems[item.id]) return;

    setShowSparkle(true);
    setTimeout(() => setShowSparkle(false), 800);
    setMessage("좋았어요! 민수가 조금 더 따뜻해졌네요.");

    setAppliedItems((prev) => {
      const newState = { ...prev, [item.id]: true };

      if (item.id === "clothes" || item.id === "blanket") {
        rustleSound.current.play();
      } else if (item.id === "cocoa") {
        waterSound.current.play();
      }

      if (newState.clothes && newState.cocoa && newState.blanket) {
        setMessage("우와, 텐트 안이 정말 따뜻해!");
        setTimeout(() => praiseVoice.current.play(), 1000);
      }

      return newState;
    });
  };

  const correctCount = Object.values(appliedItems).filter(Boolean).length;
  const isComplete = correctCount === 3;

  return (
    <div className={`game-container light-level-${correctCount}`}>
      <div className="tent-background">
        <div className="lantern-glow"></div>

        <div className="instruction-banner">
          <h2>{message}</h2>
        </div>

        <div
          className={`minsu-character ${
            correctCount === 0 ? "shivering" : "warm"
          }`}
        >
          <img
            src="/iimages/minsu_fullbody_base.png"
            alt="민수 전신"
            className="base-img"
          />

          {appliedItems.clothes && (
            <img
              src="/iimages/minsu_clothes_overlay.png"
              alt="겉옷 입은 모습"
              className="overlay-img clothes-overlay"
            />
          )}
          {appliedItems.blanket && (
            <img
              src="/iimages/minsu_blanket_overlay.png"
              alt="담요 덮은 모습"
              className="overlay-img blanket-overlay"
            />
          )}

          {appliedItems.cocoa && (
            <div className="minsu-holding-cocoa">
              <img src="/iimages/cocoa_cup.png" alt="손에 든 코코아" />
              <div className="cocoa-steam"></div>
            </div>
          )}
        </div>

        <div className="item-inventory">
          {gameItems.map((item) => (
            <div
              key={item.id}
              className={`item ${appliedItems[item.id] ? "applied" : ""} ${
                wrongShake === item.id ? "shake" : ""
              }`}
              onClick={() => handleItemClick(item)}
            >
              <img src={item.img} alt={item.alt} />
            </div>
          ))}
        </div>

        {showSparkle && <div className="sparkle-effect">✨</div>}

        {isComplete && <div className="success-overlay">🎉 미션 성공! 🎉</div>}
      </div>
    </div>
  );
};

export default Step2Tent;
