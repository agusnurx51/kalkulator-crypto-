// --- Get all input elements ---
const modalInput = document.getElementById("modal");
const hargaBeliInput = document.getElementById("hargaBeli");
const hargaJualInput = document.getElementById("hargaJual");
const feeInput = document.getElementById("fee");
const hasilBox = document.getElementById("hasil");

// --- Add event listeners to all inputs for real-time calculation ---
modalInput.addEventListener('input', hitung);
hargaBeliInput.addEventListener('input', hitung);
hargaJualInput.addEventListener('input', hitung);
feeInput.addEventListener('input', hitung);

// --- Create reusable number formatters ---
const currencyFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

const numberFormatter = new Intl.NumberFormat('id-ID', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 8,
});

const percentFormatter = new Intl.NumberFormat('id-ID', {
  style: 'percent',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

// --- Main calculation function ---
function hitung() {
  const modal = parseFloat(modalInput.value);
  const hargaBeli = parseFloat(hargaBeliInput.value);
  const hargaJual = parseFloat(hargaJualInput.value);
  const feePersen = parseFloat(feeInput.value) / 100;

  // --- Validation ---
  if (!modal || !hargaBeli || !hargaJual || isNaN(feePersen)) {
    hasilBox.innerHTML = `<p class="placeholder">👉 Hasilnya ada disin</p>`;
    return;
  }

  if (modal <= 0 || hargaBeli <= 0 || hargaJual <= 0 || feePersen < 0) {
    hasilBox.innerHTML = `<p class="placeholder" style="color:var(--accent-red);">⚠️ Input tidak boleh nol atau negatif.</p>`;
    return;
  }
  
  // --- Core Calculations ---
  const jumlahKoin = modal / hargaBeli;
  const nilaiJual = jumlahKoin * hargaJual;
  
  const feeBeli = modal * feePersen;
  const feeJual = nilaiJual * feePersen;
  const totalFee = feeBeli + feeJual;

  const profitBersih = nilaiJual - modal - totalFee;
  const persenBersih = profitBersih / modal;

  // --- Determine Profit/Loss for styling ---
  const profitClass = profitBersih >= 0 ? 'profit' : 'loss';
  const profitIcon = profitBersih >= 0 ? '🟢' : '🔴';

  // --- Display Results ---
  hasilBox.innerHTML = `
    <ul>
      <li>
        <span>Jumlah Koin</span>
        <strong>${numberFormatter.format(jumlahKoin)}</strong>
      </li>
      <li>
        <span>Nilai Aset Saat Dijual</span>
        <strong>${currencyFormatter.format(nilaiJual)}</strong>
      </li>
      <li>
        <span>Total Biaya (Fee)</span>
        <strong>${currencyFormatter.format(totalFee)}</strong>
      </li>
      <li style="padding-top: 15px; margin-top: 5px; border-top: 2px solid #475569;">
        <span>Profit / Loss Bersih</span>
        <strong class="${profitClass}">${currencyFormatter.format(profitBersih)}</strong>
      </li>
      <li>
        <span>Persentase Profit / Loss</span>
        <strong class="${profitClass}">${profitIcon} ${percentFormatter.format(persenBersih)}</strong>
      </li>
    </ul>
  `;
}

// --- Initial calculation on page load (if values are pre-filled) ---
document.addEventListener('DOMContentLoaded', hitung);
