export default {
  app: {
    name: "Sopht Desktop Companion",
    identifier: "dev.my.app",
    version: "0.0.1",
  },
  build: {
    bun: {
      entrypoint: "src/bun/index.ts",
    },
    views: {
      "main-ui": {
        entrypoint: "src/main-ui/index.ts",
      },
    },
    copy: {
      "src/main-ui/index.html": "views/main-ui/index.html",
      "src/main-ui/welcome.html": "views/main-ui/welcome.html",
      
      "src/assets/sophy.vrm": "views/assets/sophy.vrm",

      "src/assets/vrma/Heart_Pie_Dancehall.vrma": "views/assets/vrma/Heart_Pie_Dancehall.vrma",
      "src/assets/vrma/VRMA_01.vrma": "views/assets/vrma/VRMA_01.vrma",
      "src/assets/vrma/VRMA_02.vrma": "views/assets/vrma/VRMA_02.vrma",
      "src/assets/vrma/VRMA_03.vrma": "views/assets/vrma/VRMA_03.vrma",
      "src/assets/vrma/VRMA_04.vrma": "views/assets/vrma/VRMA_04.vrma",
      "src/assets/vrma/VRMA_05.vrma": "views/assets/vrma/VRMA_05.vrma",
      "src/assets/vrma/VRMA_06.vrma": "views/assets/vrma/VRMA_06.vrma",
      "src/assets/vrma/VRMA_07.vrma": "views/assets/vrma/VRMA_07.vrma",

      "src/assets/sounds/Heart_Pie_Dancehall.mp3": "views/assets/sounds/Heart_Pie_Dancehall.mp3",
    },
  },
};