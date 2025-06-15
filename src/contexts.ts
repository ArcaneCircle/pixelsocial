import { createContext } from "react";

import { Manager } from "~/lib/manager";

export const ManagerContext = createContext<Manager>(
  // @ts-ignore
  null,
);

export const PageContext = createContext<{
  pageData: PageData;
  setPage: (pageData: PageData) => void;
}>(
  // @ts-ignore
  null,
);
