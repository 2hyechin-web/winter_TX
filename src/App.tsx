// @ts-nocheck
import React, { useState, useRef, useEffect } from "react";

// ==========================================
// ❄️ 1단계: 겨울 폭풍 대비하기
// ==========================================
function Step1({ onNextStep, scale }: any) {
  const [matches, setMatches] = useState({
    pipe: false,
    table: false,
    flashlight: false,
  });
  const [selectedItem, setSelectedItem] = useState(null);

  const tadaSound = useRef(
    typeof Audio !== "undefined" ? new Audio("/sounds/tada.mp3") : null
  );
  const popSound = useRef(
    typeof Audio !== "undefined" ? new Audio("/sounds/pop.mp3") : null
  );

  const handleDragStart = (e, item) => {
    e.dataTransfer.setData("item", item);
    setSelectedItem(null);
  };

  const handleDragOver = (e) => e.preventDefault();

  const checkMatch = (item, target) => {
    if (
      (item === "cloth" && target === "pipe") ||
      (item === "food" && target === "table") ||
      (item === "battery" && target === "flashlight")
    ) {
      if (popSound.current) popSound.current.play().catch(() => {});
      setMatches((prev) => ({ ...prev, [target]: true }));
      return true;
    }
    return false;
  };

  const handleDrop = (e, target) => {
    e.preventDefault();
    const item = e.dataTransfer.getData("item");
    checkMatch(item, target);
  };

  const handleItemClick = (item) => {
    setSelectedItem(selectedItem === item ? null : item);
  };

  const handleZoneClick = (target) => {
    if (selectedItem) {
      checkMatch(selectedItem, target);
      setSelectedItem(null);
    }
  };

  const isComplete = matches.pipe && matches.table && matches.flashlight;

  useEffect(() => {
    if (isComplete && tadaSound.current) {
      tadaSound.current.play().catch(() => {});
    }
  }, [isComplete]);

  return (
    <div className="s1-container">
      {/* 💡 1단계 컨텐츠 전체를 감싸서 비율에 맞춰 크기가 줄어들게 합니다 */}
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "center center",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div className="s1-header">
          <h1 className="s1-title">
            <span>❄️</span> 1단계: 겨울 폭풍 대비하기
          </h1>
          <p className="s1-subtitle">
            안전하게 대비하려고 해요. 필요한 물건을 알맞은 곳에 놓아주세요!
          </p>
        </div>

        {!isComplete && (
          <p className="s1-helper-text">
            (아이템을 드래그하거나, 터치한 후 목표를 터치하세요)
          </p>
        )}

        <div className="s1-zones-wrap">
          <div
            onClick={() => handleZoneClick("pipe")}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, "pipe")}
            className={`s1-zone ${matches.pipe ? "s1-zone-matched" : ""} ${
              selectedItem && !matches.pipe ? "s1-zone-pulse" : ""
            }`}
          >
            <div className="s1-zone-icon">{matches.pipe ? "🧣🚰" : "🚰"}</div>
            <span className="s1-zone-text">야외 수도관</span>
          </div>
          <div
            onClick={() => handleZoneClick("table")}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, "table")}
            className={`s1-zone ${matches.table ? "s1-zone-matched" : ""} ${
              selectedItem && !matches.table ? "s1-zone-pulse" : ""
            }`}
          >
            <div className="s1-zone-icon">{matches.table ? "🍞🍽️" : "🍽️"}</div>
            <span className="s1-zone-text">식탁 위</span>
          </div>
          <div
            onClick={() => handleZoneClick("flashlight")}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, "flashlight")}
            className={`s1-zone ${
              matches.flashlight ? "s1-zone-matched" : ""
            } ${selectedItem && !matches.flashlight ? "s1-zone-pulse" : ""}`}
          >
            <div className="s1-zone-icon">
              {matches.flashlight ? "🔋🔦" : "🔦"}
            </div>
            <span className="s1-zone-text">손전등</span>
          </div>
        </div>

        {!isComplete && (
          <div className="s1-items-wrap">
            {!matches.pipe && (
              <div
                draggable
                onDragStart={(e) => handleDragStart(e, "cloth")}
                onClick={() => handleItemClick("cloth")}
                className={`s1-item ${
                  selectedItem === "cloth" ? "s1-item-selected" : ""
                }`}
                title="두툼한 천"
              >
                🧣
              </div>
            )}
            {!matches.table && (
              <div
                draggable
                onDragStart={(e) => handleDragStart(e, "food")}
                onClick={() => handleItemClick("food")}
                className={`s1-item ${
                  selectedItem === "food" ? "s1-item-selected" : ""
                }`}
                title="음식"
              >
                🍞
              </div>
            )}
            {!matches.flashlight && (
              <div
                draggable
                onDragStart={(e) => handleDragStart(e, "battery")}
                onClick={() => handleItemClick("battery")}
                className={`s1-item ${
                  selectedItem === "battery" ? "s1-item-selected" : ""
                }`}
                title="새 건전지"
              >
                🔋
              </div>
            )}
          </div>
        )}

        {isComplete && (
          <div className="s1-success-wrap">
            <div className="s1-success-msg">
              ✅ 참 잘했어요! 폭풍 대비를 완벽하게 끝냈어요.
            </div>
            <button className="s1-next-btn" onClick={onNextStep}>
              2단계로 이동하기 ➡️
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// 🏕️ 2단계: 체온 유지하기
// ==========================================
function Step2({ onNextStep, scale }: any) {
  const [appliedItems, setAppliedItems] = useState({
    clothes: false,
    cocoa: false,
    blanket: false,
  });
  const [activeClothing, setActiveClothing] = useState(null);
  const [showSparkle, setShowSparkle] = useState(false);
  const [wrongShake, setWrongShake] = useState(null);
  const [message, setMessage] = useState(
    "2단계: 너무 추워요! 민수를 따뜻하게 해 줄 물건을 골라보세요!"
  );
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);

  const rustleSound = useRef(
    typeof Audio !== "undefined" ? new Audio("/sounds/rustle.mp3") : null
  );
  const waterSound = useRef(
    typeof Audio !== "undefined" ? new Audio("/sounds/pour_water.mp3") : null
  );
  const wrongSound = useRef(
    typeof Audio !== "undefined" ? new Audio("/sounds/wrong_buzzer.mp3") : null
  );
  const tadaSound = useRef(
    typeof Audio !== "undefined" ? new Audio("/sounds/tada.mp3") : null
  );

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

  const correctCount = Object.values(appliedItems).filter(Boolean).length;
  const isComplete = correctCount === 3;

  useEffect(() => {
    if (isComplete) {
      if (tadaSound.current) tadaSound.current.play().catch(() => {});
      setShowSuccessOverlay(true);
      const timer = setTimeout(() => setShowSuccessOverlay(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [isComplete]);

  const handleItemClick = (item) => {
    if (item.type === "wrong") {
      if (wrongSound.current) wrongSound.current.play().catch(() => {});
      setWrongShake(item.id);
      setMessage("앗! 그걸 사용하면 민수가 더 추워하려고 해요!");
      setTimeout(() => setWrongShake(null), 500);
      return;
    }
    if (appliedItems[item.id]) return;

    setShowSparkle(true);
    setTimeout(() => setShowSparkle(false), 800);
    setMessage("좋았어요! 민수가 조금 더 따뜻해졌네요.");

    if (item.id === "clothes" || item.id === "blanket") {
      setActiveClothing(item.id);
    }

    setAppliedItems((prev) => {
      const newState = { ...prev, [item.id]: true };
      if (item.id === "clothes" || item.id === "blanket") {
        if (rustleSound.current) rustleSound.current.play().catch(() => {});
      } else if (item.id === "cocoa") {
        if (waterSound.current) waterSound.current.play().catch(() => {});
      }
      if (newState.clothes && newState.cocoa && newState.blanket) {
        setMessage("우와, 텐트 안이 정말 따뜻해! 다음 단계로 가볼까요?");
      }
      return newState;
    });
  };

  let currentMinsuImg = "/iimages/minsu_fullbody_base.png";
  if (activeClothing === "blanket") {
    currentMinsuImg = "/iimages/minsu_blanket_overlay.png";
  } else if (activeClothing === "clothes") {
    currentMinsuImg = "/iimages/minsu_clothes_overlay.png";
  }

  return (
    <div className={`game-container light-level-${correctCount}`}>
      {/* 💡 CSS transform scale을 적용하여 창 크기에 맞게 텐트 크기가 스마트하게 줄어듭니다! */}
      <div className="tent-background" style={{ transform: `scale(${scale})` }}>
        <div className="lantern-glow"></div>
        <div className="instruction-banner">
          <h2>{message}</h2>
        </div>

        <div
          className={`minsu-character ${
            correctCount === 0 ? "shivering" : "warm"
          }`}
        >
          <img src={currentMinsuImg} alt="민수" className="base-img" />
        </div>

        {appliedItems.cocoa && (
          <div className="cocoa-on-table">
            <img src="/iimages/cocoa_cup.png" alt="나이트 스탠드 위 코코아" />
            <div className="cocoa-steam"></div>
          </div>
        )}

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

        {showSuccessOverlay && (
          <div className="success-overlay">🎉 2단계 성공! 🎉</div>
        )}

        {isComplete && (
          <button className="floating-next-btn" onClick={onNextStep}>
            3단계로 이동 ➡️
          </button>
        )}
      </div>
    </div>
  );
}

// ==========================================
// 🔦 3단계: 배도 든든, 마음도 튼튼!
// ==========================================
function Step3({ onRestart, scale }) {
  const [foodItem, setFoodItem] = useState(null);
  const [playItem, setPlayItem] = useState(null);
  const [wrongShake, setWrongShake] = useState(null);
  const [message, setMessage] = useState(
    "3단계: 배를 채울 간식 1개와 심심함을 잊게 할 놀거리 1개를 골라주세요!"
  );
  const [showSparkle, setShowSparkle] = useState(false);
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);
  const [showFinalCelebration, setShowFinalCelebration] = useState(false);

  const wrongSound = useRef(
    typeof Audio !== "undefined" ? new Audio("/sounds/wrong_buzzer.mp3") : null
  );
  const tadaSound = useRef(
    typeof Audio !== "undefined" ? new Audio("/sounds/tada.mp3") : null
  );

  const step3Items = [
    { id: "bread", type: "food", img: "/iimages/bread_item.png", alt: "빵" },
    {
      id: "milk",
      type: "wrong_milk",
      img: "/iimages/milk_item.png",
      alt: "우유",
    },
    { id: "book", type: "play", img: "/iimages/book_item.png", alt: "동화책" },
    {
      id: "puppy",
      type: "play",
      img: "/iimages/puppy_item.png",
      alt: "강아지",
    },
    {
      id: "smartphone",
      type: "wrong_phone",
      img: "/iimages/smartphone_item.png",
      alt: "스마트폰",
    },
    {
      id: "cereal",
      type: "food",
      img: "/iimages/cereal_item.png",
      alt: "씨리얼",
    },
  ];

  const isComplete = foodItem && playItem;

  useEffect(() => {
    if (isComplete) {
      if (tadaSound.current) tadaSound.current.play().catch(() => {});

      setShowSuccessOverlay(true);

      const timer1 = setTimeout(() => setShowSuccessOverlay(false), 1500);
      const timer2 = setTimeout(() => setShowFinalCelebration(true), 1500);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [isComplete]);

  const handleItemClick = (item) => {
    if (item.type === "wrong_milk" || item.type === "wrong_phone") {
      if (wrongSound.current) wrongSound.current.play().catch(() => {});
      setWrongShake(item.id);
      if (item.type === "wrong_milk") {
        setMessage("앗! 냉장고 문을 열면 안 돼요. 우유가 상할 수 있어요!");
      } else {
        setMessage("배터리는 위급할 때 연락해야 하니 아껴두어야 해요!");
      }
      setTimeout(() => setWrongShake(null), 1500);
      return;
    }

    setShowSparkle(true);
    setTimeout(() => setShowSparkle(false), 800);

    if (item.type === "food") {
      setFoodItem(item);
      setMessage("와, 맛있는 간식을 찾았네요!");
    } else if (item.type === "play") {
      setPlayItem(item);
      setMessage("최고예요! 전기가 없어도 즐겁게 놀 수 있어요.");
    }
  };

  if (
    showFinalCelebration &&
    message !== "짜잔~!! 🎉 정전 대비 마스터가 되었어요! 🏆"
  ) {
    setMessage("짜잔~!! 🎉 정전 대비 마스터가 되었어요! 🏆");
  }

  return (
    <div className="game-container light-level-3">
      {/* 💡 3단계 텐트에도 배율을 전송해 줍니다 */}
      <div className="tent-background" style={{ transform: `scale(${scale})` }}>
        <div className="lantern-glow"></div>
        <div className="instruction-banner">
          <h2>{message}</h2>
        </div>

        <div className="minsu-character warm">
          <img
            src="/iimages/minsu_blanket_overlay.png"
            alt="따뜻한 민수"
            className="base-img"
          />
        </div>

        <div className="cocoa-on-table">
          <img src="/iimages/cocoa_cup.png" alt="코코아" />
          <div className="cocoa-steam"></div>
        </div>

        {foodItem && (
          <div className="food-on-table">
            <img src={foodItem.img} alt={foodItem.alt} />
          </div>
        )}

        {playItem && (
          <div
            className={`play-item-placed ${
              playItem.id === "puppy" ? "puppy-floor" : "book-bed"
            }`}
          >
            <img src={playItem.img} alt={playItem.alt} />
          </div>
        )}

        <div className="item-inventory">
          {step3Items.map((item) => {
            const isApplied =
              (foodItem && foodItem.id === item.id) ||
              (playItem && playItem.id === item.id);
            return (
              <div
                key={item.id}
                className={`item ${isApplied ? "applied" : ""} ${
                  wrongShake === item.id ? "shake" : ""
                }`}
                onClick={() => handleItemClick(item)}
              >
                <img src={item.img} alt={item.alt} />
              </div>
            );
          })}
        </div>

        {showSparkle && <div className="sparkle-effect">✨</div>}

        {showSuccessOverlay && (
          <div className="success-overlay">🎉 3단계 성공! 🎉</div>
        )}

        {showFinalCelebration && (
          <div className="final-celebration-container">
            <div className="confetti-emoji c-1">🎊</div>
            <div className="confetti-emoji c-2">✨</div>
            <div className="confetti-emoji c-3">🎉</div>
            <div className="confetti-emoji c-4">🎈</div>
            <div className="confetti-emoji c-5">🏆</div>

            <button className="huge-restart-btn" onClick={onRestart}>
              <div className="btn-icon">🔄</div>
              다시 도전하기!
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// 🚀 메인 앱 컴포넌트 (비율 계산 로직 추가!)
// ==========================================
export default function App() {
  const [step, setStep] = useState(1);
  const [scale, setScale] = useState(1);

  // 💡 스마트폰/컴퓨터 화면 크기에 맞춰 게임 배율을 자동으로 계산해 주는 마법입니다!
  useEffect(() => {
    const handleResize = () => {
      // 화면의 너비와 높이를 넉넉하게 950x750으로 나눠서 비율을 구합니다
      const wRatio = window.innerWidth / 950;
      const hRatio = window.innerHeight / 750;
      // 컴퓨터처럼 큰 화면에서는 최대 1배 (원래 크기) 유지, 스마트폰처럼 작으면 그 비율만큼 축소!
      setScale(Math.min(wRatio, hRatio, 1));
    };

    handleResize(); // 게임을 켤 때 처음 한 번 실행
    window.addEventListener("resize", handleResize); // 가로/세로 모드를 바꿀 때마다 실행
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <style>{`
        body { margin: 0; padding: 0; }
        
        /* 1단계 전용 스타일 */
        .s1-container { 
          min-height: 100vh; background-color: #FDF5E6; 
          font-family: 'Comic Sans MS', 'Malgun Gothic', sans-serif; 
          display: flex; flex-direction: column; align-items: center; justify-content: center; 
          color: #5C4033; overflow: hidden; /* 자동 축소 시 스크롤이 생기지 않도록 방지 */
        }
        .s1-header { max-width: 600px; margin: 0 auto 30px; text-align: center; }
        .s1-title { font-size: 36px; font-weight: 800; margin-bottom: 16px; display: flex; align-items: center; justify-content: center; gap: 10px; }
        .s1-subtitle { font-size: 18px; background-color: #FFFACD; display: inline-block; padding: 12px 24px; border-radius: 50px; border: 2px dashed #FFB6C1; }
        .s1-helper-text { font-size: 14px; color: #6b7280; margin-bottom: 24px; animation: pulse 2s infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        
        .s1-zones-wrap { display: flex; justify-content: center; flex-wrap: wrap; gap: 24px; margin-bottom: 40px; }
        .s1-zone { width: 140px; height: 140px; background-color: #E6E6FA; border-radius: 16px; border: 4px solid #9370DB; display: flex; flex-direction: column; justify-content: center; align-items: center; transition: all 0.3s; cursor: pointer; }
        .s1-zone-matched { border-color: #4ade80; background-color: #f0fdf4; box-shadow: 0 4px 10px rgba(74, 222, 128, 0.4); }
        .s1-zone-pulse { animation: pulse 1.5s infinite; box-shadow: 0 0 0 6px rgba(216, 180, 254, 0.5); }
        .s1-zone-icon { font-size: 50px; margin-bottom: 8px; transition: transform 0.2s; }
        .s1-zone:hover .s1-zone-icon { transform: scale(1.1); }
        .s1-zone-text { font-size: 16px; font-weight: bold; color: #374151; }
        
        .s1-items-wrap { display: flex; justify-content: center; flex-wrap: wrap; gap: 24px; padding: 24px; background-color: rgba(255, 255, 255, 0.5); border-radius: 24px; border: 1px solid #ffedd5; }
        .s1-item { width: 80px; height: 80px; background-color: #FFDAB9; border-radius: 50%; display: flex; justify-content: center; align-items: center; font-size: 40px; cursor: grab; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border: 4px solid #FF8C00; transition: transform 0.2s; }
        .s1-item:active { cursor: grabbing; }
        .s1-item:hover { transform: scale(1.1); }
        .s1-item-selected { box-shadow: 0 0 0 6px #fb923c; transform: scale(1.1); }

        .s1-success-wrap { display: flex; flex-direction: column; align-items: center; animation: dropIn 0.5s ease-out; }
        .s1-success-msg { font-size: 24px; color: #2E8B57; font-weight: bold; background-color: #E0FFFF; padding: 20px 30px; border-radius: 16px; border: 4px solid #20B2AA; margin-bottom: 24px; }
        .s1-next-btn { background-color: #a855f7; color: white; font-size: 20px; font-weight: bold; padding: 16px 32px; border-radius: 50px; border: none; cursor: pointer; box-shadow: 0 5px 15px rgba(168,85,247,0.4); transition: transform 0.2s; }
        .s1-next-btn:hover { background-color: #9333ea; transform: translateY(-3px); }

        /* 2 & 3단계 공통 스타일 */
        .game-container { width: 100%; height: 100vh; display: flex; justify-content: center; align-items: center; transition: background-color 1.5s ease; overflow: hidden; font-family: 'Comic Sans MS', 'Malgun Gothic', sans-serif; }
        .light-level-0 { background-color: #2c3e50; } .light-level-1 { background-color: #4a5c50; } .light-level-2 { background-color: #8fa08c; } .light-level-3 { background-color: #fcf4e8; } 

        /* 💡 텐트 크기는 원본을 유지하지만, React가 겉에서 자동으로 scale(배율)을 줄여줍니다! */
        .tent-background { 
          position: relative; width: 900px; height: 650px; 
          background-image: url('/iimages/tent_bg.png'); background-size: cover; 
          border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); 
          display: flex; flex-direction: column; align-items: center; 
          transform-origin: center center; /* 중앙을 기준으로 예쁘게 축소됩니다 */
        }
        
        .lantern-glow { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 400px; height: 400px; background: radial-gradient(circle, rgba(255,223,137,0.6) 0%, rgba(255,223,137,0) 70%); pointer-events: none; z-index: 1; }

        .instruction-banner { z-index: 5; margin-top: 20px; }
        .instruction-banner h2 { color: #555; background-color: rgba(255, 255, 255, 0.95); padding: 12px 24px; border-radius: 15px; text-align: center; margin: 0; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }

        .minsu-character { position: relative; margin-top: 40px; width: 280px; height: 380px; z-index: 2; }
        .base-img { width: 100%; height: 100%; object-fit: contain; }

        .shivering { animation: shiver 0.3s infinite alternate; }
        @keyframes shiver { 0% { transform: translateX(-3px) rotate(-1deg); } 100% { transform: translateX(3px) rotate(1deg); } }

        .item-inventory { position: absolute; bottom: 30px; display: flex; gap: 15px; background: rgba(255, 255, 255, 0.6); padding: 15px 25px; border-radius: 20px; z-index: 5; }
        .item { width: 75px; height: 75px; cursor: pointer; transition: transform 0.2s; display: flex; justify-content: center; align-items: center; background: #fff; border-radius: 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .item img { max-width: 80%; max-height: 80%; }
        .item:hover { transform: scale(1.15) translateY(-5px); }
        .item.applied { opacity: 0.3; pointer-events: none; filter: grayscale(100%); }

        .shake { animation: shakeError 0.4s ease-in-out; background: #ffe6e6; }
        @keyframes shakeError { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-10px) rotate(-5deg); } 50% { transform: translateX(10px) rotate(5deg); } 75% { transform: translateX(-10px) rotate(-5deg); } }

        .cocoa-on-table { position: absolute; bottom: 200px; right: 240px; width: 55px; z-index: 3; }
        .cocoa-on-table img { width: 100%; position: relative; z-index: 2; }
        .cocoa-steam { position: absolute; top: -25px; left: 50%; transform: translateX(-50%); width: 15px; height: 30px; background: rgba(255, 255, 255, 0.8); border-radius: 50%; filter: blur(4px); animation: rise 2s infinite ease-in; z-index: 1; }
        @keyframes rise { 0% { transform: translateX(-50%) translateY(0) scale(1); opacity: 0.8; } 100% { transform: translateX(-50%) translateY(-30px) scale(1.5); opacity: 0; } }

        .food-on-table { position: absolute; bottom: 190px; right: 160px; width: 75px; z-index: 4; animation: dropIn 0.5s ease-out; }
        .food-on-table img { width: 100%; }

        .play-item-placed { position: absolute; z-index: 4; animation: dropIn 0.5s ease-out; }
        .play-item-placed img { width: 100%; }
        .puppy-floor { bottom: 40px; right: 120px; width: 140px; }
        .book-bed { bottom: 110px; left: 200px; width: 120px; }

        .sparkle-effect { position: absolute; top: 40%; left: 50%; font-size: 60px; animation: pop 0.8s ease-out forwards; z-index: 10; pointer-events: none; }
        @keyframes pop { 0% { transform: scale(0.5); opacity: 1; } 100% { transform: scale(2.5); opacity: 0; } }

        .success-overlay { position: absolute; top: 35%; display: flex; flex-direction: column; align-items: center; gap: 15px; font-size: 22px; font-weight: bold; color: #ff7675; background: rgba(255,255,255,0.95); padding: 20px 40px; border-radius: 30px; box-shadow: 0 10px 20px rgba(0,0,0,0.2); animation: dropIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); z-index: 20; }
        .floating-next-btn { position: absolute; bottom: 130px; right: 40px; font-size: 20px; padding: 12px 24px; border: none; border-radius: 15px; background-color: #ffd32a; color: #333; cursor: pointer; font-weight: bold; box-shadow: 0 4px 6px rgba(0,0,0,0.2); transition: all 0.2s; z-index: 15; animation: dropIn 0.5s ease-out; }
        .floating-next-btn:hover { background-color: #ffc048; transform: scale(1.05); }

        @keyframes dropIn { from { opacity: 0; transform: scale(0.5) translateY(-50px); } to { opacity: 1; transform: scale(1) translateY(0); } }

        .final-celebration-container { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 50; overflow: hidden; display: flex; justify-content: center; align-items: center; background: rgba(255,255,255,0.4); border-radius: 20px; animation: fadeIn 1s ease-in; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        .confetti-emoji { position: absolute; font-size: 50px; top: -10%; animation: fallDown 3s linear infinite; }
        @keyframes fallDown { 0% { transform: translateY(0) rotate(0deg); opacity: 1; } 100% { transform: translateY(800px) rotate(720deg); opacity: 0; } }
        .c-1 { left: 15%; animation-delay: 0s; font-size: 40px; }
        .c-2 { left: 35%; animation-delay: 0.5s; font-size: 60px; }
        .c-3 { left: 50%; animation-delay: 0.2s; font-size: 45px; }
        .c-4 { left: 75%; animation-delay: 0.8s; font-size: 55px; }
        .c-5 { left: 85%; animation-delay: 0.4s; font-size: 35px; }

        .huge-restart-btn { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; font-size: 36px; padding: 30px 60px; border-radius: 50px; background: linear-gradient(135deg, #4ade80, #22c55e); color: white; font-weight: 900; border: 6px solid white; box-shadow: 0 15px 35px rgba(34, 197, 94, 0.4); cursor: pointer; pointer-events: auto; z-index: 60; animation: pulseBtn 2s infinite; transition: transform 0.2s; }
        .huge-restart-btn:hover { background: linear-gradient(135deg, #22c55e, #16a34a); }
        .huge-restart-btn .btn-icon { font-size: 50px; margin-bottom: -10px; }
        @keyframes pulseBtn { 0% { transform: scale(1); } 50% { transform: scale(1.05); } 100% { transform: scale(1); } }
      `}</style>

      {/* 💡 각 단계별로 계산된 배율(scale)을 전달해 줍니다 */}
      {step === 1 && <Step1 onNextStep={() => setStep(2)} scale={scale} />}
      {step === 2 && <Step2 onNextStep={() => setStep(3)} scale={scale} />}
      {step === 3 && <Step3 onRestart={() => setStep(1)} scale={scale} />}
    </>
  );
}
