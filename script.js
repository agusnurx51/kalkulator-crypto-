const hasilBox = document.getElementById("hasil");
const hargaJualInput = document.getElementById("hargaJual");
const feeInput = document.getElementById("fee");
const coinContainer = document.getElementById("coin-container");
const addCoinBtn = document.getElementById("addCoin");

// Formatter
const currencyFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  minimumFractionDigits: 0,
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

// Event listeners
hargaJualInput.addEventListener("input", hitung);
feeInput.addEventListener("input", hitung);
coinContainer.addEventListener("input", hitung);

addCoinBtn.addEventListener("click", () => {
  const coinGroup = document.createElement("div");
  coinGroup.classList.add("coin-group");
  coinGroup.innerHTML = `
    <div class="input-group">
      <label>Modal (IDR / USDT)</label>
      <span class="input-icon">💰</span>
      <input type="number" class="modal" placeholder="contoh: 1000000">
    </div>
    <div class="input-group">
      <label>Harga Beli per Koin</label>
      <span class="input-icon">₿</span>
      <input type="number" class="hargaBeli" placeholder="contoh: 50000">
    </div>
    <button type="button" class="removeCoin">❌ Hapus</button>
  `;
  coinContainer.appendChild(coinGroup);

  // Event untuk tombol hapus
  coinGroup.querySelector(".removeCoin").addEventListener("click", () => {
    coinGroup.remove();
    hitung();
  });
});

function hitung() {
  const hargaJual = parseFloat(hargaJualInput.value);
  const feePersen = parseFloat(feeInput.value) / 100;

  const modalInputs = document.querySelectorAll(".modal");
  const hargaBeliInputs = document.querySelectorAll(".hargaBeli");

  let totalModal = 0;
  let totalKoin = 0;

  modalInputs.forEach((modalInput, i) => {
    const modal = parseFloat(modalInput.value);
    const hargaBeli = parseFloat(hargaBeliInputs[i].value);
    if (!isNaN(modal) && !isNaN(hargaBeli) && modal > 0 && hargaBeli > 0) {
      totalModal += modal;
      totalKoin += modal / hargaBeli;
    }
  });

  if (totalKoin <= 0 || !hargaJual || hargaJual <= 0 || isNaN(feePersen)) {
    hasilBox.innerHTML = `<p class="placeholder">👉 Hasil perhitungan akan muncul di sini.</p>`;
    return;
  }

  // Nilai jual kotor
  const nilaiJual = totalKoin * hargaJual;

  // Hitung fee
  const feeBeli = totalModal * feePersen;
  const feeJual = nilaiJual * feePersen;
  const totalFee = feeBeli + feeJual;

  // Profit bersih sudah dipotong fee
  const profitBersih = nilaiJual - totalModal - totalFee;

  // Persentase dihitung tanpa fee (tetap murni harga jual vs beli)
  const persenProfit = (nilaiJual - totalModal) / totalModal;

  const profitClass = profitBersih >= 0 ? "profit" : "loss";
  const profitIcon = profitBersih >= 0 ? "🟢" : "🔴";

  hasilBox.innerHTML = `
    <ul>
      <li><span>Total Modal</span><strong>${currencyFormatter.format(totalModal)}</strong></li>
      <li><span>Total Koin</span><strong>${numberFormatter.format(totalKoin)}</strong></li>
      <li><span>Nilai Aset Saat Dijual</span><strong>${currencyFormatter.format(nilaiJual)}</strong></li>
      <li><span>Total Biaya (Fee)</span><strong>${currencyFormatter.format(totalFee)}</strong></li>
      <li style="padding-top: 15px; margin-top: 5px; border-top: 2px solid #475569;">
        <span>Profit / Loss Bersih</span>
        <strong class="${profitClass}">${currencyFormatter.format(profitBersih)}</strong>
      </li>
      <li>
        <span>Persentase Profit / Loss</span>
        <strong class="${profitClass}">${profitIcon} ${percentFormatter.format(persenProfit)}</strong>
      </li>
    </ul>
  `;
}

document.addEventListener("DOMContentLoaded", hitung);
