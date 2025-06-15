/// <reference types="vite/client" />
import { Webxdc } from "@webxdc/types";

declare global {
  interface Window {
    webxdc: Webxdc<Payload>;
  }
}
