let daftarBelanja = [];
let totalTransaksi = 0;

document.getElementById("menu-bakso").addEventListener("change", function () {
  const selected = this.value;
  document.getElementById("input-harga-optional").style.display =
    selected === "Bakso Optional" ? "block" : "none";
  document.getElementById("jumlah-bakso-container").style.display = 
    selected ? "block" : "none";  
});

function tambahProduk() {
  const menuBakso = document.getElementById("menu-bakso");
  const jumlahBakso = parseInt(document.getElementById("jumlah-bakso").value);
  const baksoSelected = menuBakso.value;

  let hargaBakso;
  if (baksoSelected === "Bakso Optional") {
    hargaBakso = parseInt(document.getElementById("harga-optional").value || 0);
    if (hargaBakso <= 0) {
      alert("Masukkan harga untuk Bakso Optional!");
      return;
    }
  } else {
    hargaBakso = parseInt(menuBakso.options[menuBakso.selectedIndex]?.dataset?.harga || 0);
  }

  const menuTambahan = document.getElementById("menu-tambahan");
  const jumlahTambahan = parseInt(document.getElementById("jumlah-tambahan").value);
  const tambahanSelected = menuTambahan.value;
  const hargaTambahan = parseInt(menuTambahan.options[menuTambahan.selectedIndex]?.dataset?.harga || 0);

  const menuMinuman = document.getElementById("menu-minuman");
  const jumlahMinuman = parseInt(document.getElementById("jumlah-minuman").value);
  const minumanSelected = menuMinuman.value;
  const hargaMinuman = parseInt(menuMinuman.options[menuMinuman.selectedIndex]?.dataset?.harga || 0);

  if ((jumlahBakso <= 0 && jumlahTambahan <= 0 && jumlahMinuman <= 0) || 
      (!baksoSelected && !tambahanSelected && !minumanSelected)) {
    alert("Lengkapi data produk dengan memilih menu dan jumlah!");
    return;
  }

  if (baksoSelected && jumlahBakso > 0) {
    daftarBelanja.push({ produk: baksoSelected, harga: hargaBakso, jumlah: jumlahBakso });
  }

  if (tambahanSelected && jumlahTambahan > 0) {
    daftarBelanja.push({ produk: tambahanSelected, harga: hargaTambahan, jumlah: jumlahTambahan });
  }

  if (minumanSelected && jumlahMinuman > 0) {
    daftarBelanja.push({ produk: minumanSelected, harga: hargaMinuman, jumlah: jumlahMinuman });
  }

  renderTabel();
  resetForm();
}

function renderTabel() {
  const tbody = document.querySelector("#daftarProduk tbody");
  tbody.innerHTML = "";
  let total = 0;

  if (daftarBelanja.length === 0) {
    tbody.innerHTML = "<tr><td colspan='5'>Tidak ada produk dalam daftar belanja</td></tr>";
    document.getElementById("totalBayar").innerText = "Rp0";
    return;
  }

  daftarBelanja.forEach((item, index) => {
    if (item.harga <= 0 || item.jumlah <= 0) {
      console.error(`Produk ${item.produk} memiliki harga atau jumlah tidak valid.`);
      return;
    }

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
  document.getElementById("totalBayar").innerText = "Rp" + total.toLocaleString();
}

function resetForm() {
  document.getElementById("menu-bakso").selectedIndex = 0;
  document.getElementById("harga-optional").value = "";
  document.getElementById("input-harga-optional").style.display = "none";
  document.getElementById("jumlah-bakso").value = ""; 
  
  document.getElementById("menu-tambahan").selectedIndex = 0;
  document.getElementById("jumlah-tambahan").value = "";
  document.getElementById("menu-minuman").selectedIndex = 0;
  document.getElementById("jumlah-minuman").value = "";

  document.getElementById("jumlah-tambahan-container").style.display = "none";
  document.getElementById("jumlah-minuman-container").style.display = "none";
}

function hapusItem(index) {
  if (index < 0 || index >= daftarBelanja.length) {
    alert("Item yang ingin dihapus tidak ditemukan!");
    return;
  }

  daftarBelanja.splice(index, 1); 
  renderTabel(); 
}

function hitungKembalian() {
  const bayar = parseInt(document.getElementById("bayar").value) || 0;
  
  if (isNaN(bayar) || bayar < 0) {
    document.getElementById("kembalian").innerText = "Input bayar tidak valid";
    return;
  }

  const kembalian = bayar - totalTransaksi;

  if (kembalian < 0) {
    document.getElementById("kembalian").innerText = "Uang bayar kurang!";
  } else {
    document.getElementById("kembalian").innerText = kembalian.toLocaleString();
  }
}

document.getElementById("bayar").addEventListener("input", hitungKembalian);
document.getElementById("menu-bakso").addEventListener("change", function () {
  const jumlahContainer = document.getElementById("jumlah-bakso-container");
  
  if (this.value) {
    jumlahContainer.style.display = "block";
  } else {
    jumlahContainer.style.display = "none";
    document.getElementById("jumlah-bakso").value = "";
  }
});

document.getElementById("menu-tambahan").addEventListener("change", function () {
  const jumlahContainer = document.getElementById("jumlah-tambahan-container");
  
  if (this.value) {
    jumlahContainer.style.display = "block";
  } else {
    jumlahContainer.style.display = "none";
    document.getElementById("jumlah-tambahan").value = "";
  }
});

document.getElementById("menu-minuman").addEventListener("change", function () {
  const jumlahContainer = document.getElementById("jumlah-minuman-container");
  
  if (this.value) {
    jumlahContainer.style.display = "block";
  } else {
    jumlahContainer.style.display = "none";
    document.getElementById("jumlah-minuman").value = "";
  }
});

function validasiJumlahProduk() {
  const jumlahBakso = parseInt(document.getElementById("jumlah-bakso").value) || 0;
  const jumlahTambahan = parseInt(document.getElementById("jumlah-tambahan").value) || 0;
  const jumlahMinuman = parseInt(document.getElementById("jumlah-minuman").value) || 0;

  
  if ((jumlahBakso > 0 && !document.getElementById("menu-bakso").value) ||
      (jumlahTambahan > 0 && !document.getElementById("menu-tambahan").value) ||
      (jumlahMinuman > 0 && !document.getElementById("menu-minuman").value)) {
    alert("Pilih menu terlebih dahulu sebelum memasukkan jumlah produk!");
    return false;
  }
  
  
  if (jumlahBakso <= 0 && jumlahTambahan <= 0 && jumlahMinuman <= 0) {
    alert("Jumlah produk tidak boleh 0!");
    return false;
  }

  return true;
}

document.getElementById("tambah-produk").addEventListener("click", function () {
  if (validasiJumlahProduk()) {
    tambahProduk();
  }
});
function cetakStruk() {
  const strukContainer = document.getElementById("struk");
  if (!strukContainer || daftarBelanja.length === 0) {
    alert("Belum ada transaksi untuk ditampilkan!");
    return;
  }

  let strukContent = "============================\n";
  strukContent += "        Bakso Pak Yanto        \n";
  strukContent += "Podosugih Pekalongan Barat\n";
  strukContent += "============================\n";
  strukContent += `Kasir: Galang\n`;
  strukContent += `Tanggal: ${new Date().toLocaleString()}\n\n`;

  daftarBelanja.forEach((item) => {
    strukContent += `${item.produk} x${item.jumlah} - Rp${(item.harga * item.jumlah).toLocaleString()}\n`;
  });

  strukContent += "\n---------------------------\n";
  strukContent += `Total     : Rp${totalTransaksi.toLocaleString()}\n`;
  strukContent += `Bayar     : Rp${document.getElementById("bayar").value}\n`;
  strukContent += `Kembalian : Rp${document.getElementById("kembalian").innerText}\n`;
  strukContent += "---------------------------\n";
  strukContent += "     Terima Kasih 🙏     \n";
  strukContent += "============================\n";

  strukContainer.innerText = strukContent;

  // Menyimpan transaksi ke localStorage
  const transaksi = JSON.parse(localStorage.getItem("transaksi")) || [];
  const newTransaksi = {
    tanggal: new Date().toISOString(),
    produk: daftarBelanja.map(item => ({ produk: item.produk, jumlah: item.jumlah })),
    total: totalTransaksi,
    metode: document.getElementById("bayar").value >= totalTransaksi ? 'Tunai' : 'Online'
  };
  transaksi.push(newTransaksi);
  localStorage.setItem("transaksi", JSON.stringify(transaksi));
}

function printStruk() {
  const struk = document.getElementById("struk");
  if (!struk || struk.innerText.trim() === "") {
    alert("Struk belum ditampilkan! Silakan pastikan Anda sudah menambahkan produk dan melakukan pembayaran.");
    return;
  }

  try {
    const w = window.open();
    if (!w) {
      alert("Browser Anda tidak mendukung pencetakan melalui jendela baru.");
      return;
    }

    const style = `
      <style>
        body {
          font-family: 'Courier New', monospace;
          text-align: left;
          background: white;
          color: black;
        }
        .struk {
          width: 300px;
          margin: auto;
          text-align: left;
          font-size: 14px;
        }
        .footer {
          margin-top: 10px;
          text-align: left;
          font-style: italic;
        }
      </style>
    `;

    const html = `
      ${style}
      <div class="struk">
        <pre>${struk.innerText}</pre>
      </div>
    `;

    w.document.write(html);
    w.document.close();

    w.onload = function () {
      w.focus();
      w.print();
      w.close();
    };
  } catch (error) {
    alert("Terjadi kesalahan saat mencoba mencetak struk: " + error.message);
  }
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
  localStorage.removeItem("laporan");
}

function openLaporanModal() {
  document.getElementById("laporanModal").style.display = "flex";
}

function closeLaporanModal() {
  document.getElementById("laporanModal").style.display = "none";
}

function formatTanggalIndonesia(tanggalString) {
  const date = new Date(tanggalString);
  const options = {
    day: '2-digit',
    month: 'long', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Jakarta'
  };
  return new Intl.DateTimeFormat('id-ID', options).format(date) + ' WIB';
}


function tampilkanLaporan(tipe) {
  const laporanHarian = document.getElementById("laporanHarian");
  const laporanBulanan = document.getElementById("laporanBulanan");
  
  laporanHarian.style.display = "none";
  laporanBulanan.style.display = "none";

  if (tipe === "harian") {
    laporanHarian.style.display = "block";
    const transaksiHarian = getTransaksiHarian();
    const tbodyHarian = document.getElementById("harianBody");
  
    tbodyHarian.innerHTML = "";
  
    if (transaksiHarian.length > 0) {
      transaksiHarian.forEach((transaksi) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${formatTanggalIndonesia(transaksi.tanggal)}</td>
          <td>${transaksi.produk.map(p => `${p.produk} x${p.jumlah}`).join(", ")}</td>
          <td>Rp${transaksi.total.toLocaleString("id-ID")}</td>
          <td>${transaksi.metode}</td>
        `;
        tbodyHarian.appendChild(row);
      });
      
    } else {
      tbodyHarian.innerHTML = "<tr><td colspan='4'>Tidak ada transaksi hari ini.</td></tr>";
    }
  } else if (tipe === "bulanan") {
    laporanBulanan.style.display = "block";
    const laporanBulananData = getLaporanBulanan(); 
    const tbodyBulanan = document.getElementById("bulananBody");
    
    tbodyBulanan.innerHTML = ""; 
    laporanBulananData.forEach((item) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${item.deskripsi}</td>
        <td>Rp${item.total.toLocaleString()}</td>
      `;
      tbodyBulanan.appendChild(row);
    });
  }
}

function getTransaksiHarian() {
  const transaksi = JSON.parse(localStorage.getItem("transaksi")) || [];
  const hariIni = new Date().toISOString().slice(0, 10); 

  const transaksiHarian = transaksi.filter((transaksi) => {
    const transaksiTanggal = transaksi.tanggal.split('T')[0]; 
    return transaksiTanggal === hariIni;
  });
  
  return transaksiHarian;
}

function getLaporanBulanan() {
  const transaksi = JSON.parse(localStorage.getItem("transaksi")) || [];
  const bulanIni = new Date().toISOString().slice(0, 7); 
  const transaksiBulanan = transaksi.filter((transaksi) => transaksi.tanggal.startsWith(bulanIni));
  
  if (transaksiBulanan.length === 0) {
    return [{ deskripsi: `Bulan ${bulanIni}`, total: 0 }];
  }

  const laporan = transaksiBulanan.reduce((acc, transaksi) => {
    const bulanTransaksi = transaksi.tanggal.slice(0, 7); 
    if (!acc[bulanTransaksi]) {
      acc[bulanTransaksi] = 0;
    }
    acc[bulanTransaksi] += transaksi.total;
    return acc;
  }, {});

  return Object.entries(laporan).map(([bulan, total]) => ({
    deskripsi: `Bulan ${bulan}`,
    total: total,
  }));
}

function hapusLaporan() {
  localStorage.clear();
  closeLaporanModal();
  alert("Semua laporan sudah terhapus.");
}

function cariLaporanTanggal() {
  const tanggalCari = document.getElementById("tanggalCari").value;
  const tbodyHarian = document.getElementById("harianBody");

  if (!tanggalCari) {
    alert("Silakan pilih tanggal terlebih dahulu!");
    return;
  }
  const transaksi = JSON.parse(localStorage.getItem("transaksi")) || [];
  const formattedTanggalCari = new Date(tanggalCari).toISOString().split('T')[0];
  const hasil = transaksi.filter((t) => t.tanggal.split('T')[0] === formattedTanggalCari);
  tbodyHarian.innerHTML = "";
  if (hasil.length === 0) {
    tbodyHarian.innerHTML = `<tr><td colspan="4">Tidak ada transaksi pada tanggal tersebut.</td></tr>`;
  } else {
    hasil.forEach((transaksi) => {
      const produkList = transaksi.produk.map(item => `${item.produk} x${item.jumlah}`).join(", ");
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${new Date(transaksi.tanggal).toLocaleDateString()}</td>
        <td>${produkList}</td>
        <td>Rp${transaksi.total.toLocaleString()}</td>
        <td>${transaksi.metode}</td>
      `;
      tbodyHarian.appendChild(row);
    });
  }
}
function logout() {
  document.getElementById("loadingScreen").style.display = "flex";

  setTimeout(() => {
    window.location.href = "index.html";
  }, 2500);
}
