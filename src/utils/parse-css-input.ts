export const colorVariables = [
  "background",
  "foreground",
  "card",
  "card-foreground",
  "popover",
  "popover-foreground",
  "primary",
  "primary-foreground",
  "secondary",
  "secondary-foreground",
  "muted",
  "muted-foreground",
  "accent",
  "accent-foreground",
  "destructive",
  "destructive-foreground",
  "border",
  "input",
  "ring",
  "chart-1",
  "chart-2",
  "chart-3",
  "chart-4",
  "chart-5",
];

export const parseCssInput = (input: string) => {
  const lightColors: Record<string, string> = {};
  const darkColors: Record<string, string> = {};

  try {
    const rootMatch = input.match(/:root\s*{([^}]+)}/)?.[1];
    const darkMatch = input.match(/\.dark\s*{([^}]+)}/)?.[1];

    const parseVars = (str: string, target: Record<string, string>) => {
      const vars = str.match(/--[^:]+:\s*[^;]+/g) || [];
      vars.forEach((v) => {
        const [name, value] = v.split(":").map((s) => s.trim());
        const cleanName = name.replace("--", "");
        if (colorVariables.includes(cleanName) || cleanName.startsWith("base-")) {
          target[cleanName] = value;
        }
      });
    };

    if (rootMatch) parseVars(rootMatch, lightColors);
    if (darkMatch) parseVars(darkMatch, darkColors);
  } catch (error) {
    console.error("Error parsing CSS input:", error);
  }

  return { lightColors, darkColors };
};
