import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import "@/assets/css/Tailwind.css";
import VueGoogleMaps from "@fawmi/vue-google-maps";

createApp(App)
  .use(router)
  .use(VueGoogleMaps, {
    load: {
      key: "AIzaSyCl0-QiTyl1FEFYZB_Cp4LuUKPHnnh20LA",
      libraries: "places",
    },
  })
  .mount("#app");
