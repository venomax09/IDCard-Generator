import { useState, useRef, useEffect, useCallback } from "react";

// ---- HH Goa brand tokens (matched to hhgoa.com) ----
const GREEN = "#0B4A34";
const GREEN_DARK = "#073024";
const GOLD = "#F0C23B";
const PINK = "#FF2E7E";
const CREAM = "#F4EFE6";
const DIM = "rgba(244,239,230,0.6)";

const TITLES = [
  "Code Pirate",
  "Commit Commander",
  "Merge Mayhem",
  "Bug Hunter",
  "Syntax Samurai",
  "Pixel Pusher",
  "Terminal Wizard",
  "Git Gladiator",
  "Deploy Ninja",
  "Runtime Raider",
  "Code Alchemist",
  "Refactor Ranger",
  "Debug Detective",
  "API Adventurer",
  "Frontend Phantom",
  "Backend Beast",
  "Console Cowboy",
  "CSS Sorcerer",
  "JavaScript Junkie",
  "React Renegade",
  "Node Nomad",
  "Commit Crusader",
  "Branch Boss",
  "Pull Request Pro",
  "Production Survivor",
  "404 Escape Artist",
  "Stack Trace Stalker",
  "Infinite Loop Survivor",
  "Dependency Destroyer",
  "npm Warrior",
  "Package Pirate",
  "Console Chaos Coordinator",
  "Keyboard Warrior",
  "Rubber Duck Commander",
  "Ctrl+Z Champion",
  "It Works On My Machine",
  "Works On My Laptop",
  "Professional Googler",
  "Documentation Dodger",
  "Deadline Deployer",
  "3AM Debugger",
  "Last-Minute Legend",
  "Coffee & Commits",
  "Powered By Stack Overflow",
  "Push & Pray Engineer",
  "Ship It Specialist",
  "YOLO Deployer",
  "Production Cowboy",
  "Code Gremlin",
  "Bug Magnet",
  "Syntax Survivor",
  "Commit Addict",
  "Git Happens",
  "Merge Conflict Survivor",
  "Dependency Whisperer",
  "Code Chaos Manager",
  "404 Wanderer",
  "Loading Screen Legend",
  "Pixel Perfectionist",
  "UI Wizard",
  "Dark Mode Defender",
  "Responsive Design Raider",
  "Breakpoint Bandit",
  "CSS Pain Enjoyer",
  "Flexbox Fighter",
  "Grid Gladiator",
  "Tailwind Troublemaker",
  "Chai-Fueled Coder",
  "Vada Pav Developer",
  "Local Train Debugger",
  "Mumbai Merge Master",
  "Bandra Bug Hunter",
  "Marine Drive Debugger",
  "Monsoon Mode Engineer",
  "Chai & Commits",
  "Tapri Tech Lead",
  "Cutting Chai Coder",
  "Jugaad Engineer",
  "Full Jugaad Developer",
  "Deadline Ka Don",
  " jugaad.exe",
  "Bhai Ship Kar",
  "Aaj Deploy Karenge",
  "Kal Fix Karenge",
  "Production Mein Dekhenge",
];

const CARD_W = 1080;
const CARD_H = 1350;

// Unique ID for every card holder: GOA26-<base36 time><random>
function randomBadgeCode() {
  const t = Date.now().toString(36).toUpperCase().slice(-4);
  const r = Math.random().toString(36).toUpperCase().slice(2, 6);
  return `GOA26-${t}${r}`;
}

function loadFonts() {
  if (document.getElementById("hh-goa-fonts")) return;
  const link = document.createElement("link");
  link.id = "hh-goa-fonts";
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=JetBrains+Mono:wght@400;600;700&family=Noto+Sans+Devanagari:wght@700;800&display=swap";
  document.head.appendChild(link);
}

// Pre-load the Goa beach background image
let bgImage = null;
let bgImageLoaded = false;
const bgImg = new Image();
bgImg.onload = () => {
  bgImage = bgImg;
  bgImageLoaded = true;
};
bgImg.src = "/images/goa-beach.png";

function drawCover(ctx, img, x, y, w, h) {
  const ir = img.naturalWidth / img.naturalHeight;
  const tr = w / h;
  let sx, sy, sw, sh;
  if (ir > tr) {
    sh = img.naturalHeight;
    sw = sh * tr;
    sy = 0;
    sx = (img.naturalWidth - sw) / 2;
  } else {
    sw = img.naturalWidth;
    sh = sw / tr;
    sx = 0;
    sy = (img.naturalHeight - sh) / 2;
  }
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
}

function roundRectPath(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawWave(ctx, x, y, w, amplitude, wavelength, color, lineWidth) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.lineCap = "round";
  ctx.beginPath();
  for (let i = 0; i <= w; i += 4) {
    const yy = y + Math.sin((i / wavelength) * Math.PI * 2) * amplitude;
    if (i === 0) ctx.moveTo(x + i, yy);
    else ctx.lineTo(x + i, yy);
  }
  ctx.stroke();
  ctx.restore();
}

function cornerTicks(ctx, x, y, w, h, len, color, lw) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = lw;
  ctx.lineCap = "round";
  const gap = 10;
  const pts = [
    [x, y, 1, 1],
    [x + w, y, -1, 1],
    [x, y + h, 1, -1],
    [x + w, y + h, -1, -1],
  ];
  pts.forEach(([px, py, dx, dy]) => {
    ctx.beginPath();
    ctx.moveTo(px + dx * gap, py);
    ctx.lineTo(px + dx * (gap + len), py);
    ctx.moveTo(px, py + dy * gap);
    ctx.lineTo(px, py + dy * (gap + len));
    ctx.stroke();
  });
  ctx.restore();
}

function drawMasthead(ctx, centerX, y, fontPx) {
  ctx.font = `900 ${fontPx}px 'Playfair Display', serif`;
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  const left = "HACKER";
  const right = "HOUSE";
  const leftW = ctx.measureText(left).width;
  const rightW = ctx.measureText(right).width;
  const badgeW = fontPx * 1.7;
  const gap = fontPx * 0.18;
  const total = leftW + gap + badgeW + gap + rightW;
  let x = centerX - total / 2;

  ctx.fillStyle = GOLD;
  ctx.strokeStyle = GREEN_DARK;
  ctx.lineWidth = Math.max(2, fontPx * 0.02);
  ctx.strokeText(left, x, y);
  ctx.fillText(left, x, y);
  x += leftW + gap;

  const badgeCx = x + badgeW / 2;
  const badgeCy = y - fontPx * 0.34;
  ctx.save();
  ctx.translate(badgeCx, badgeCy);
  ctx.rotate((-7 * Math.PI) / 180);
  roundRectPath(ctx, -badgeW / 2, -fontPx * 0.42, badgeW, fontPx * 0.84, 10);
  ctx.fillStyle = PINK;
  ctx.fill();
  ctx.fillStyle = CREAM;
  ctx.font = `800 ${fontPx * 0.62}px 'Noto Sans Devanagari', sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("गोवा", 0, fontPx * 0.03);
  ctx.restore();
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  x += badgeW + gap;

  ctx.fillStyle = GOLD;
  ctx.strokeText(right, x, y);
  ctx.fillText(right, x, y);
}

export default function App() {
  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const fileInputRef = useRef(null);

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [title, setTitle] = useState(TITLES[0]);
  const [badgeCode] = useState(randomBadgeCode());
  const [hasPhoto, setHasPhoto] = useState(false);
  const [error, setError] = useState("");
  const [fontsReady, setFontsReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [bgReady, setBgReady] = useState(bgImageLoaded);

  useEffect(() => {
    loadFonts();
    let cancelled = false;
    const check = async () => {
      try {
        await Promise.all([
          document.fonts.load("900 64px 'Playfair Display'"),
          document.fonts.load("600 28px 'JetBrains Mono'"),
          document.fonts.load("800 40px 'Noto Sans Devanagari'"),
        ]);
      } catch (e) {}
      if (!cancelled) setFontsReady(true);
    };
    check();
    const t = setTimeout(() => !cancelled && setFontsReady(true), 1400);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, []);

  // Wait for bg image
  useEffect(() => {
    if (bgImageLoaded) {
      setBgReady(true);
      return;
    }
    const prev = bgImg.onload;
    bgImg.onload = () => {
      bgImage = bgImg;
      bgImageLoaded = true;
      setBgReady(true);
    };
    return () => {
      bgImg.onload = prev;
    };
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = CARD_W;
    canvas.height = CARD_H;
    ctx.clearRect(0, 0, CARD_W, CARD_H);

    // background
    ctx.fillStyle = GREEN;
    ctx.fillRect(0, 0, CARD_W, CARD_H);
    const grad = ctx.createLinearGradient(0, 0, 0, 340);
    grad.addColorStop(0, GREEN_DARK);
    grad.addColorStop(1, GREEN);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, CARD_W, 340);

    // Draw Goa beach illustration from middle to bottom
    if (bgImage) {
      const bgDrawY = CARD_H * 0.42; // start around 42% down
      const bgDrawH = CARD_H - bgDrawY;
      const bgDrawW = CARD_W;

      // cover fit the bg image into this area
      const imgAR = bgImage.naturalWidth / bgImage.naturalHeight;
      const areaAR = bgDrawW / bgDrawH;
      let sx, sy, sw, sh;
      if (imgAR > areaAR) {
        sh = bgImage.naturalHeight;
        sw = sh * areaAR;
        sy = 0;
        sx = (bgImage.naturalWidth - sw) / 2;
      } else {
        sw = bgImage.naturalWidth;
        sh = sw / areaAR;
        sx = 0;
        sy = 0; // align to top of image so we see the sun/sky
      }

      ctx.save();
      ctx.globalAlpha = 0.35;
      ctx.drawImage(bgImage, sx, sy, sw, sh, 0, bgDrawY, bgDrawW, bgDrawH);
      ctx.restore();

      // gradient overlay so text stays readable
      const overlay = ctx.createLinearGradient(0, bgDrawY, 0, bgDrawY + 200);
      overlay.addColorStop(0, GREEN);
      overlay.addColorStop(1, "rgba(11,74,52,0)");
      ctx.fillStyle = overlay;
      ctx.fillRect(0, bgDrawY, CARD_W, 200);
    }

    // outer border
    roundRectPath(ctx, 24, 24, CARD_W - 48, CARD_H - 48, 36);
    ctx.strokeStyle = GOLD;
    ctx.lineWidth = 4;
    ctx.stroke();

    const pad = 72;

    // studio tag + pass tag
    ctx.font = "700 22px 'JetBrains Mono', monospace";
    ctx.textAlign = "left";
    ctx.fillStyle = GOLD;
    ctx.fillText("2:47 PM STUDIO", pad, 90);
    ctx.textAlign = "right";
    ctx.fillStyle = PINK;
    ctx.fillText("BUILDER PASS", CARD_W - pad, 90);

    // masthead
    let mastFont = 92;
    ctx.font = `900 ${mastFont}px 'Playfair Display', serif`;
    while (
      (ctx.measureText("HACKER").width + ctx.measureText("HOUSE").width) * 1.55 >
        CARD_W - pad * 2 &&
      mastFont > 46
    ) {
      mastFont -= 2;
      ctx.font = `900 ${mastFont}px 'Playfair Display', serif`;
    }
    drawMasthead(ctx, CARD_W / 2, 220, mastFont);

    // subtitle
    ctx.font = "600 24px 'JetBrains Mono', monospace";
    ctx.fillStyle = CREAM;
    ctx.textAlign = "center";
    ctx.fillText("GOA, INDIA  ·  28–31 OCT 2026", CARD_W / 2, 268);

    drawWave(ctx, pad, 300, CARD_W - pad * 2, 6, 60, GOLD, 3);

    // photo frame
    const frameW = 400;
    const frameH = 400;
    const frameX = (CARD_W - frameW) / 2;
    const frameY = 350;

    ctx.save();
    roundRectPath(ctx, frameX, frameY, frameW, frameH, 26);
    ctx.fillStyle = GREEN_DARK;
    ctx.fill();
    ctx.clip();
    if (imgRef.current) {
      drawCover(ctx, imgRef.current, frameX, frameY, frameW, frameH);
    } else {
      ctx.fillStyle = DIM;
      ctx.font = "600 22px 'JetBrains Mono', monospace";
      ctx.textAlign = "center";
      ctx.fillText("UPLOAD A PHOTO", frameX + frameW / 2, frameY + frameH / 2);
    }
    ctx.restore();

    roundRectPath(ctx, frameX, frameY, frameW, frameH, 26);
    ctx.strokeStyle = GOLD;
    ctx.lineWidth = 3;
    ctx.stroke();
    cornerTicks(ctx, frameX, frameY, frameW, frameH, 24, PINK, 4);

    // name
    let y = frameY + frameH + 90;
    ctx.fillStyle = GOLD;
    ctx.textAlign = "center";
    let fontSize = 58;
    const displayName = (name || "YOUR NAME").toUpperCase();
    ctx.font = `900 ${fontSize}px 'Playfair Display', serif`;
    while (ctx.measureText(displayName).width > CARD_W - pad * 2 && fontSize > 28) {
      fontSize -= 2;
      ctx.font = `900 ${fontSize}px 'Playfair Display', serif`;
    }
    ctx.fillText(displayName, CARD_W / 2, y);

    // unique holder ID — sits directly under the name
    y += 40;
    ctx.font = "700 22px 'JetBrains Mono', monospace";
    const idText = `ID · ${badgeCode}`;
    const idW = ctx.measureText(idText).width;
    const idPadX = 20;
    const idBoxW = idW + idPadX * 2;
    const idBoxH = 38;
    roundRectPath(ctx, (CARD_W - idBoxW) / 2, y - idBoxH / 2 - 6, idBoxW, idBoxH, 8);
    ctx.fillStyle = "rgba(240,194,59,0.14)";
    ctx.fill();
    ctx.strokeStyle = "rgba(240,194,59,0.45)";
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.fillStyle = GOLD;
    ctx.textBaseline = "middle";
    ctx.fillText(idText, CARD_W / 2, y - 6 + 1);
    ctx.textBaseline = "alphabetic";

    // role
    y += 48;
    ctx.font = "600 28px 'JetBrains Mono', monospace";
    ctx.fillStyle = CREAM;
    ctx.fillText("> " + (role || "builder · hacker · dreamer"), CARD_W / 2, y);

    // title pill
    y += 62;
    ctx.font = "700 25px 'JetBrains Mono', monospace";
    const pillText = title.toUpperCase();
    const textW = ctx.measureText(pillText).width;
    const pillPadX = 34;
    const pillW = textW + pillPadX * 2;
    const pillH = 56;
    const pillX = (CARD_W - pillW) / 2;
    const pillY = y - pillH / 2 - 8;
    roundRectPath(ctx, pillX, pillY, pillW, pillH, pillH / 2);
    ctx.fillStyle = PINK;
    ctx.fill();
    ctx.fillStyle = CREAM;
    ctx.textBaseline = "middle";
    ctx.fillText(pillText, CARD_W / 2, pillY + pillH / 2 + 2);
    ctx.textBaseline = "alphabetic";

    // perforation
    const perfY = CARD_H - 200;
    ctx.fillStyle = "rgba(244,239,230,0.35)";
    for (let lx = pad; lx < CARD_W - pad; lx += 18) {
      ctx.beginPath();
      ctx.arc(lx, perfY, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    drawWave(ctx, pad, CARD_H - 140, CARD_W - pad * 2, 5, 54, GOLD, 2.5);

    // footer with dark backdrop for readability over bg image
    ctx.fillStyle = "rgba(7,48,36,0.7)";
    ctx.fillRect(24, CARD_H - 120, CARD_W - 48, 72);

    ctx.font = "600 24px 'JetBrains Mono', monospace";
    ctx.fillStyle = DIM;
    ctx.textAlign = "left";
    ctx.fillText("#FrameInGoa", pad, CARD_H - 80);
    ctx.textAlign = "right";
    ctx.fillText("hhgoa.com", CARD_W - pad, CARD_H - 80);

    ctx.textAlign = "center";
    ctx.font = "500 19px 'JetBrains Mono', monospace";
    ctx.fillStyle = "rgba(244,239,230,0.55)";
    ctx.fillText(
      "",
      CARD_W / 2,
      CARD_H - 46,
    );
  }, [name, role, title, badgeCode, bgReady]);

  useEffect(() => {
    if (fontsReady) draw();
  }, [fontsReady, draw, hasPhoto, bgReady]);

  const onPhotoChange = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setError("");
    setBusy(true);

    try {
      let processedFile = file;
      const isHeic =
        /heic|heif/i.test(file.type) || /\.(heic|heif)$/i.test(file.name);

      if (isHeic) {
        try {
          const heic2any = (await import("heic2any")).default;
          const converted = await heic2any({
            blob: file,
            toType: "image/jpeg",
            quality: 0.92,
          });
          processedFile = Array.isArray(converted) ? converted[0] : converted;
        } catch (err) {
          console.warn("HEIC conversion failed, using original file", err);
        }
      }

      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          imgRef.current = img;
          setHasPhoto(true);
          setBusy(false);
          setTimeout(draw, 0);
        };
        img.onerror = () => {
          setBusy(false);
          setError("Couldn't load that photo. Try a JPG or PNG.");
        };
        img.src = reader.result;
      };
      reader.onerror = () => {
        setBusy(false);
        setError("Couldn't read that file. Please try again.");
      };
      reader.readAsDataURL(processedFile);
    } catch {
      setBusy(false);
      setError("An error occurred while loading your photo. Try another image.");
    }
  };

  const shuffleTitle = () => {
    let next = title;
    while (next === title) {
      next = TITLES[Math.floor(Math.random() * TITLES.length)];
    }
    setTitle(next);
  };

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    const safeName = (name || "builder")
      .trim()
      .replace(/\s+/g, "-")
      .toLowerCase();
    link.download = `hh-goa-2026-${safeName}-${badgeCode}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const shareToX = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const text = `Just got my HH Goa 2026 builder pass 🌴⚡ #FrameInGoa`;
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], "hh-goa-2026-badge.png", {
        type: "image/png",
      });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({ files: [file], text });
          return;
        } catch (e) {}
      }
      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
        "_blank",
      );
    }, "image/png");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${GREEN_DARK} 0%, ${GREEN} 60%, #0d5a3e 100%)`,
        color: CREAM,
        fontFamily: "'Playfair Display', serif",
      }}
    >
      {/* Header */}
      <header className="px-4 pt-6 pb-4 sm:px-8 sm:pt-8 sm:pb-6">
        <div className="max-w-6xl mx-auto">
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              color: PINK,
              fontSize: 12,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}
          >
            HH GOA 2026 · Builder Pass
          </div>
          <h1
            style={{
              fontSize: "clamp(24px, 5vw, 36px)",
              fontWeight: 900,
              margin: "4px 0 0 0",
              color: GOLD,
              lineHeight: 1.15,
            }}
          >
            Builder ID Card Generator
          </h1>
          <p
            style={{
              color: DIM,
              marginTop: 6,
              fontSize: 14,
              fontFamily: "'JetBrains Mono', monospace",
              maxWidth: 500,
            }}
          >
            Upload a photo, fill in a couple of fields, and get your Hacker House
            Goa builder pass — ready to download & share.
          </p>
        </div>
      </header>

      {/* Main content — side-by-side on md+ */}
      <main className="px-4 pb-8 sm:px-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6 md:gap-10 items-start">

          {/* Left: Controls */}
          <div
            className="w-full md:w-[420px] lg:w-[440px] shrink-0 flex flex-col gap-4 order-2 md:order-1"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            {/* Photo upload */}
            <div
              style={{
                background: "rgba(7,48,36,0.7)",
                border: "1px solid rgba(240,194,59,0.15)",
                borderRadius: 16,
                padding: "16px 18px",
              }}
            >
              <label
                style={{
                  color: GOLD,
                  fontSize: 11,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  fontWeight: 700,
                  display: "block",
                  marginBottom: 10,
                }}
              >
                📸 Photo
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: `2px dashed ${hasPhoto ? "rgba(240,194,59,0.4)" : "rgba(244,239,230,0.2)"}`,
                  borderRadius: 12,
                  padding: hasPhoto ? "12px 16px" : "24px 16px",
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "border-color 0.2s",
                  background: hasPhoto ? "rgba(240,194,59,0.06)" : "transparent",
                }}
              >
                {busy ? (
                  <span style={{ fontSize: 13, color: CREAM }}>Processing…</span>
                ) : hasPhoto ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "center" }}>
                    <span style={{ fontSize: 20 }}>✅</span>
                    <div style={{ textAlign: "left" }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: CREAM }}>Photo added</div>
                      <div style={{ fontSize: 11, color: DIM }}>Tap to change</div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div style={{ fontSize: 28, marginBottom: 4 }}>📷</div>
                    <div style={{ fontSize: 13, color: CREAM, fontWeight: 600 }}>Tap to upload or drop a photo</div>
                    <div style={{ fontSize: 11, color: DIM, marginTop: 4 }}>JPG, PNG, or HEIC from iPhone</div>
                  </>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.heic,.heif"
                onChange={onPhotoChange}
                style={{ display: "none" }}
              />
              {error && (
                <p style={{ color: PINK, fontSize: 12, marginTop: 8 }}>{error}</p>
              )}
            </div>

            {/* Details */}
            <div
              style={{
                background: "rgba(7,48,36,0.7)",
                border: "1px solid rgba(240,194,59,0.15)",
                borderRadius: 16,
                padding: "16px 18px",
              }}
            >
              <label
                style={{
                  color: GOLD,
                  fontSize: 11,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  fontWeight: 700,
                  display: "block",
                  marginBottom: 12,
                }}
              >
                ✏️ Details
              </label>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <input
                  type="text"
                  value={name}
                  maxLength={28}
                  placeholder="Name — e.g. Aditi Rao"
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    width: "100%",
                    background: GREEN_DARK,
                    border: "1px solid rgba(244,239,230,0.15)",
                    color: CREAM,
                    borderRadius: 10,
                    padding: "11px 14px",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 14,
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
                <input
                  type="text"
                  value={role}
                  maxLength={34}
                  placeholder="Stack / role — e.g. full-stack · rust"
                  onChange={(e) => setRole(e.target.value)}
                  style={{
                    width: "100%",
                    background: GREEN_DARK,
                    border: "1px solid rgba(244,239,230,0.15)",
                    color: CREAM,
                    borderRadius: 10,
                    padding: "11px 14px",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 14,
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              {/* Unique holder ID (auto-assigned) */}
              <div
                style={{
                  marginTop: 12,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 10,
                  background: "rgba(240,194,59,0.08)",
                  border: "1px solid rgba(240,194,59,0.3)",
                  borderRadius: 10,
                  padding: "10px 14px",
                }}
              >
                <span
                  style={{
                    fontSize: 10,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: DIM,
                  }}
                >
                  Your unique ID
                </span>
                <span style={{ fontSize: 14, fontWeight: 700, color: GOLD }}>
                  {badgeCode}
                </span>
              </div>
            </div>

            {/* Builder title */}
            <div
              style={{
                background: "rgba(7,48,36,0.7)",
                border: "1px solid rgba(255,46,126,0.25)",
                borderRadius: 16,
                padding: "16px 18px",
              }}
            >
              <label
                style={{
                  color: PINK,
                  fontSize: 11,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  fontWeight: 700,
                  display: "block",
                  marginBottom: 10,
                }}
              >
                🎲 Builder Title
              </label>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <div
                  style={{
                    flex: 1,
                    background: GREEN_DARK,
                    border: "1px solid rgba(244,239,230,0.15)",
                    color: CREAM,
                    borderRadius: 10,
                    padding: "11px 14px",
                    fontSize: 14,
                    fontWeight: 600,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {title}
                </div>
                <button
                  onClick={shuffleTitle}
                  style={{
                    background: GOLD,
                    color: GREEN_DARK,
                    border: "none",
                    borderRadius: 10,
                    padding: "11px 16px",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}
                >
                  Shuffle
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={download}
                disabled={!hasPhoto || busy}
                style={{
                  background: hasPhoto ? PINK : "rgba(255,46,126,0.3)",
                  color: CREAM,
                  border: "none",
                  borderRadius: 12,
                  padding: "14px 20px",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: hasPhoto ? "pointer" : "not-allowed",
                  flex: 1,
                  transition: "background 0.2s",
                }}
              >
                ⬇ Download PNG
              </button>
              <button
                onClick={shareToX}
                disabled={!hasPhoto || busy}
                style={{
                  background: "transparent",
                  color: hasPhoto ? GOLD : "rgba(240,194,59,0.4)",
                  border: `1.5px solid ${hasPhoto ? GOLD : "rgba(240,194,59,0.3)"}`,
                  borderRadius: 12,
                  padding: "14px 20px",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: hasPhoto ? "pointer" : "not-allowed",
                  flex: 1,
                  transition: "all 0.2s",
                }}
              >
                𝕏 Share to X
              </button>
            </div>
            <p
              style={{
                color: DIM,
                fontSize: 11,
                lineHeight: 1.5,
                fontFamily: "'JetBrains Mono', monospace",
                margin: 0,
              }}
            >
              {!hasPhoto
                ? "Add a photo to unlock download & share."
                : "On phones, \"Share to X\" attaches the image directly. On desktop it opens a pre-filled tweet."}
            </p>
          </div>

          {/* Right: Preview */}
          <div className="w-full md:flex-1 flex justify-center order-1 md:order-2 md:sticky md:top-6">
            <div
              style={{
                width: "100%",
                maxWidth: 380,
                borderRadius: 22,
                overflow: "hidden",
                boxShadow: "0 24px 64px rgba(0,0,0,0.55), 0 0 0 1px rgba(240,194,59,0.12)",
              }}
            >
              <canvas
                ref={canvasRef}
                style={{ width: "100%", height: "auto", display: "block" }}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer
        className="px-4 pb-6 sm:px-8"
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11,
          color: "rgba(244,239,230,0.35)",
          textAlign: "center",
        }}
      >
         Runs entirely in your browser · nothing is uploaded · #HHGoaIDF
      </footer>
    </div>
  );
}
