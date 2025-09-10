import { VRMAAnimationManager, VRMViewer } from '../bun/module/vrm.ts';

import {
  Electroview
} from "electrobun/view";
import SoundPlayer from '../bun/module/sound.ts';

// Instantiate the electrobun browser api
const electrobun = new Electroview({
  rpc: null
});





const sounds = new SoundPlayer();

// サウンドをプリロード（Electrobunなら `views://` or 通常のURLも可）
sounds.preload("Heart_Pie_Dancehall", "views://assets/sounds/Heart_Pie_Dancehall.mp3");




// --- 初期化・統合処理 ---
document.addEventListener("DOMContentLoaded", async () => {
  const viewer = new VRMViewer("root");
  await viewer.loadVRM("views://assets/sophy.vrm");

  const animationManager = new VRMAAnimationManager(viewer);

  // 任意のアニメーションを登録
  await animationManager.loadVRMA("Heart_Pie_Dancehall", "views://assets/vrma/Heart_Pie_Dancehall.vrma");
  await animationManager.loadVRMA("1", "views://assets/vrma/VRMA_01.vrma");
  await animationManager.loadVRMA("2", "views://assets/vrma/VRMA_02.vrma");
  await animationManager.loadVRMA("3", "views://assets/vrma/VRMA_03.vrma");
  await animationManager.loadVRMA("4", "views://assets/vrma/VRMA_04.vrma");
  await animationManager.loadVRMA("5", "views://assets/vrma/VRMA_05.vrma");
  await animationManager.loadVRMA("6", "views://assets/vrma/VRMA_06.vrma");
  await animationManager.loadVRMA("7", "views://assets/vrma/VRMA_07.vrma");

  // 初期アニメーション
  animationManager.play("1", 0.5);

  // アニメーション切り替え（キーボード）
  document.addEventListener("keydown", async e => {
    sounds.stop();
    if (e.key === "1") {
      animationManager.play("Heart_Pie_Dancehall", 0.429);
      sounds.play("Heart_Pie_Dancehall", { volume: 0.5, delay: 1.2 });
    }
    if (e.key === "2") animationManager.play("1", 0.5);
    if (e.key === "3") animationManager.play("2", 0.5);
    if (e.key === "4") animationManager.play("3", 0.5);
    if (e.key === "5") animationManager.play("4", 0.5);
    if (e.key === "6") animationManager.play("5", 0.5);
    if (e.key === "7") animationManager.play("6", 0.5);
    if (e.key === "8") animationManager.play("7", 0.5);
  });

  // レンダリングループ
  viewer.animate(() => {
    animationManager.update();
  });
});
