const simpananBelanja = localStorage.getItem("daftarBelanja");
const simpananLaporan = localStorage.getItem("laporan");

let daftarBelanja = simpananBelanja ? JSON.parse(simpananBelanja) : [];
let laporan = simpananLaporan ? JSON.parse(simpananLaporan) : [];

let totalTransaksi = 0;

function tambahProduk() {
  const select = document.getElementById("produk");
  const jumlah = parseInt(document.getElementById("jumlah").value);
  const produk = select.value;
  const harga = parseInt(
    select.options[select.selectedIndex]?.dataset?.harga || 0
  );

  if (!produk || !jumlah || jumlah <= 0 || isNaN(harga)) {
    alert("Lengkapi data produk!");
    return;
  }

  daftarBelanja.push({ produk, harga, jumlah });
  localStorage.setItem("daftarBelanja", JSON.stringify(daftarBelanja));
  renderTabel();

  document.getElementById("produk").value = "";
  document.getElementById("jumlah").value = "";
}

function renderTabel() {
  const tbody = document.querySelector("#daftarProduk tbody");
  tbody.innerHTML = "";
  let total = 0;

  daftarBelanja.forEach((item, index) => {
    const subtotal = item.harga * item.jumlah;
    total += subtotal;
    const row = `<tr>
<td>${item.produk}</td>
<td>Rp${item.harga.toLocaleString()}</td>
<td>${item.jumlah}</td>
<td>Rp${subtotal.toLocaleString()}</td>
<td><button class="btn btn-danger" onclick="hapusItem(${index})">Hapus</button></td>
</tr>`;
    tbody.innerHTML += row;
  });

  totalTransaksi = total;
  document.getElementById("totalBayar").innerText =
    total.toLocaleString();
  hitungKembalian();
}

function hapusItem(index) {
  daftarBelanja.splice(index, 1);
  localStorage.setItem("daftarBelanja", JSON.stringify(daftarBelanja));
  renderTabel();
}

function hitungKembalian() {
  const bayar = parseInt(document.getElementById("bayar").value) || 0;
  const kembalian = bayar - totalTransaksi;
  document.getElementById("kembalian").innerText =
    kembalian >= 0 ? kembalian.toLocaleString() : "0";
}

document
  .getElementById("bayar")
  .addEventListener("input", hitungKembalian);

  function cetakStruk() {
    if (daftarBelanja.length === 0) return alert("Belum ada produk!");
  
    const now = new Date();
    const tanggal = now.toISOString();
    const transaksiId = Date.now();
  
    let struk = `Bakso Pak Yanto\n\nTanggal : ${now.toLocaleString()}\n\nBeli :\n`;
  
    daftarBelanja.forEach((item) => {
      struk += `${item.produk} x${item.jumlah} = Rp${(
        item.harga * item.jumlah
      ).toLocaleString()}\n`;
    });
  
    struk += `\nTotal: Rp${totalTransaksi.toLocaleString()}`;
    const bayar = parseInt(document.getElementById("bayar").value) || 0;
  
    if (bayar < totalTransaksi) {
      return alert("Uang yang dibayar tidak cukup!");
    }
  
    const kembalian = bayar - totalTransaksi;
    struk += `\nBayar : Rp${bayar.toLocaleString()}\nKembalian : Rp${(kembalian >= 0 ? kembalian : 0).toLocaleString()}`;
  
    struk += `\n\n*Terima kasih telah membeli Bakso di sini!*\n`;
  
    document.getElementById("struk").innerText = struk;
  
    let laporan = JSON.parse(localStorage.getItem("laporan")) || [];
  
    const sudahAda = laporan.some(
      (item) => item.total === totalTransaksi && item.waktu === tanggal
    );
  
    if (!sudahAda) {
      laporan.push({
        id: transaksiId,
        waktu: tanggal,
        produk: daftarBelanja
          .map((item) => `${item.produk} x${item.jumlah}`)
          .join(", "),
        total: totalTransaksi,
        bulan: now.getMonth(),
      });
      localStorage.setItem("laporan", JSON.stringify(laporan));
    }
  }
  
function printStruk() {
  const strukText = document.getElementById("struk").innerText;
  if (!strukText) return alert("Struk belum ditampilkan!");
  const w = window.open();
  w.document.write(`<pre>${strukText}</pre>`);
  w.print();
  w.close();
}

function resetSemua() {
  daftarBelanja = [];
  totalTransaksi = 0;
  document.querySelector("#daftarProduk tbody").innerHTML = "";
  document.getElementById("totalBayar").innerText = "0";
  document.getElementById("bayar").value = "";
  document.getElementById("kembalian").innerText = "0";
  document.getElementById("struk").innerText = "";
  localStorage.removeItem("daftarBelanja");
}

function openLaporanModal() {
  document.getElementById("laporanModal").style.display = "flex";
}

function closeLaporanModal() {
  document.getElementById("laporanModal").style.display = "none";
}

function tampilkanLaporan(tipe) {
  document.getElementById("laporanHarian").style.display = "none";
  document.getElementById("laporanBulanan").style.display = "none";

  const now = new Date();
  const today = now.getDate();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();

  if (tipe === "harian") {
    const tbody = document.getElementById("harianBody");
    tbody.innerHTML = "";

    laporan.forEach((item) => {
      const waktu = new Date(item.waktu);
      if (
        waktu.getDate() === today &&
        waktu.getMonth() === thisMonth &&
        waktu.getFullYear() === thisYear
      ) {
        tbody.innerHTML += `<tr>
    <td>${item.waktu}</td>
    <td>${item.produk}</td>
    <td>Rp${item.total.toLocaleString()}</td>
  </tr>`;
      }
    });

    document.getElementById("laporanHarian").style.display = "block";
  }

  if (tipe === "bulanan") {
    const tbody = document.getElementById("bulananBody");
    const totalBulan = laporan
      .filter((item) => {
        const waktu = new Date(item.waktu);
        return (
          waktu.getMonth() === thisMonth &&
          waktu.getFullYear() === thisYear
        );
      })
      .reduce((sum, item) => sum + item.total, 0);

    tbody.innerHTML = `<tr><td>Total Bulanan</td><td>Rp${totalBulan.toLocaleString()}</td></tr>`;
    document.getElementById("laporanBulanan").style.display = "block";
  }
}

function hapusLaporan() {
  if (confirm("Yakin ingin menghapus semua laporan?")) {
    laporan = [];
    localStorage.removeItem("laporan");
    document.getElementById("harianBody").innerHTML = "";
    document.getElementById("bulananBody").innerHTML = "";
  }
}

renderTabel();
function logout() {
  document.getElementById("loadingScreen").style.display = "flex";

  setTimeout(() => {
    window.location.href = "index.html";
  }, 2500);
}
