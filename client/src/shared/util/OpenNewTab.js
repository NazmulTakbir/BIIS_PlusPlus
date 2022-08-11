export const openInNewTab = (args) => {
  let url = args[0];
  const newWindow = window.open(url, "_blank", "noopener,noreferrer");
  if (newWindow) newWindow.opener = null;
};
