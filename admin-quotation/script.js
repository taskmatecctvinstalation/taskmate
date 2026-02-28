// ===================================
// script.js – TaskMate CCTV (FINAL)
// ===================================

// -------------------------------
// Set Today Date
// -------------------------------
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("todayDate").innerText =
    new Date().toLocaleDateString();

  populateQty();
  initCalculation();
  updateTotals();
});

// -------------------------------
// Populate Quantity (1–100)
// -------------------------------
function populateQty() {
  document.querySelectorAll(".qty").forEach(select => {
    let options = `<option value="">Qty</option>`;
    for (let i = 1; i <= 100; i++) {
      options += `<option value="${i}">${i}</option>`;
    }
    select.innerHTML = options;
  });
}

// -------------------------------
// Row Calculation
// -------------------------------
function updateRowAmount(row) {
  const qty   = parseFloat(row.querySelector(".qty").value) || 0;
  const price = parseFloat(row.querySelector(".price").value) || 0;

  const total = qty * price;
  row.querySelector(".amount").value = total.toFixed(2);

  updateTotals();
}

// -------------------------------
// Total / GST / Grand Total
// -------------------------------
function updateTotals() {
  let subtotal = 0;

  document.querySelectorAll(".quotation-row").forEach(row => {
    subtotal += parseFloat(row.querySelector(".amount").value) || 0;
  });

  const gst = subtotal * 0.18;
  const grandTotal = subtotal + gst;

  document.getElementById("subtotal").value   = subtotal.toFixed(2);
  document.getElementById("gst").value        = gst.toFixed(2);
  document.getElementById("grandtotal").value = grandTotal.toFixed(2);
}

// -------------------------------
// Init Event Listeners
// -------------------------------
function initCalculation() {
  document.querySelectorAll(".quotation-row").forEach(row => {
    row.querySelector(".qty").addEventListener("change", () => {
      updateRowAmount(row);
    });

    row.querySelector(".price").addEventListener("input", () => {
      updateRowAmount(row);
    });
  });
}

// ===================================
// PDF Download (DESKTOP EXACT COPY)
// ===================================
document.getElementById("downloadPDF").addEventListener("click", () => {
  const { jsPDF } = window.jspdf;
  const container = document.querySelector(".container");

  html2canvas(container, {
    scale: 2,
    useCORS: true
  }).then(canvas => {

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = 210;
    const pdfHeight = 297;

    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    pdf.save("TaskMate_CCTV_Quotation.pdf");
  });
});
