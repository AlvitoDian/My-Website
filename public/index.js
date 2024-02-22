document
  .getElementById("kontakForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Menghentikan pengiriman form secara default

    // Mengambil nilai input dari form
    var nama = document.getElementById("nama").value;
    var email = document.getElementById("email").value;
    var pesan = document.getElementById("pesan").value;

    // Validasi input
    if (nama === "" || email === "" || pesan === "") {
      alert("Harap lengkapi semua field!");
      return;
    }

    // Membuat objek komentar baru
    var komentar = {
      nama: nama,
      email: email,
      pesan: pesan,
    };

    // Menambahkan komentar ke dalam list komentar
    var komentarList = document.getElementById("komentarList");
    var li = document.createElement("li");
    li.textContent =
      "Dari: " +
      komentar.nama +
      ", Email: " +
      komentar.email +
      ", Pesan: " +
      komentar.pesan;
    komentarList.appendChild(li);

    // Mengosongkan input form
    document.getElementById("nama").value = "";
    document.getElementById("email").value = "";
    document.getElementById("pesan").value = "";

    alert("Komentar berhasil dikirim!");
  });
