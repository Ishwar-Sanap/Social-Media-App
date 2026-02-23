export const loadTheme = () => {
  const theme = localStorage.getItem("theme") || "light";
  return theme;
};

export const saveTheme = (theme) => {
  localStorage.setItem("theme", theme);
};
