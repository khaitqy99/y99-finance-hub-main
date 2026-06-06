declare module "*.png" {
  const src: string;
  export default src;
}

declare module "*.jpg" {
  const src: string;
  export default src;
}

declare module "*.jpeg" {
  const src: string;
  export default src;
}

declare module "*.webp" {
  const src: string;
  export default src;
}

import "react";

declare module "react" {
  interface ImgHTMLAttributes<T> {
    src?: string | { src: string } | undefined;
  }
}

export {};
