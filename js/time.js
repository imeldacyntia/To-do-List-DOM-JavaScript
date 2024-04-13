function updateDateTime() {
    var dt = new Date();
    document.getElementById("datetime").innerHTML = dt.toLocaleString();
}

// Memanggil fungsi updateDateTime setiap detik
setInterval(updateDateTime, 1000);
