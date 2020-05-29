export const triggerOutlook = (email, subject) => {
  const body = escape(window.document.title + String.fromCharCode(13)+ window.location.href)
  window.location.href = `mailto:${email}?body=${body}&subject=${subject}`
}