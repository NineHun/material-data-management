/**
 *
 * @param {HTMLElement} el       The element to capture.  Must be visible.
 * @param {string} fileName      The desired filename for the PDF.
 */
export async function saveRekapPdfFromElement(el, fileName = "rekap_investasi.pdf") {
  if (!el) return;
  const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
    import("jspdf"),
    import("html2canvas"),
  ]);

  const canvas = await html2canvas(el, { scale: 2, useCORS: true, scrollY: -window.scrollY });
  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const imgProps = pdf.getImageProperties(imgData);
  const ratio = imgProps.width / imgProps.height;
  const imgWidth = pageWidth;
  const imgHeight = imgWidth / ratio;
  let position = 0;

  pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
  let heightLeft = imgHeight - pageHeight;

  while (heightLeft > 0) {
    position = position - pageHeight;
    pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }
  pdf.save(fileName);
}