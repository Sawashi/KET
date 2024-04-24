import { createContext, PropsWithChildren, useContext, useState } from "react";

type ColorMode = "light" | "dark";

type ColorModeContextType = {
  mode: ColorMode;
  toggleMode: () => void;
};

export const ColorModeContext = createContext<ColorModeContextType>({
  mode: "light",
  toggleMode: () => {},
});

export const ColorModeContextProvider: React.FC<PropsWithChildren<{}>> = ({
  children,
}) => {
  const [mode, setMode] = useState<ColorMode>("light");

  const toggleMode = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  return (
    <ColorModeContext.Provider value={{ mode, toggleMode }}>
      {children}
    </ColorModeContext.Provider>
  );
};
