const config = {
  contactUs: {
    whatsApp: "https://chat.whatsapp.com/GDFGTZStwJC97sR9v986IJ",
    telegram: "https://t.me/joinchat/VaHa2hnWNoqWwHA5VJIQSA",
    facebook: "https://www.facebook.com/groups/3814189245284080",
  },
  hotGames: [
    {
      icon: require("../assets/arcadePusher.png"),
      name: "arcadePusher",
      downloadUrl: "https://arcadepusher.onelink.me/WsV7/99274bbb",
      banner: require("../assets/arcadepusher_banner.jpg"),
      text: "",
      assets: [
        require("../assets/arcadepusher_assets_0.png"),
        require("../assets/arcadepusher_assets_1.png"),
        require("../assets/arcadepusher_assets_2.png"),
      ],
    },
    {
      icon: require("../assets/slotsgo_icon.png"),
      name: "slotsGo",
      downloadUrl: "https://slotsgo.onelink.me/55Zq/57b7237f",
      banner: require("../assets/slotsgo_banner.jpg"),
      text: "",
      assets: [
        null,
        require("../assets/slotsgo_assets_01.png"),
        require("../assets/slotsgo_assets_02.png"),
      ],
    },
    {
      icon: require("../assets/candypusher_icon.png"),
      name: "candyPusher",
      downloadUrl: "https://candypusher.onelink.me/Z7Np/c66ab3a",
      banner: require("../assets/candypusher_banner.jpg"),
      text: "",
      assets: [],
    },
    {
      icon: require("../assets/plinkomania_icon.png"),
      name: "plinkoMania",
      downloadUrl: "https://plinkotest.onelink.me/NLBj/d0893d7",
      banner: require("../assets/plinkomania_banner.jpg"),
      text: "",
      assets: [],
    },
    {
      icon: require("../assets/plinkogo_icon.png"),
      name: "plinkoGo",
      downloadUrl: "https://plinkogo.onelink.me/DndE/980e3701",
      banner: require("../assets/plinkogo_banner.jpg"),
      text: "",
      assets: [],
    },
    {
      icon: require("../assets/binggo_icon.png"),
      name: "bingooo",
      downloadUrl: "https://bingooo.onelink.me/d98B/ad5b569f",
      banner: require("../assets/binggo_banner.jpg"),
      text: "",
      assets: [
        null,
        require("../assets/binggo_assets_1.png"),
        require("../assets/binggo_assets_0.png"),
      ],
    },
  ],
  server: {
    baseUrl: "https://fkz3gphuoa.execute-api.us-west-2.amazonaws.com/Prod",
  },
};

export default config;
